import mongoose from "mongoose";


const Course = mongoose.model('Course', new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            min: 2,
            max: 9,
        },
        title: String,
        credits: {type:Number,default:3},
        courseType: String,
        prereqs: [{ type: mongoose.Schema.Types.ObjectId,ref:'Course'}],
        parallels: [{ type: mongoose.Schema.Types.ObjectId,ref:'Course'}]
    }
))

export default Course;