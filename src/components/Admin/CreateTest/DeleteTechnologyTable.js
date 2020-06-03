import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import {DeleteForeverOutlined} from '@material-ui/icons'
import Firebase from "../../../Firebase"

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#009be5",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow)

const useStyles = makeStyles({
    table: {
        maxWidth: 700,
        minWidth: 450,
    },
    delIcon: {
        '&:hover': {
            cursor: 'pointer',
            color: '#f64557'
        }
    }
})

export default function DeleteTechnologyTable(props) {
    const classes = useStyles()
    const {techData: rows, getTechData, lang} = props

    const delTech = (id) => {
        if (id) {
            // delete data from the storage
            if(rows[id].isIcon){
                let storageRef = Firebase.storage.ref(`storage/images/technology/`)
                var desertRef = storageRef.child(rows[id].iconName)
                desertRef.delete().then(function() {
                    console.log('File deleted successfully!')
                }).catch(function(error) {
                    console.log('error',error)
                })
            }
            // delete data from the technology table (database)
            const db = Firebase.database
            db.ref(`technology/${id}`).remove().then(()=>{
                getTechData(id)
            }).catch(error=>console.log(error))
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell><b>{lang.name}</b></StyledTableCell>
                        <StyledTableCell align="right"><b>{lang.icon}</b></StyledTableCell>
                        <StyledTableCell align="right"/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(rows).map((key) => (
                        <StyledTableRow key={rows[key].id}>
                            <StyledTableCell component="th" scope="row">
                                {rows[key].name}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <img className={"del-tech-icon"} src={rows[key].icon} alt="del icon"/>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <DeleteForeverOutlined className={classes.delIcon} htmlColor={"#343a40"} onClick={()=>delTech(rows[key].id)}/>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
