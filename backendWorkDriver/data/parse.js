import path from "path"
import { fileURLToPath } from "url"
import nReadlines from 'n-readlines';
import Instructor from "../model/Instructor.js";
import Course from "../model/Course.js";
import Section from "../model/Section.js";

const __filename=fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const instructors=async()=>{
    const file = new nReadlines(path.join(__dirname,'faculty.csv'));
    let buff,line;
    file.next() // skip header
    while(buff=file.next()) {
        line=buff.toString('utf-8').trim();
        let z=line.split(',');
        const obj={
            name:z[1],
            email:z[3],
            initials: z[2],
            room: z[5],
            mobile:z[6],
            position:z[7]
        }
        if(await Instructor.findOne(obj)) {console.log(obj);continue;}
        const inst=new Instructor(obj)
        await inst.save();
    }
}

async function getOrAddCourse(code,credits) {
    let z=await Course.findOne({code})
    if(!z) {
        z=new Course({code,credits})
        await z.save()
    }
    return Promise.resolve(z.id)
}

async function getOrAddInstructor(initials,name) {
    let z=await Instructor.findOne({initials})
    if(!z) {
        z=new Instructor({initials,name,email:`${initials}@unrecognized.mail`})
        await z.save()
    }
    return Promise.resolve(z.id)
}

const courses=async()=>{
    const file = new nReadlines(path.join(__dirname,'courselist.csv'));
    let buff,line;
    let h=file.next().toString('utf-8').trim().split(',').map(e=>e.trim())

    while(buff=file.next()) {
        line=buff.toString('utf-8').trim();
        let z=line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        let obj={}
        for(let i=0;i<z.length-1;i++) obj[h[i]]=z[i].trim().replace('"','')
        if(z.at(-1).trim()) 
            obj[h.at(-1)] = 
                await Promise.all(
                    z.at(-1).trim().split(',').map(
                        async(e)=>await getOrAddCourse(...(e.trim().replace(/\(|\)|"|'/g,'').split(' ')).map(el=>el.trim()))
                    )
                )
        const newCourse=new Course({
            code:obj['Course Code'],
            title:obj['Course Title'],
            credits:obj['Credits'],
            courseType:obj['Course Type'],
            parallels:obj['Parallel Course and Credits']
        })
        await newCourse.save()
    }
}

const sections=async()=>{
    const file = new nReadlines(path.join(__dirname,'sections.csv'));
    let buff,line;
    let h=file.next().toString('utf-8').trim().split(',').map(e=>e.trim())

    while(buff=file.next()) {
        line=buff.toString('utf-8').trim();
        let z=line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        let obj={}
        for(let i=0,v;i<3;i++) {
            v=z[i].trim()
            if(h[i]=='Course') v=await getOrAddCourse(v)
            if(h[i]=='Instructor'){
                if(v.startsWith('TBA')) v=null;
                else v=await getOrAddInstructor(v);
            }
            obj[h[i]]=v
        }
        let ddays={S:z[5].includes('R')?'Saturday':'Sunday',M:'Monday',T:'Tuesday',W:'Wednesday',R:'Thursday',F:'Friday'}
        let routine=z[5].trim().split('').map(e=>({day:ddays[e],startTime:z[3].trim(),endTime:z[4].trim()}))
        const newSec=new Section({
            course:obj['Course'],
            // instructor:obj['Instructor'],
            section:+obj['Section'],
            room:Math.round(Math.random()*9000+1000),
            routine
        })
        await newSec.save()
    }
}

export const addTempDataIfEmpty=async()=>{
    if(!await Instructor.find().count()) 
        await instructors()
    if(!await Course.find().count()) 
        await courses()
    if(!await Section.find().count()) 
        await sections()
}