import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import Routine from "../components/Routine";
import PropertyTable from "../components/PropertyTable";

const getOptions=v=>{
    if(v===1) return {
        getOpLbl:e=>e.initials+(e.name?` [${e.name}]`:''),
        label:'Instructor:',
        noOpt:'No faculty members found',
        afterSelect:console.log
    }
    if(v===2) return {
        getOpLbl:e=>'Room: '+e,
        label:'Room No.',
        noOpt:'No results',
        afterSelect:console.log
    }
    if (v===3) return {
        getOpLbl:e=>e.code+(e.title?` [${e.title}]`:''),
        label:'Course:',
        noOpt:'No results',
        afterSelect:console.log
    }
}


const CourseRoutine=({code,routine})=>(
    <Paper elevation={2} sx={{px: '1rem', border: '1px solid #e0e0e098'}}>
        <Box display='flex' justifyContent='center'>
            <Chip component={Paper} elevation={5} label={code+' Routine'} sx={{ mt: '-1em', backgroundColor: 'white' }} color='success' variant='outlined' size='small'></Chip>
        </Box>
        <Box p={3}>
            <PropertyTable tbl={routine}/>
        {Object.keys(routine||{}).length<1 && <Typography align='center'>No Sections</Typography>}
        </Box>
    </Paper>
)

export default function Schedules() {

    const [rtype, setRtype] = useState('');
    const [list, setList] = useState({data:[],opt:{}});
    const [val, setVal] = useState();
    const [routine, setRoutine] = useState();


    useEffect(()=>{
        if(!rtype) return;
        console.log(rtype)
        if(rtype===1) {
            fetch(`${process.env.REACT_APP_BACKEND}/instructor/getAll`)
            .then(async(res)=>{
                let j = await res.json();
                if(!res.ok) throw new Error(j['msg'])
                setList({data:j,opt:getOptions(rtype)})
            }).catch(err=>{
                console.error(err)
            })
        } else if(rtype===3){
            fetch(`${process.env.REACT_APP_BACKEND}/course/courselist`)
            .then(async(res)=>{
                let j = await res.json();
                if(!res.ok) throw new Error(j['msg'])
                setList({data:j,opt:getOptions(rtype)})
            }).catch(err=>{
                console.error(err)
            })
        } else if(rtype===2){
            fetch(`${process.env.REACT_APP_BACKEND}/routine/rooms`)
            .then(async(res)=>{
                let j = await res.json();
                if(!res.ok) throw new Error(j['msg'])
                setList({data:j,opt:getOptions(rtype)})
            }).catch(err=>{
                console.error(err)
            })
        }
    },[rtype])

    useEffect(()=>{
        if(!val||!rtype) return;
        console.log(val)
        const url=[`instructor/${val._id}`,`room/${val}`,`course/${val._id}`][rtype-1];
        fetch(`${process.env.REACT_APP_BACKEND}/routine/`+url)
        .then(async(res)=>{
            let j = await res.json();
            if(!res.ok) throw new Error(j['msg'])
            setRoutine(j)
        }).catch(err=>{
            console.error(err)
        })
    },[val])

    return (
        <Stack sx={{ width:'85%',mx:'auto',my:'5rem' }} spacing={8}>
            <Typography align='center' variant='overline' fontSize='large' fontWeight='bold'>View Routines</Typography>
            <Stack component={Paper} sx={{border:'1px solid #e0e0e098'}} elevation={2} p={5} spacing={2}>
                <FormControl fullWidth>
                    <InputLabel id="simple-select-label">Routine type</InputLabel>
                    <Select
                        labelId="simple-select-label"
                        id="simple-select"
                        value={rtype}
                        label="Routine type"
                        onChange={e=>{setRtype(e.target.value);setVal(null)}}
                    >
                        <MenuItem value={1}>Instructor Schedule</MenuItem>
                        <MenuItem value={3}>Course Schedule</MenuItem>
                        <MenuItem value={2}>Room Schedule</MenuItem>
                    </Select>
                </FormControl>
                {rtype && <Autocomplete
                    value={val}
                    disablePortal
                    options={list.data}
                    getOptionLabel={list.opt.getOpLbl}
                    renderInput={(params) => <TextField {...params} label={list.opt.label} />}
                    blurOnSelect
                    autoComplete
                    clearOnEscape
                    loading={!list.data.length}
                    noOptionsText={list.opt.noOpt}
                    onChange={(e,v,r)=>{setVal(v);setRoutine()}}
                />}
            </Stack>
            {rtype && val && (rtype<3? <Routine routine={routine}/> : <CourseRoutine code={val.code||''} routine={routine}/>)}
        </Stack>
    );
}