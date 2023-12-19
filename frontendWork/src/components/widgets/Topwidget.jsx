import { Autocomplete, Chip, Paper, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PropertyTable from "../PropertyTable";
import Routine from "../Routine";



export default function TopWidget({setAssigned,trigger}) {

    const [facultyList,setFList]=useState([]);
    const [routine,setRoutine]=useState();
    const [instructor,setInstructor]=useState()
    const [details,setDetails]=useState()
    
    useEffect(()=>{
        fetch(`${process.env.REACT_APP_BACKEND}/instructor/getAll`)
        .then(async(res)=>{
            let j = await res.json();
            if(!res.ok) throw new Error(j['msg'])
            setFList(j)
        }).catch(err=>{
            console.error(err)
        })
    },[])
    
    useEffect(()=>{
        if(!instructor?._id) {setDetails();setRoutine();setAssigned();return;}
        Promise.all([
            fetch(`${process.env.REACT_APP_BACKEND}/instructor/${instructor._id}`),
            fetch(`${process.env.REACT_APP_BACKEND}/instructor/${instructor._id}/routine`)
        ]).then(async([res1,res2])=>{
            const j1=await res1.json(), j2=await res2.json();
            if(!res1.ok) throw new Error(j1['msg'])
            if(!res2.ok) throw new Error(j2['msg'])
            const z={_id:instructor._id,assigned:[]};
            j1['assigned']=j1['assigned'].map(e=>{
                z.assigned.push({_id:e._id,name:e.course.code+'-'+e.section})
                return e.course.code+'-'+e.section
            })
            return Promise.resolve([z,j1,j2])
        }).then(([z,j1,j2])=>{setRoutine(j2);setDetails(j1);setAssigned(z);})
        .catch(err=>console.error(err))
    },[instructor,trigger])

    return (
        <Paper elevation={3} sx={{ px: '1rem', pb: '1rem', border: '1px solid #e0e0e098' }}>
            <Chip component={Paper} elevation={8} label='Instructor Details' sx={{ m: '-1.5em 0 0 0' }} color='info' size='small' />
            <Stack spacing={2} p={3}>
                <Autocomplete
                    disablePortal
                    options={facultyList}
                    getOptionLabel={e=>e.initials+(e.name?` [${e.name}]`:'')}
                    renderInput={(params) => <TextField {...params} label={'Select Instructor'} />}
                    blurOnSelect
                    autoComplete
                    clearOnEscape
                    loading={!facultyList.length}
                    noOptionsText='No faculty members found'
                    onChange={(e,v,r)=>setInstructor(v)}
                />
                <PropertyTable tbl={details}/>
                <Routine routine={routine}/>
            </Stack>
        </Paper>
    )
}