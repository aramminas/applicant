import React from 'react'
import {NavLink} from "react-router-dom"
import MuiAlert from '@material-ui/lab/Alert'
import {Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {LinkOff, NearMe} from '@material-ui/icons'
import data from "../../constants"
import {Animated} from "react-animated-css"

const notFoundCases = data.notFoundCases

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        paddingBottom: 20,
    },
}))

const Alert = (props) => {
    return <MuiAlert elevation={6} {...props}/>
}


const EmptyTest = (props) => {
    const classes = useStyles()
    const {lang} = props

    /* Cases view part */
    const NotFoundCasesJsx = () => {
        return notFoundCases.map(notCase => {
            return (
                <Animated animationIn="flipInX" animationInDuration={notCase.duration} isVisible={true} key={notCase.id}>
                    <Alert severity="info" variant="outlined">{lang[notCase.desc]}</Alert>
                </Animated>
            )
        })
    }

    return (
        <div className={"empty-test"}>
            <div className={"empty-test-title"}>{lang.applicant_test}</div>
            <Paper className={classes.paper} elevation={3}>
                <h4 className={"text-left"}><LinkOff htmlColor={"#0065ff"}/> {lang.test_not_found}</h4>
                <div className={"empty-test-info"}>
                    <Animated animationIn="flipInX" animationInDuration={1000} isVisible={true}>
                        <Alert severity="info" variant="filled">{lang.test_not_found_info}</Alert>
                    </Animated>
                </div>
                <div className={"empty-test-desc"}>
                    <Animated animationIn="flipInX" animationInDuration={1200} isVisible={true}>
                        <Alert severity="info" variant="standard">
                            {lang.test_not_found_desc}&nbsp;
                            <NavLink to="/contact-us" color="inherit" className={"empty-test-link"}><NearMe fontSize={"small"}/></NavLink>
                        </Alert>
                    </Animated>
                    {/* Not found cases part */}
                    <NotFoundCasesJsx />
                </div>
            </Paper>
        </div>
    )
}

export default EmptyTest