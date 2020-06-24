import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Tooltip} from '@material-ui/core'
import {NotListedLocationOutlined, VerifiedUserOutlined} from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert'

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#28a745',
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
    pb0: {
        paddingBottom: '0!important',
    },
    width100: {
        width: '100%',
    },
})

export default function AnsweredList(props) {
    const classes = useStyles()
    const {lang, data: {answers: rows}} = props

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="column" justify="center" alignItems="center">
                <Grid item xs={12} sm={8} className={`${classes.pb0} ${classes.width100}`}>
                    <h4 className={"answered-title"}>{lang.list_questions_answered}</h4>
                </Grid>
                <Grid item xs={12} sm={8} className={`${classes.width100}`}>
                    {rows.length > 0 ?
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
                                                <Tooltip title={row.answerQuestion} placement="top-start" interactive>
                                                    <p>{row.answerQuestion}</p>
                                                </Tooltip>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{lang[row.type]}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                <NotListedLocationOutlined fontSize={"small"} htmlColor={"#ffc107"}/> /&nbsp;
                                                <span className={"table-state-default-score"}>{row.defaultScore}</span>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <VerifiedUserOutlined fontSize={"small"} htmlColor={"#28a745"}/> /&nbsp;
                                                <span className={"table-state-default-status"}>
                                                    {row.answered ? lang.answered : "--"}
                                                </span>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    :
                        <div className={"test-state-final-no-answer"}>
                            <Alert variant="outlined" severity="error">
                                {lang.answered_questions_empty}
                            </Alert>
                            <Alert variant="outlined" severity="warning">
                                {lang.please_answer_all_questions}
                            </Alert>
                        </div>
                    }
                </Grid>
            </Grid>
        </div>
    )
}