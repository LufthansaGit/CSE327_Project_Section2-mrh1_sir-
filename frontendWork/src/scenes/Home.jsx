import { Box, styled, Typography } from "@mui/material";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksOutlined";
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import InfoCard from "../components/Infocard";
import { useEffect, useState } from "react";


const CenteredBox = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    '& > :not(style)': {
        margin: '1em', width: '15rem', height: '15rem',
    },
})

export default function Home() {

    const [data,setData]=useState();

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_BACKEND}/stats/`)
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
            <Box>
                <Typography align="center" variant='h2' marginTop={4} padding={3}> Dashboard </Typography>
            </Box>
            <CenteredBox>
                <InfoCard val='Assign Courses' Icon={AssignmentTwoToneIcon} to='assign'></InfoCard>
                <InfoCard Icon={CalendarMonthTwoToneIcon} val='Routines' to='schedules'></InfoCard>
            </CenteredBox>
            <CenteredBox>
                <InfoCard title='Courses' Icon={LibraryBooksRoundedIcon} val={data?.courses??''} to='courses'></InfoCard>
                <InfoCard title='Faculty Members' Icon={Groups3OutlinedIcon} val={data?.instructors??''} to='faculty-members'></InfoCard>
            </CenteredBox>
        </>
    )

}