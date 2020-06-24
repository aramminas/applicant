import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Tooltip} from '@material-ui/core'
import {NotListedLocationOutlined, RemoveCircleOutlineOutlined} from "@material-ui/icons";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#ffc107',
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
    grid: {
        paddingBottom: '0!important',
        marginTop: 15,
    },
    width100: {
        width: '100%',
    },
})

export default function PutAsideList(props) {
    const classes = useStyles()
    const {lang, data: {putAside: rows}} = props

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="column" justify="center" alignItems="center">
                { rows.length > 0 ?
                    <>
                        <Grid item xs={12} sm={8} className={`${classes.grid} ${classes.width100}`}>
                            <h4 className={"put-aside-title"}>{lang.list_pending_questions}</h4>
                        </Grid>
                        <Grid item xs={12} sm={8} className={`${classes.width100}`}>
                            <TableContainer component={Paper}>
                                <Table className={`${classes.table} table-state-final`} aria-label="put aside table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>{lang.task}</StyledTableCell>
                                            <StyledTableCell align="center">{lang.type}</StyledTableCell>
                                            <StyledTableCell align="center">{lang.score}</StyledTableCell>
                                            <StyledTableCell align="center">{lang.state}</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows && rows.map((row) => (
                                            <StyledTableRow key={row.id}>
                                                <StyledTableCell component="th" scope="row">
                                                    <Tooltip title={row.question} placement="top-start" interactive>
                                                        <p>{row.question}</p>
                                                    </Tooltip>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{lang[row.type]}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <NotListedLocationOutlined fontSize={"small"} htmlColor={"#ffc107"}/> /&nbsp;
                                                    <span className={"table-state-default-score"}>{row.score}</span>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <RemoveCircleOutlineOutlined fontSize={"small"} htmlColor={"#f1001a"}/> /&nbsp;
                                                    <span className={"table-state-default-status-not"}>
                                                        {lang.did_not_answer}
                                                    </span>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </> : null
                }
            </Grid>
        </div>
    )
}