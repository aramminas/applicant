import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {makeStyles, useTheme, withStyles} from '@material-ui/core/styles'
import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TablePagination,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
} from '@material-ui/core'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import {
    DeleteForeverOutlined,
    FirstPage,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage,
    Settings,
    EditOutlined,
    VisibilityOutlined,
} from '@material-ui/icons'
import data from '../../../constants'
const levels = data.admin.applicantLevels

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}))

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#073589',
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

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
        '& thead tr th': {
            fontWeight: 600,
        }
    },
    firstTd: {
        width: 60,
        '& img': {
            width: 50,
            maxHeight: 100,
        }
    },
    lastTd: {
        width: 60,
    },
    name: {
        '& span': {
            display: 'block',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            width: 'inherit',
        },
        '& hover': {
            cursor: 'text',
        }
    },
    settings: {
        '&:hover': {
            '& span svg': {
                color: '#031433',
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
    edit: {
        fontWeight: 600,
        '&:hover': {
            '& svg': {
                color: '#009be5',
            },
        },
    }
})

export default function AdminTestsList(props) {
    const classes = useStyles2()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const {tests: rows, technology, lang, handleClickOpen} = props

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const editTest = (id) => {
        console.log('editTest id', id)
    }

    const deleteTest = (id) => {
        handleClickOpen(id)
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="admin tests table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>{lang.icon}</StyledTableCell>
                        <StyledTableCell align="left">{lang.name}</StyledTableCell>
                        <StyledTableCell align="left">{lang.level}</StyledTableCell>
                        <StyledTableCell align="center">{lang.duration}</StyledTableCell>
                        <StyledTableCell align="center">{lang.number_of_tests}</StyledTableCell>
                        <StyledTableCell align="center">{lang.creation_date}</StyledTableCell>
                        <StyledTableCell align="right">{lang.settings}</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                    ).map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell className={classes.firstTd}>
                                {technology[row.icon] ?
                                    <img src={technology[row.icon]?.icon} alt="icon"/> :
                                    <img src="/images/pages/technology_default.png" alt="icon"/>
                                }
                            </StyledTableCell>
                            <StyledTableCell style={{ width: 160 }} className={classes.name}>
                                <Tooltip title={technology[row.name] ? technology[row.name].name : row.name}
                                         placement="top-start" interactive>
                                    <span>{technology[row.name] ? technology[row.name].name : row.name}</span>
                                </Tooltip>
                            </StyledTableCell>
                            <StyledTableCell style={{ width: 160 }}>
                                {lang[levels[row.level-1].name]}
                            </StyledTableCell>
                            <StyledTableCell style={{ width: 160 }} align="center">
                                {row.duration} {lang.minute}
                            </StyledTableCell>
                            <StyledTableCell style={{ width: 160 }} align="center">
                                {row.numberOfTests}
                            </StyledTableCell>
                            <StyledTableCell style={{ width: 160 }} align="center">
                                {row.createdAt}
                            </StyledTableCell>
                            <StyledTableCell className={classes.lastTd} align="right">
                                <PopupState variant="popover" popupId={`${row.id}`}>
                                    {(popupState) => (
                                        <>
                                            <IconButton className={classes.settings} {...bindTrigger(popupState)}>
                                                <Settings htmlColor={"#073589"}/>
                                            </IconButton>
                                            <Menu {...bindMenu(popupState)}>
                                                <MenuItem className={classes.edit} onClick={() => {editTest(row.id); popupState.close()}}>
                                                    <EditOutlined htmlColor={"#073589"}/>&nbsp;{lang.edit} /&nbsp;
                                                    {lang.view}&nbsp;<VisibilityOutlined htmlColor={"#073589"}/>
                                                </MenuItem>
                                                <MenuItem className={classes.delete} onClick={() => {deleteTest(row.id); popupState.close()}}>
                                                    <DeleteForeverOutlined htmlColor={"#073589"}/>{lang.delete}
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    )}
                                </PopupState>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}

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
                            colSpan={7}
                            count={rows.length}
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
    )
}
