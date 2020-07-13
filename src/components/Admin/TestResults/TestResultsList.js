import React, {useState} from 'react'
import {withStyles, makeStyles, useTheme} from '@material-ui/core/styles'
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Menu,
    MenuItem, TablePagination, TableFooter,
} from '@material-ui/core'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import {NavLink} from "react-router-dom"
import {
    DeleteForeverOutlined,
    FirstPage, KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage, Settings,
    VisibilityOutlined,
    EmojiObjectsOutlined,
} from "@material-ui/icons"
import PropTypes from "prop-types"
import NothingFound from "../../NotFound/NothingFound"
import DeleteModal from "./DeleteModal"
import {Animated} from "react-animated-css"

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}))

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#1a6d8b',
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

function TablePaginationActions(props) {
    const classes = useStyles1()
    const theme = useTheme()
    const { count, page, rowsPerPage, onChangePage } = props

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0)
    }

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1)
    }

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1)
    }

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
            </IconButton>
        </div>
    )
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
}

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
    settings: {
        '&:hover': {
            '& span svg': {
                color: '#0a465c',
            },
        },
    },
    view: {
        fontWeight: 600,
        '&:hover': {
            '& svg': {
                color: '#0a465c',
            },
        },
    },
    delete: {
        fontWeight: 600,
        '&:hover': {
            '& svg': {
                color: '#de001e',
            },
        },
    },
    link: {
        all: 'unset',
        '&:hover': {
            all: 'unset',
        }
    }
})

const defaultIcon = "/images/pages/technology_default.png"

const TestResults = (props) => {
    const classes = useStyles()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [delId, setDelId] = useState("")
    const [openDel, setOpenDel] = useState(false)

    const {lang, data: rows, emptyResult, technology, deleteTestResult} = props
    const length = Object.keys(rows).length
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, length - page * rowsPerPage)

    const handleCloseDeleteModal = () => {
        setOpenDel(false)
        setDelId("")
    }

    const handleDeleteTestResult = () => {
        setOpenDel(false)
        setTimeout(function () {
            deleteTestResult(delId)
            setDelId("")
        },1000)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const deleteTestResultById = (id) => {
        setDelId(id)
        setOpenDel(true)
    }

    /* Test Results view */
    const TestResultsListJsx = () => (
        (rowsPerPage > 0
                ? Object.keys(rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : Object.keys(rows)
        ).map((row) => (
            <StyledTableRow key={rows[row].id}>
                <StyledTableCell component="th" scope="row">
                    <figure className={"admin-test-results-table-icon"}>
                        <img
                            src={ rows[row]?.parameters?.technologyId
                                    && technology[rows[row]?.parameters?.technologyId]
                                        && technology[rows[row]?.parameters?.technologyId].isIcon ?
                                            technology[rows[row]?.parameters?.technologyId].icon
                                :
                                defaultIcon
                            }
                            alt="programing lang"/>
                    </figure>
                </StyledTableCell>
                <StyledTableCell align="center">
                    { rows[row]?.parameters?.technologyId && technology[rows[row]?.parameters?.technologyId] ?
                        technology[rows[row]?.parameters?.technologyId].name :
                        lang.unknown_technology
                    }
                </StyledTableCell>
                <StyledTableCell align="center">{rows[row].fullName}</StyledTableCell>
                <StyledTableCell align="center">{rows[row].email}</StyledTableCell>
                <StyledTableCell align="center">{`${rows[row].score} / ${rows[row].userTotalScore}`}</StyledTableCell>
                <StyledTableCell align="center">
                    {rows[row].needManualEvaluation ?
                        <EmojiObjectsOutlined className={"led led-yellow"}/> :
                        <EmojiObjectsOutlined className={"led led-grey"}/>
                    }
                </StyledTableCell>
                <StyledTableCell align="center">{rows[row].finishTime}</StyledTableCell>
                <StyledTableCell align="center">{rows[row].examDate}</StyledTableCell>
                <StyledTableCell align="right">
                    <PopupState variant="popover" popupId={`${rows[row].id}`}>
                        {(popupState) => (
                            <>
                                <IconButton className={classes.settings} {...bindTrigger(popupState)}>
                                    <Settings htmlColor={"#1a6d8b"}/>
                                </IconButton>
                                <Menu {...bindMenu(popupState)}>
                                    <NavLink to={`/test-result/${rows[row].id}`} variant="body2" className={classes.link}>
                                        <MenuItem className={classes.view} onClick={popupState.close}>
                                            <VisibilityOutlined htmlColor={"#1a6d8b"}/>&nbsp;{lang.view}
                                        </MenuItem>
                                    </NavLink>
                                    <MenuItem className={classes.delete} onClick={() => {deleteTestResultById(rows[row].id); popupState.close()}}>
                                        <DeleteForeverOutlined htmlColor={"#1a6d8b"}/>{lang.delete}
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </PopupState>
                </StyledTableCell>
            </StyledTableRow>
        ))
    )

    return (
        <>
            { !emptyResult ?
                <>
                    <Animated animationIn="zoomIn" animationOut="fadeOut" isVisible={true}>
                        <TableContainer component={Paper} className={"admin-test-results-table"}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>{lang.icon}</StyledTableCell>
                                        <StyledTableCell align="center">{lang.test}</StyledTableCell>
                                        <StyledTableCell align="center">{lang.full_name}</StyledTableCell>
                                        <StyledTableCell align="center">{lang.email}</StyledTableCell>
                                        <StyledTableCell align="center">{`${lang.scored_points} / ${lang.total_score}`}</StyledTableCell>
                                        <StyledTableCell align="center">{lang.manual_evaluation}</StyledTableCell>
                                        <StyledTableCell align="center">{lang.finish_time}</StyledTableCell>
                                        <StyledTableCell align="center">{lang.exam_date}</StyledTableCell>
                                        <StyledTableCell align="right">{lang.settings}</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Test Results view */}
                                    <TestResultsListJsx />
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, { label: lang.all, value: -1 }]}
                                            colSpan={9}
                                            count={length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{
                                                inputProps: { 'aria-label': 'rows per page' },
                                                native: true,
                                            }}
                                            onChangePage={handleChangePage}
                                            onChangeRowsPerPage={handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActions}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Animated>
                    {/* Modal window for deleting test result */}
                    <DeleteModal open={openDel} lang={lang} handleDeleteTestResult={handleDeleteTestResult}
                                 handleClose={handleCloseDeleteModal}/>
                </>
                :
                <NothingFound lang={lang}/>
            }
        </>
    )
}

export default TestResults