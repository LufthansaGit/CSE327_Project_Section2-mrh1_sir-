import { Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const TR = styled(TableRow)({
    ':nth-of-type(even)': {
        backgroundColor: '#f2f2f2'
    },
})

const Thead = styled(TableHead)({
    '& :not(:first-of-type)': {
        backgroundColor: '#049b7a',
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    '& :not(:first-of-type):not(:last-of-type)': {
        borderRightColor: 'white',
    },
    '& :first-of-type': {
        backgroundColor: '#f0eef2',
        borderRadius: '0 4px 0 0'
    },
    '& :nth-of-type(2)': {
        borderRadius: '4px 0 0 0'
    },
    maxWidth: '15ch',
    wordWrap: 'break-word'
})

const TD = styled(TableCell)({
    maxWidth: '15ch',
    wordWrap: 'break-word',
    textAlign: 'center',
    ':not(th)':{
        borderLeft: '1px dashed #e4d8d8',
        ':first-of-type':{fontWeight:'bold',border:'none'}
    },
})


export default function Routine({routine}) {
    if(!routine) return;
    let c=0,z=Object.keys(routine.timing).sort((a,b)=>new Date('2023-1-1 '+a.split('-')[0])-new Date('2023-1-1 '+b.split('-')[0]));
    return (
        <TableContainer component={Paper} elevation={1}>
            <Table border={0}>
                <Thead>
                    <TR>
                        <TD>Time/Day</TD>
                        {routine.days.map(e=>(<TD key={'d_'+e}>{e}</TD>))}
                    </TR>
                </Thead>
                <TableBody>
                    {(z.length?z:new Array(2).fill()).map(e=>(
                        <TR key={'rw_'+c++}>
                            <TD>{e}</TD>
                            {(z.length?routine.timing[e]:new Array(7).fill()).map(f=>(
                                <TD key={'cl_'+c++}>{f}</TD>
                            ))}
                        </TR>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
