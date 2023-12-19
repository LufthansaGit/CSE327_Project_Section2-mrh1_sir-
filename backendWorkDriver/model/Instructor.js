import mongoose from "mongoose";


const Instructor=mongoose.model('Instructor',new mongoose.Schema(
    {
        name:{
            type:String,
            min:2,
            max:50,
        },
        email:{
            type:String,
            unique:true,
        },
        initials: {type:String,required:true,unique:true},
        position: String,
        mobile: String,
        room: String,
        credits: {type:Number,default:0},
        assigned:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Section'
        }]
    },
    {timestamps:true}
))

export default Instructor;