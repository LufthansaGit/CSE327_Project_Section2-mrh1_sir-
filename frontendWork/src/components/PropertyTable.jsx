import { Box, Chip, styled, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";

const Td=styled(TableCell)({
    borderBottom: 'none',
    // paddingLeft:0
})

export default ({tbl={}}) => (
    <TableContainer>
        <Table size='small'>
            <TableBody>
                {Object.entries(tbl).map(e => e[0]=='_id'||!e[1]||(Array.isArray(e[1])&&!e[1].length)?null:(
                    <TableRow key={`tblp-${e[0]}`}>
                        <Td component="th" sx={{width:'13ch'}}>
                            <Typography fontWeight='bold' variant=''>
                                {e[0].charAt(0).toUpperCase()+e[0].slice(1)+':'}
                            </Typography>
                        </Td>
                        <Td>
                            {Array.isArray(e[1]) ?
                                <Box display='flex' flexWrap='wrap' justifyContent='flex-start' alignItems='center'>
                                    {e[1].map(z=><Chip sx={{mr:'.5em',mb:'.5em'}} color='primary' size="small" label={z} variant="outlined" key={'txt'+z} />)}
                                </Box>
                                :
                                <Typography>{e[1]}</Typography>
                            }
                        </Td>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);