import Course from "../model/Course.js";
import Instructor from "../model/Instructor.js";
import Section from "../model/Section.js";


export const getCourseList = async(req,res)=>{
    try {
        const clist= await Course.find().select('code title credits').sort({code:'asc'})
        res.status(200).json(clist)
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

export const getSections=async(req,res)=>{
    try {
        const {id}=req.params;
        const clist= await Section.find({course:id}).populate('instructor','initials').lean()
        clist.forEach(e=>{
            e.days=e.routine.map(f=>f.day).join(', ')
            e.instructor=e.instructor?.initials||'TBA';
        })
        res.status(200).json(clist)
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

export const getDetails = async(req,res)=>{
    try {
        const {id}=req.params;
        const course = await Course.findById(id).populate({path:'prereqs parallels',select:'code -_id'}).select('-__v').lean()
        if(!course) throw new Error('No course found')
        const sections=await Section.find({course:id}).populate('instructor','initials -_id').select('-course').lean() ;
        sections.forEach(e=>{
            e.routine=e.routine.map(r=>`${r.day}: ${r.startTime} - ${r.endTime}`);
            e.instructor=e.instructor?.initials || 'TBA'
        });
        ['parallels','prereqs'].forEach(i=>(course[i]=course[i].map(f=>f.code)));
        res.status(200).json({course,sections})
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

export const getCoursesWithSections = async(req,res)=>{
    try {
        const clist=await Course.find().select('code title credits courseType').sort({code:'asc'}).lean();
        res.status(200).json(clist)
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

export const getCourseRoutine = async(req,res)=>{
    try{
        const {id}=req.params;
        const sections=await Section.find({course:id})
        res.status(200).json(sections)
    }catch(err){
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}


export const assignInstructor = async(req,res)=>{
    try {
        const {id:courseId}=req.params;
        const {courseCode,section,instructorId}=req.body;
        await Section.updateOne({course:courseId,section},{instructor:instructorId})
        await Instructor.updateOne({_id:instructorId},{'$push':{assigned:courseId}})
        res.status(200).json({msg:'success'})
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

export const removeInstructor = async(req,res)=>{
    try {
        const {id:courseId}=req.params;
        const {section,instructorId}=req.body;
        await Section.updateOne({course:courseId,section},{'$unset':{instructor:''}})
        await Instructor.updateOne({_id:instructorId},{'$pull':{assigned:courseId}})
        res.status(200).json({msg:'success'})
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

