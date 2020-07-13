import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Grid, Paper, InputLabel, FormControl, Select, TextField} from '@material-ui/core'
import {PageviewTwoTone, AssignmentTwoTone, AssignmentIndTwoTone, EmailTwoTone, EventTwoTone, RotateLeftTwoTone} from '@material-ui/icons'
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import convertData from "../../../helpers/convertData"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: '80%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    }
}))

const initFilters = {
    tech: "",
    userName: "",
    email: "",
    examDate: "",
}

const TestResultsFilters = (props) => {
    const classes = useStyles()
    const [filter, setFilter] = useState(initFilters)
    const {lang, technology, filterResults} = props

    const handleChangeFilter = (event, data = "") => {
        let name = "", value = ""
        if (data === ""){
            name = event.target.name
            value = event.target.value
        }else {
            name = data
            value = convertData(event)
        }
        setFilter({
            ...filter,
            [name]: value,
        })
        filterResults({...filter,[name]: value})
    }

    const resetDate = () => {
        setFilter({
            ...filter,
            examDate: "",
        })
        filterResults({...filter,
            examDate: "",
        })
    }

    const TechnologiesJsx = () => (
        Object.keys(technology).map(tech => (
                <option key={technology[tech].id} value={technology[tech].id}>{technology[tech].name}</option>
            )
        )
    )

    return (
        <div className={`test-results-filters`}>
            <h5><PageviewTwoTone /> {lang.filters}</h5>
            <hr/>
            <Grid container spacing={3} className={"test-filter-content"}>
                <Grid item md={12} lg={3} >
                    <Paper className={classes.paper}>
                        <InputLabel htmlFor="test-name" className={"test-filter-title"}>
                            <AssignmentTwoTone /> {lang.test}
                        </InputLabel>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel htmlFor="test-name">{lang.test}</InputLabel>
                            <Select
                                native
                                value={filter.tech}
                                onChange={handleChangeFilter}
                                label={lang.test}
                                inputProps={{
                                    name:'tech',
                                    id: 'test-name',
                                }}
                            >
                                <option aria-label={lang.none} value=""/>
                                {/* Technologies names */}
                                <TechnologiesJsx />
                            </Select>
                        </FormControl>
                    </Paper>
                </Grid>
                <Grid item md={12} lg={3}>
                    <Paper className={classes.paper}>
                        <InputLabel htmlFor="test-user-name" className={"test-filter-title"}>
                            <AssignmentIndTwoTone /> {lang.full_name}
                        </InputLabel>
                        <TextField
                            className={classes.formControl}
                            id="test-user-name"
                            label={lang.full_name}
                            variant="outlined"
                            name={"userName"}
                            onChange={handleChangeFilter}
                        />
                    </Paper>
                </Grid>
                <Grid item md={12} lg={3}>
                    <Paper className={classes.paper}>
                        <InputLabel htmlFor="test-user-email" className={"test-filter-title"}>
                            <EmailTwoTone /> {lang.email}
                        </InputLabel>
                        <TextField
                            className={classes.formControl}
                            id="test-user-email"
                            label={lang.email}
                            variant="outlined"
                            name={"email"}
                            onChange={handleChangeFilter}
                        />
                    </Paper>
                </Grid>
                <Grid item md={12} lg={3}>
                    <Paper className={classes.paper}>
                        <InputLabel htmlFor="test-exam-date" className={"test-filter-title"}>
                            <EventTwoTone /> {lang.exam_date}
                            <span className={"reset-date"} onClick={resetDate}><RotateLeftTwoTone /></span>
                        </InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                variant="outlined"
                                margin="normal"
                                id="test-exam-date"
                                label={lang.exam_date}
                                format="MM/dd/yyyy"
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                value={filter.examDate ? filter.examDate : new Date(0)}
                                onChange={(e) => handleChangeFilter(e, "examDate")}
                            />
                        </MuiPickersUtilsProvider>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default TestResultsFilters