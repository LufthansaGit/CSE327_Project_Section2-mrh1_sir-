import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import BottomWidget from "../components/widgets/BottomWidget";
import TopWidget from "../components/widgets/Topwidget";


export default function AssignCourse() {
    const nonMobile = useMediaQuery('(min-width:1000px)')

    const [assigned,setAssigned]=useState()
    const [trigger,setTrigger]=useState(0)
    // console.log({data: instructor})

    return (
        <Stack spacing={7} px={nonMobile ? '10%' : '1%'} py={6} margin='auto'>


            <TopWidget setAssigned={setAssigned} trigger={trigger}/>

            <BottomWidget faculty={assigned} setTrigger={setTrigger}/>

        </Stack >
    );
}