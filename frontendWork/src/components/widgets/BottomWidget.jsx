import { Alert, AlertTitle, Box, Chip, Grid, Paper, Snackbar, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PropertyTable from "../PropertyTable";
import ComboBox from "../select";

export default function BottomWidget({faculty,setTrigger}) {

    const [section,setSection]=useState()
    const [data,setData]=useState();
    const [course,setCourse]=useState()
    const [courseDetails,setCourseDetails]=useState()
    const [popup,setPopup]=useState({show:false,msg:'',status:'info',title:''})

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_BACKEND}/course/courselist`)
        .then(async(res)=>{
            let j=await res.json();
            if(!res.ok) throw new Error(j['msg'])
            setData(j)
        }).catch(err=>{setPopup({show:true,msg:err.message,status:'error',title:'Error'});console.log(err)})
    },[])


    const handleClose=(evnt,reason)=>{
        if (reason==='clickaway') return;
        setPopup({...popup,show:false})
    }

    const getCourseDetails=(v)=>{
        if(!v?._id) return setCourseDetails();
        fetch(`${process.env.REACT_APP_BACKEND}/course/${v._id}`)
        .then(async(res)=>{
            let j=await res.json();
            if(!res.ok) throw new Error(j['msg'])
            setCourseDetails(j)
        }).catch(err=>{setPopup({show:true,msg:err.message,status:'error',title:'Error'});console.error(err)})
    }

    const addCourse=()=>{
        if(!section?._id) return;
        fetch(`${process.env.REACT_APP_BACKEND}/instructor/${faculty._id}/assign`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sectionId:section._id})
        }).then(async(res)=>{
            const j=await res.json();
            if(!res.ok) throw new Error(j['msg'])
            return Promise.resolve(j)
        }).then(()=>{
            setTrigger(i=>i+1)
            setCourse();
            setSection();
            setCourseDetails();
            setPopup({show:true,msg:`${course.code}-${section.section} added successfully`,status:'success',title:'Success'})
        }).catch(err=>{
            setPopup({show:true,msg:err.message,status:'error',title:'Error'})
            console.error(err)
        })
    }

    const removeCourse=(sec)=>{
        if(!sec?._id) return;
        fetch(`${process.env.REACT_APP_BACKEND}/instructor/${faculty._id}/remove`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sectionId:sec._id})
        }).then(async(res)=>{
            let j=await res.json();
            if(!res.ok) throw new Error(j['msg'])
            return Promise.resolve()
        }).then(()=>{
            setTrigger(i=>i+1)
            setPopup({show:true,msg:'Removed Successfully',status:'info',title:'Info'})
        }).catch(err=>{setPopup({show:true,msg:err.message,status:'error',title:'Error'});console.error(err)})
    }

    if(!faculty?._id) return;
    
    return (
        <Paper elevation={3} sx={{ px: '1rem', pb: '1rem', border: '1px solid #e0e0e098' }}>
            <Chip component={Paper} elevation={8} label='Assign Courses' sx={{ mt: '-1.5em' }} color='info' size='small' />
            
            <Grid container justifyContent='space-around' alignItems='center' sx={{p:'2em'}} rowSpacing={8} columnSpacing={8}>
                
                <Grid item>
                    <Paper elevation={2} sx={{ minWidth: '20em', border: '1px solid #e0e0e098' }}>
                        <Box display='flex' justifyContent='center'>
                            <Chip label='Find Course' sx={{ mt: '-1em', backgroundColor: 'white' }} color='info' variant='outlined' size='small' />
                        </Box>
                        <Stack spacing={2} p={3} >
                            <ComboBox
                                label='Search Course'
                                val={course}
                                opts={data}
                                afterSelect={v=>{setCourse(v);setSection();getCourseDetails(v);}}
                                getOpLabel={e=>e.code+(e.credits?` (${e.credits})`:'')+(e.title?` [${e.title}]`:'')}
                            />
                            {course && <ComboBox
                                label='Select Section'
                                opts={courseDetails?.sections||[]}
                                val={section}
                                afterSelect={v=>{setSection(v);}}
                                getOpLabel={e=>'Section-'+e['section']}
                                disabled={!course}
                                checkDisable={(e)=>faculty.assigned.some(f=>f._id==e._id)||(e.instructor&&e.instructor!='TBA')}
                            />}
                            <Stack spacing={0}>
                                <PropertyTable tbl={courseDetails?.course||{}} />
                                <PropertyTable tbl={section||{}} />
                            </Stack>
                            <Chip label='Add' variant='outlined' disabled={!section}
                                onClick={addCourse}
                                color='success'
                            />
                        </Stack>
                    </Paper>
                </Grid>
                
                <Grid item>
                    <Paper elevation={2} sx={{ px: '1rem', pb: '1rem', border: '1px solid #e0e0e098' }}>
                        <Box display='flex' justifyContent='center'>
                            <Chip label='Added Courses' sx={{ mt: '-1em', backgroundColor: 'white' }} color='success' variant='outlined' size='small'></Chip>
                        </Box>
                        <Stack spacing={1} m={2}>
                            {(!faculty.assigned?.length) &&
                                <Typography align='center' variant='caption'>
                                    Assigned courses will appear here
                                </Typography>
                            }
                            {faculty.assigned.map(e=>(
                                <Chip
                                    label={e.name}
                                    key={'ac-'+e.name}
                                    variant='filled'
                                    color='default'
                                    onClick={()=>setPopup({show:true,msg:'Not implemented yet...',status:'warning',title:'Course Info'})}
                                    onDelete={()=>removeCourse(e)}
                                />
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
                
            </Grid>
            <Snackbar
                open={popup.show}
                anchorOrigin={{vertical:'bottom',horizontal:'right'}}
                autoHideDuration={2000}
                onClose={handleClose}
            >
                <Alert severity={popup.status} onClose={handleClose}>
                    <AlertTitle><strong>{popup.title}</strong></AlertTitle>
                    {popup.msg}
                </Alert>
            </Snackbar>
        </Paper>
    )
}