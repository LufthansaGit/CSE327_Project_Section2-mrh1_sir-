import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import {addTempDataIfEmpty} from "./data/parse.js"
import instructorRoutes from './routes/instructor.js'
import courseRoutes from './routes/course.js'
import routineRoutes from './routes/schedules.js'
import statRoutes from './routes/stats.js'


// CONFIGS

const __filename=fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app=express()
app.use(express.json())
app.use('*', cors({ 
    AccessControlAllowOrigin: '*',  
    origin: '*',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' 
}))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan('common'))
app.use(bodyParser.json({limit:"10mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"10mb",extended:true}))
app.use("/assets",express.static(path.join(__dirname,'public/assets')))



app.use('/instructor',instructorRoutes)
app.use('/course',courseRoutes)
app.use('/routine',routineRoutes)
app.use('/stats',statRoutes)


const PORT=process.env.PORT||5000;

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(async()=>{
    await addTempDataIfEmpty()
}).then(async()=>{
    app.listen(PORT,()=>console.log('\n\x1b[36m%s\x1b[0m\n\x1b[35mPORT: %s\x1b[0m', 'SERVER STARTED!',PORT))
}).catch(error=>console.error('\x1b[31m%s\x1b[0m',error))