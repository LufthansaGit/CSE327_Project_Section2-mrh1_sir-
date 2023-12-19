import { Box, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const InfoCard = ({ title, Icon, val, to }) => {
    const navigate = useNavigate();

    return (
        <Paper
            component={Stack} direction="column" justifyContent="center" spacing={2} elevation={2}
            sx={{ backgroundColor: '#f0eef2', "&:hover": { cursor: "pointer", transform: 'scale(1.1)', transition: 'transform .25s' }}}
            margin='1em' width='15rem' height='15rem'
            onClick={()=>navigate(`/${to}`)}
        >
            <Typography variant="h5" align="center" sx={{wordWrap:'break-word'}}>
                {title}
            </Typography>
            <Box align='center' >
                <Icon sx={{ fontSize: "5em" }} />
            </Box>
            <Typography variant="h4" align="center" fontWeight='bold' sx={{wordWrap:'break-word'}}>
                {val}
            </Typography>
        </Paper>
    )
}

export default InfoCard;