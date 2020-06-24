import React, {useState} from 'react'
import MuiAlert from '@material-ui/lab/Alert'
import {Grid, Paper, Checkbox, FormControlLabel, Button} from '@material-ui/core'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import {Animated} from "react-animated-css"
import {Language} from "@material-ui/icons"
import {green, grey} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        paddingBottom: 20,
    },
    checkbox: {
        margin: '0 12px 0 0',
        '& > span': {
            padding: 0,
        }
    },
    greenBtn: {
        color: '#4caf50',
        border: '1px solid rgba(76, 175, 80, 0.5)',
        '&:hover': {
            border: '1px solid #4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.04)',
        },
    },
}))

const GreenCheckbox = withStyles({
    root: {
        color: grey[500],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />)

const Alert = (props) => {
    return <MuiAlert elevation={6} {...props}/>
}

const conditionsData = [
    {id: 0, desc: "condition_1", duration: 1400, valid: false},
    {id: 1, desc: "condition_2", duration: 1100, valid: false},
    {id: 2, desc: "condition_3", duration: 1200, valid: false},
    {id: 3, desc: "condition_4", duration: 1400, valid: false},
]

const Welcome = (props) => {
    const classes = useStyles()
    const [conditions, setConditions] = useState(conditionsData)
    const [accept, setAccept] = useState(false)
    const {lang, handleOpenTest} = props

    const handleChangeConditions = (event) => {
        conditions[+event.target.name].valid = !conditions[+event.target.name].valid
        conditions[0].duration = conditions[1].duration = conditions[2].duration = conditions[3].duration = 0
        conditions[+event.target.name].duration = 1000
        setConditions([...conditions])
        if(conditions[0].valid && conditions[1].valid && conditions[2].valid && conditions[3].valid){
            localStorage.setItem('accept', 1)
            setAccept(true)
        }else {
            setAccept(false)
        }
    }

    /* Conditions view part */
    const ConditionsJsx = () => {
        return conditions.map(condition => {
            return (
                <Animated animationIn="flipInX" animationInDuration={condition.duration} isVisible={true} key={condition.id}>
                    <Alert className={"condition-alert-no-icon"} severity={condition.valid ? "success" : "error"} variant="outlined">
                        <FormControlLabel
                            className={classes.checkbox}
                            control={<GreenCheckbox checked={condition.valid}
                            onChange={handleChangeConditions} name={`${condition.id}`}/>} label={null}/>
                        {lang[condition.desc]}
                    </Alert>
                </Animated>
            )
        })
    }

    return (
        <div className={'welcome-test'}>
            <Grid container spacing={3} className={classes.container} direction="row" justify="space-evenly" alignItems="center">
                <Grid item xs={6}>
                    <div className={"welcome-test-title"}>{lang.applicant_test}</div>
                    <Paper className={classes.paper} elevation={3}>
                        <h4 className={"text-center"}><Language className={"welcome-spinner"} htmlColor={"#0f0f0f"} fontSize={"large"} /> {lang.welcome_to_platform}</h4>
                        <div className={"empty-test-info"}>
                            <Animated animationIn="flipInX" animationInDuration={1000} isVisible={true}>
                                <Alert severity="success" variant="filled">{lang.condition_test}</Alert>
                            </Animated>
                        </div>
                        <div className={"empty-test-desc"}>
                            <Animated animationIn="flipInX" animationInDuration={1200} isVisible={true}>
                                <Alert severity="success" variant="standard">
                                    {lang.accept_the_conditions}
                                </Alert>
                            </Animated>
                            {/* Conditions part */}
                            <ConditionsJsx />
                        </div>
                        <div className={"welcome-test-accept-btn"}>
                            <Button className={classes.greenBtn} variant="outlined" color="primary" disabled={!accept}
                                onClick={handleOpenTest}>
                                {lang.condition_accept}
                            </Button>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default Welcome