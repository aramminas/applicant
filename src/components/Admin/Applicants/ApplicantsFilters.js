import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Grid, Paper, InputLabel, TextField, FormControlLabel, Switch} from '@material-ui/core'
import {
    PageviewTwoTone,
    AssignmentIndTwoTone,
    EmailTwoTone,
    PhoneIphoneTwoTone,
    AssignmentTurnedInTwoTone,
    RotateLeftTwoTone
} from '@material-ui/icons'

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
    userName: "",
    email: "",
    phone: "",
    pastTest: "",
}

const ApplicantsFilters = (props) => {
    const classes = useStyles()
    const [filter, setFilter] = useState(initFilters)
    const [switchState, setSwitchState] = useState(false)
    const {lang, filterResults} = props

    const handleChangeFilter = (event) => {
        let name = event.target.name
        let value = event.target.value
        if( name === "pastTest"){
            value = event.target.checked
            setSwitchState(value)
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
            pastTest: "",
        })
        filterResults({...filter,
            pastTest: "",
        })
        setSwitchState(false)
    }

    return (
        <div className={`applicants-filters`}>
            <h5><PageviewTwoTone /> {lang.filters}</h5>
            <hr/>
            <Grid container spacing={3} className={"applicants-filter-content"}>
                <Grid item md={12} lg={3} >
                    <Paper className={classes.paper}>
                        <InputLabel htmlFor="user-name" className={"filter-title"}>
                            <AssignmentIndTwoTone /> {lang.full_name}
                        </InputLabel>
                        <TextField
                            className={classes.formControl}
                            id="user-name"
                            label={lang.full_name}
                            variant="outlined"
                            name={"userName"}
                            onChange={handleChangeFilter}
                        />
                    </Paper>
                </Grid>
                <Grid item md={12} lg={3}>
                    <Paper className={classes.paper}>
                        <InputLabel htmlFor="user-email" className={"filter-title"}>
                            <EmailTwoTone /> {lang.email}
                        </InputLabel>
                        <TextField
                            className={classes.formControl}
                            id="user-email"
                            label={lang.email}
                            variant="outlined"
                            name={"email"}
                            onChange={handleChangeFilter}
                        />
                    </Paper>
                </Grid>
                <Grid item md={12} lg={3}>
                    <Paper className={classes.paper}>
                        <InputLabel htmlFor="user-phone" className={"filter-title"}>
                            <PhoneIphoneTwoTone /> {lang.phone}
                        </InputLabel>
                        <TextField
                            className={classes.formControl}
                            id="user-phone"
                            label={lang.phone}
                            variant="outlined"
                            name={"phone"}
                            onChange={handleChangeFilter}
                        />
                    </Paper>
                </Grid>
                <Grid item md={12} lg={3}>
                    <Paper className={`${classes.paper} past-test-section`}>
                        <InputLabel htmlFor="past-test" className={"filter-title"}>
                            <AssignmentTurnedInTwoTone /> {lang.past_test}
                            <span className={"reset-date"} onClick={resetDate}><RotateLeftTwoTone /></span>
                        </InputLabel>
                        <div className={"past-test-switch"}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={switchState}
                                        onChange={handleChangeFilter}
                                        name="pastTest"
                                        color="primary"
                                    />
                                }
                                label={lang.yes}
                            />
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default ApplicantsFilters