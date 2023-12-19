import AccountCircleRoundedIcon   from '@mui/icons-material/AccountCircleRounded';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from 'react';


const Card = ({ name, pos, email  }) => (
    <Paper
        elevation={7} component={Stack} spacing='auto'
        sx={{ backgroundColor: '#f0eef2',width:'15em',p:'1em',border: '1px solid #e0e0e098'}}
        m={2}
    >
        <Box align='center'>
            <AccountCircleRoundedIcon sx={{ fontSize: "10em",color:'#7a5c58'/*7a5c58 243665*/ }}/>
        </Box>
        <Stack>
            <Typography align="center" fontWeight='bold' sx={{ wordWrap: 'break-word' }}>
                {name}
            </Typography>
            <Typography align="center" variant='overline' color='#6091a4' fontWeight='bold' sx={{ wordWrap: 'break-word' }}>
                {pos}
            </Typography>
            <Typography align="center" color='gray' variant='subtitle2'  sx={{ wordWrap: 'break-word' }}>
                {email}
            </Typography>
        </Stack>
    </Paper>
)



export default function FacultyList() {

    const [data,setData]=useState([]);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_BACKEND}/instructor/`)
        .then(async(res)=>{
            let j = await res.json();
            if(!res.ok) throw new Error(j['msg'])
            setData(j)
        }).catch(err=>{
            console.error(err)
        })
    },[])

    return (
        <>
            <Typography align='center' variant='h4' mt={10} fontWeight='bold'>Faculty Members</Typography>
            <Box width='80%' m='auto' p={8} display='flex' flexWrap='wrap' justifyContent='center'>
                {data.map(e=>(<Card key={e._id} name={e.name||e.initials} pos={e.position||'Unknown'} email={e.email||'Not found'}/>))}
            </Box>
            {data.length<1&&<Typography align='center' variant='h2' mt={15} fontWeight='bold'>Loading...</Typography>}
        </>
    )
}