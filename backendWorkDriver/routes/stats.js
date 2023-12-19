import express from "express";
import Instructor from "../model/Instructor.js";
import Course from "../model/Course.js";

const router = express.Router();

router.get("/", async(req,res)=>{
    try{
        const i=await Instructor.find().count(),c=await Course.find().count();
        res.status(200).json({instructors:i,courses:c})
    } catch(err) {
        console.error(err)
        res.status(409).json({ msg: err.message });
    }
})



export default router;