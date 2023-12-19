import Section from "../model/Section.js";

export const instructorRoutine = async(req,res)=>{
    try {
        const {id:instructorId}=req.params;
        res.redirect(307,`/instructor/${instructorId}/routine`)
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

export const getRooms = async(req,res)=>{
    try {
        const rooms=await Section.find().distinct('room')
        res.status(200).json(rooms)
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}

export const roomRoutine = async(req,res)=>{
    try {
        const {room}=req.params;
        const sec=await Section.find({room}).populate('course','code credits').select('course routine section')
        const inx={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6}
        const r={days:Object.keys(inx),timing:{}}
        sec.forEach(e=>{
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

export const courseRoutine = async(req,res)=>{
    try {
        const {id}=req.params;
        const sec=await Section.find({course:id}).select('routine section').lean()
        const r={};
        sec.forEach(e=>r['Section: '+e.section]=e.routine.map(f=>`${f.day}: ${f.startTime} - ${f.endTime}`))
        res.status(200).json(r)
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
}
