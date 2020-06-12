import React, {useState} from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { lighten, makeStyles } from '@material-ui/core/styles'
import Loader from 'react-loader-spinner'
import ReactTooltip from "react-tooltip"
import Firebase from "../../../Firebase"
import getUpdateChartData from '../../../helpers/getUpdateChartData'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography,
    Paper,
    Checkbox,
    IconButton,
    FormControlLabel,
    Switch
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'
import StorageIcon from '@material-ui/icons/Storage'
import {ReportProblemOutlined,CheckCircleOutlineOutlined,RadioButtonUncheckedOutlined} from '@material-ui/icons'
import {Animated} from "react-animated-css"


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
}

const headCells = [
    { id: 'full_name', numeric: false, disablePadding: true, label: "Full Name" },
    { id: 'email', numeric: true, disablePadding: false, label: 'E-Mail' },
    { id: 'phone', numeric: true, disablePadding: false, label: 'Phone' },
    { id: 'birthday', numeric: true, disablePadding: false, label: 'Birthday' },
    { id: 'past-tests', numeric: true, disablePadding: false, label: 'Past tests' },
    { id: 'created_at', numeric: true, disablePadding: false, label: 'Creation Date' }
]

function ApplicantListHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

ApplicantListHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
}

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}))

const ApplicantListToolbar = (props) => {
    const classes = useToolbarStyles()
    const { numSelected, deleteApplicants, lang } = props

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {`${numSelected}  ${lang.selected}`} &ensp;
                    <span className={"select-all"}>
                        ( <ReportProblemOutlined htmlColor={"#ff0000"} /> {lang.selecting_all} )
                    </span>
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {lang.applicants}
                </Typography>
            )}

            {numSelected > 0 ? (
                <>
                    <IconButton aria-label="delete" data-tip={lang.delete} onClick={()=>deleteApplicants()}>
                        <DeleteIcon />
                    </IconButton>
                    <ReactTooltip />
                </>
            ) : (
                <>
                    <IconButton aria-label="filter list" data-tip={lang.filter_list}>
                        <FilterListIcon />
                    </IconButton>
                    <ReactTooltip />
                </>
            )}
        </Toolbar>
    )
}

ApplicantListToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}))

export default function ApplicantList(props) {
    const classes = useStyles()
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('calories')
    const [selected, setSelected] = useState([])
    const [page, setPage] = useState(0)
    const [dense, setDense] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const {users,lang,getUserData} = props
    let rows = []

    // todo need optimize this part
    // making data transformation for the table
    Object.keys(users).map(key => rows.push(users[key]))

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.userId)
            setSelected(newSelecteds)
            return
        }
        setSelected([])
    }

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            )
        }

        setSelected(newSelected)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleChangeDense = (event) => {
        setDense(event.target.checked)
    }

    const deleteApplicants = () =>{
        const connectsRef = Firebase.database.ref(`/users`)
        if(selected.length > 0){
            selected.map(del => (
                connectsRef.child(del).remove()
                    .then(function() {
                        // update chart data
                        getUpdateChartData("applicant","remove")
                        setSelected([])
                        getUserData()
                    })
                    .catch(function(error) {
                        console.log("Remove failed: " + error.message)
                    })
            ))
        }
    }

    const isSelected = (name) => selected.indexOf(name) !== -1

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

    return (
        <>
            {
                Object.keys(rows).length > 0 ?
                    <Animated animationIn="zoomIn" animationOut="fadeOut" isVisible={true}>
                        <div className={classes.root}>
                            <Paper className={classes.paper}>
                                <ApplicantListToolbar lang={lang} numSelected={selected.length} deleteApplicants={deleteApplicants}/>
                                <TableContainer>
                                    <Table
                                        className={classes.table}
                                        aria-labelledby="tableTitle"
                                        size={dense ? 'small' : 'medium'}
                                        aria-label="enhanced table"
                                    >
                                        <ApplicantListHead
                                            classes={classes}
                                            numSelected={selected.length}
                                            order={order}
                                            orderBy={orderBy}
                                            onSelectAllClick={handleSelectAllClick}
                                            onRequestSort={handleRequestSort}
                                            rowCount={rows.length}
                                        />
                                        <TableBody>
                                            {stableSort(rows, getComparator(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    const isItemSelected = isSelected(row.userId);
                                                    const labelId = `enhanced-table-checkbox-${index}`;
                                                    return (
                                                        <TableRow
                                                            hover
                                                            role="checkbox"
                                                            aria-checked={isItemSelected}
                                                            tabIndex={-1}
                                                            key={row.userId}
                                                            selected={isItemSelected}
                                                        >
                                                            <TableCell padding="checkbox" onClick={(event) => handleClick(event, row.userId)}>
                                                                <Checkbox
                                                                    checked={isItemSelected}
                                                                    inputProps={{'aria-labelledby': labelId}}
                                                                />
                                                            </TableCell>
                                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                                {`${row.firstName} , ${row.lastName}`}
                                                            </TableCell>
                                                            <TableCell align="right">{row.email}</TableCell>
                                                            <TableCell align="right">{row.phone}</TableCell>
                                                            <TableCell align="right">{row.birthday}</TableCell>
                                                            <TableCell align="right">{row.pastTests ?
                                                                <><CheckCircleOutlineOutlined htmlColor={"green"}/> {lang.yes}</> :
                                                                <><RadioButtonUncheckedOutlined htmlColor={"gold"}/> {lang.no}</>
                                                            }</TableCell>
                                                            <TableCell align="right">{row.createdAt}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            {emptyRows > 0 && (
                                                <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
                                                    <TableCell colSpan={6}/>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </Paper>
                            <FormControlLabel
                                control={<Switch checked={dense} onChange={handleChangeDense}/>}
                                label={lang.dense_padding}
                            />
                        </div>
                    </Animated>
                :
                    <div className={"applicant-loader"}>
                        <Loader type="TailSpin" color="#18202c" height={100} width={100} timeout={10000} />
                        <span>
                            <StorageIcon /> <span>{lang.data_loading}</span>
                        </span>
                    </div>
            }
        </>
    )
}


