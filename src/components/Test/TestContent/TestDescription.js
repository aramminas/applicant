import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Paper, Grid, Button} from '@material-ui/core'
import {FlipCameraAndroidOutlined} from '@material-ui/icons'
import QuestionsList from "./QuestionsList"
import connects from '../../../constants'
const constData = connects.testParams

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        backgroundColor: "transparent",
    },
    item: {
        width: '100%',
    },
    blueBtn: {
        width: '40%',
        color: '#ffffff',
        backgroundColor: '#001f95',
        border: '1px solid #00196d',
        '&:hover': {
            border: '1px solid #001f95',
            backgroundColor: '#00104e',
        },
    },
    paperBg: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
    },
}))

const TestDescription = (props) => {
    const classes = useStyles()
    const {lang, question, handleStartTest} = props

    return (
        <div className={`${classes.root} test-description`}>
            <Grid container spacing={3} direction="column" justify="space-evenly" alignItems="center">
                <Grid item xs={6} className={`${classes.item} test-description-header`}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item xs={3}>
                                <div className={"test-description-logo"}>
                                    <figure>
                                        <img src="/images/pages/admin-logo.png" alt="logo"/>
                                    </figure>
                                    <span>{lang.applicant_name}</span>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div className={"test-description-info"}>
                                    <div>
                                        <h4>{lang.test_description}</h4>
                                        <span><b>{lang.level}:</b>&nbsp;
                                            {question.parameters ?
                                                constData.levels[`level_${question.parameters.testForLevel}`] :
                                                <FlipCameraAndroidOutlined/>}
                                        </span>
                                        <span><b>{lang.tasks}:</b>&nbsp;
                                            {question.tests ?
                                                question.tests.length :
                                                <FlipCameraAndroidOutlined/>}
                                        </span>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                <div className={"test-description-time"}>
                                    <div>
                                        <h4>{lang.test_duration}</h4>
                                        <span>
                                            {question.parameters ?
                                                constData.times[`time_${question.parameters.testDuration}`] :
                                                <FlipCameraAndroidOutlined/>}
                                        </span>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.item}>
                    {Object.keys(question).length > 0 ?
                        <QuestionsList lang={lang} question={question.tests}/> :
                        <Paper className={classes.paper}>
                            <div className={"test-description-wait"}>
                                <FlipCameraAndroidOutlined />
                                <span>{lang.loading}.</span>
                            </div>
                        </Paper>
                    }
                </Grid>
                <Grid item xs={6} className={classes.item}>
                    <Paper className={`${classes.paper} ${classes.paperBg}`}>
                        <Button className={classes.blueBtn} variant="contained" color="primary"
                            disabled={Object.keys(question).length === 0} onClick={handleStartTest}
                        >
                            {lang.start_test}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default TestDescription