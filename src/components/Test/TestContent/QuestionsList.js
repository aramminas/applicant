import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core'

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#001f95',
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
        minWidth: 700,
    },
})

export default function QuestionsList(props) {
    const classes = useStyles()
    const {lang, question: rows} = props

    return (
        <TableContainer component={Paper} className={"test-description-questions-table"}>
            <Table className={classes.table} aria-label="question table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>{lang.task}</StyledTableCell>
                        <StyledTableCell align="right">{lang.type}</StyledTableCell>
                        <StyledTableCell align="center">{lang.score}</StyledTableCell>
                        <StyledTableCell align="center">{lang.state}</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows && rows.map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row">
                                <p>{row.question}</p>
                            </StyledTableCell>
                            <StyledTableCell align="right">{lang[row.type]}</StyledTableCell>
                            <StyledTableCell align="center">{row.score}</StyledTableCell>
                            <StyledTableCell align="center">{row.state ? "yes" : "--"}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}