import mongoose from "mongoose";


const Section = mongoose.model('Section', new mongoose.Schema(
    {
        course: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course',
            required: true
        },
        instructor: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Instructor'
        },
        section: Number,
        seats: Number,
        room: String,
        isClosed: {type:Boolean, default:false},
        routine:[{
            day:String,
            startTime:String,
            endTime:String
        }]
    }
))

export default Section;