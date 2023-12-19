import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';


export default function CollapsibleTable() {
    
    const [data,setData]=useState([]);


    useEffect(()=>{
        fetch(`${process.env.REACT_APP_BACKEND}/course/all`)
        .then(async(res)=>{
            let j=await res.json();
            if(!res.ok) throw new Error(j['msg'])
            setData(j)
        })
        .catch(err=>{console.log(err)})
    },[])

    

    const grab=(id,setDetails)=>{
        fetch(`${process.env.REACT_APP_BACKEND}/course/${id}/sections`)
        .then(async(res)=>{
            let j=await res.json();
            if(!res.ok) throw new Error(j['msg'])
            setDetails(j.length?j:null)
        })
        .catch(err=>{console.log(err)})
    }

    function Row({row}) {

        const [open, setOpen] = useState(false);
        const [details,setDetails]=useState([]);
    
        return (
            <>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell sx={{width:'1em'}}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>{if(details!=null && !details.length) grab(row._id,setDetails);setOpen(!open)}}
                            title='Click to expand/minimize'
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                    </TableCell>
                    <TableCell align='center'>{row.code}</TableCell>
                    <TableCell align='center'>{row.title||'Untitled'}</TableCell>
                    <TableCell align='center'>{row.credits}</TableCell>
                    <TableCell align='center'>{row.courseType||'Core'}</TableCell>
                </TableRow>
                <TableRow sx={{width:'100%'}}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0,backgroundColor:'#f2f2f2' }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit >
                            <Box sx={{ width:'95%',margin:'auto'}}>
                                {(details||[]).length<1 && <Typography align='center'>{details==null?'No Sections':'Loading...'}</Typography>}
                                {(details||[]).length>0 &&(
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align='center'><strong>Section</strong></TableCell>
                                            <TableCell align='center'><strong>Instructor</strong></TableCell>
                                            <TableCell align='center'><strong>Day(s)</strong></TableCell>
                                            <TableCell align='center'><strong>Start Time</strong></TableCell>
                                            <TableCell align='center'><strong>End Time</strong></TableCell>
                                            <TableCell align='center'><strong>Room</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(details||[]).map((sec) => (
                                            <TableRow key={sec._id}>
                                                <TableCell align='center'>{sec.section}</TableCell>
                                                <TableCell align='center'>{sec.instructor||'TBA'}</TableCell>
                                                <TableCell align='center'>{sec.days}</TableCell>
                                                <TableCell align='center'>{sec.routine[0].startTime}</TableCell>
                                                <TableCell align='center'>{sec.routine[0].endTime}</TableCell>
                                                <TableCell align='center'>{sec.room}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table> )}
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    }

    const nonMobile = useMediaQuery('(min-width:1000px)')

    return (
        <Stack spacing={5} sx={{width:`${nonMobile?'70%':'95%'}`,mx:'auto',my:'4rem'}}>
            <Typography variant='h4' align='center' mb={5} fontWeight='bold'>Courses Offered</Typography>
        <TableContainer component={Paper} elevation={5} >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell align='center'><strong>Course Code</strong></TableCell>
                        <TableCell align='center'><strong>Title</strong></TableCell>
                        <TableCell align='center'><strong>Credits</strong></TableCell>
                        <TableCell align='center'><strong>Course Type</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) =>(
                        <Row key={row.code} row={row} />
                    ))}
                </TableBody>
            </Table>
            {!data.length && (<Typography align='center' variant='h5' my={2}>Loading...</Typography>)}
        </TableContainer>
        </Stack>
    );
}
