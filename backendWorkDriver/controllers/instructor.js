import Instructor from "../model/Instructor.js";
import Section from "../model/Section.js";


export const createInstructor = async(req,res)=>{
    try {
        const {
            name,
            initials,
            email,
            position,
            mobile,
            room
        } = req.body;

        const newInstructor=new Instructor({
            name: name.charAt(0).toUpperCase()+name.substring(1),
            email: email.toLowerCase(),
            initials,
            position,
            mobile,
            room
        });
        const memb=await newInstructor.save();
        res.status(201).json(memb)
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
};


export const getAll = async(req,res)=> {
    try {
        const instructors= await Instructor.find().select('name initials');
        res.status(200).json(instructors)
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

export const getList = async(req,res)=> {
    try {
        const instructors= await Instructor.find().lean();
        const x=['Professor','Associate professor','Assistant Professor','Senior Lecturer','Lecturer'];
        instructors.forEach(i=>{
            if(!i.position) return i.ord=1000;
            const z=i.position.trim().toLowerCase();
            for(let j=0;j<x.length;j++)
                if(z.startsWith(x[j].toLowerCase())) return i.ord=j;
            return i.ord=900;
        })
        instructors.sort((a,b)=>a.ord-b.ord);
        res.status(200).json(instructors)
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

export const getInfo = async(req,res)=>{
    try {
        const {id}=req.params;
        const instructor = await Instructor.findById(id).populate('assigned','course section').select('-createdAt -updatedAt -__v')
        await instructor.populate('assigned.course','-_id code credits title')
        res.status(200).json(instructor)
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
};

export const getRoutine = async(req,res)=>{
    try {
        const {id}=req.params;
        const sections = await Section.find({instructor:id}).populate('course','code credits').select('course routine section').lean();
        const inx={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6}
        const r={days:Object.keys(inx),timing:{}}
        sections.forEach(e=>{
            e.routine.forEach(f=>{
                let s=`${f.startTime}-${f.endTime}`;
                let z=r.timing[s]||new Array(7)
                z[inx[f.day]]=e.course.code+' - '+e.section
                r.timing[s]=z
            })
        })
        res.status(200).json(r)
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

const routineClash=(r,r2)=>(
    r2.some(e=>{
        const s1=new Date('2023-1-1 '+e.startTime),e1=new Date('2023-1-1 '+e.endTime);
        return r.some(o=>o.routine.some(f=>{
            const s2=new Date('2023-1-1 '+f.startTime),e2=new Date('2023-1-1 '+f.endTime);
            return e.day==f.day && s1<=e2 && e1>=s2;
        }))
    })
)


export const assignCourse = async(req,res)=>{
    try {
        const {id:instructorId} = req.params;
        const {sectionId}=req.body;
        const sec=await Section.findById(sectionId).populate('course','code credits')
        const instructor = await Instructor.findById(instructorId).populate({path:'assigned',populate:'routine',select:'-_id routine'})
        if(!sec||!instructor) return res.status(400).json({msg:'Invalid data'})
        sec.instructor=instructor.id;
        if(!instructor.assigned.includes(sec.id)){
            if(instructor.credits+sec.course.credits>11)
                throw new Error("Can't assign more than 11 credits")
            if(routineClash(instructor.assigned,sec.routine))
                throw new Error('Routine clash with another course')
            instructor.credits+=sec.course?.credits||0;
            instructor.assigned.push(sec.id)
        }
        await instructor.save()
        await sec.save()
        res.status(200).json({msg:'success'})
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

export const removeCourse = async(req,res)=>{
    try {
        const {id:instructorId} = req.params;
        const {sectionId}=req.body;
        const sec=await Section.findById(sectionId).populate('course','credits')
        const instructor = await Instructor.findById(instructorId)
        if(!sec||!instructor) return res.status(400).json({msg:'Wrong course info'})
        sec.instructor=null
        if(instructor.assigned.includes(sec.id)){
            instructor.credits-=sec.course.credits;
            instructor.assigned=instructor.assigned.filter(id=>id!=sectionId)
        }
        await instructor.save()
        await sec.save()
        res.status(200).json({msg:'success'})
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

export const updateCourse=async(req,res)=>{
    try {
        const {id:newInstructorId} = req.params;
        const {courseId,section}=req.body;
        const sec=await Section.findOne({course:courseId,section})
        if(!sec) return res.status(400).json({msg:'Wrong course info'})
        const oldInstructor = await Instructor.findById(sec.instructor)
        if(oldInstructor) //remove prev faculty
            oldInstructor.assigned=oldInstructor.assigned.filter(e=>e._id!=courseId)
        await oldInstructor.save()
        const newInstructor=await Instructor.findById(newInstructorId)
        if(!newInstructor) return res.status(400).json({msg:'Invalid instructor info'})
        sec.instructor=newInstructor.id
        if(!newInstructor.assigned.includes(courseId))
            newInstructor.assigned.push(courseId)
        await newInstructor.save()
        await sec.save()
        res.status(200).json({msg:'success'})
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}