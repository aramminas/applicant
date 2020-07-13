import React, {Fragment, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Paper, Grid, TextField, Button} from '@material-ui/core'
import {AccountCircleTwoTone,
    AssignmentTwoTone,
    AssignmentTurnedInTwoTone,
    FilterFramesTwoTone,
    AddCircleTwoTone,
    SyncProblem,
} from '@material-ui/icons'
import {useToasts} from "react-toast-notifications"
import ReactTooltip from "react-tooltip"
import {Animated} from "react-animated-css"
import FirebaseFunctions from "../../../helpers/FirebaseFunctions"
import data from '../../../constants'
import Loader from "react-loader-spinner"
const levels = data.admin.applicantLevels
const times = data.admin.times

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}))

const TestState = (props) => {
    const classes = useStyles()
    const {addToast} = useToasts()
    const [scoreData, setScoreData] = useState({})
    const [focus, setFocus] = useState("")
    const {lang, resultData, tecData, updateUserTestScore} = props

    const getSpentTime = () => {
        let time = 0
        let spentTime = resultData?.finishTime
        let duration = resultData?.parameters?.testDuration
        if(spentTime && duration){
            let hour = Number(spentTime.slice(0,2)) * 60
            let minute = Number(spentTime.slice(3,5))
            time = duration - hour - minute
        }
        return time
    }

    const addScore = (id) => {
        let value = scoreData[`sc_${id}`]
        let setScore = 0
        let totalScore = resultData.score
        let estimated = true
        if(value){
            setScore = value
        }
        const cloneAnswers = [...resultData.answers]
        const updateData = cloneAnswers.map(item => {
            if(item.id === id){
                item.score = setScore
                totalScore += setScore
                item.estimated = true
            }
            if(item.type === "logical" && !item.estimated){
                estimated = false
            }
            return item
        })
        FirebaseFunctions.addUserTestScore(resultData.id, id , setScore, updateData, estimated, totalScore, resultData).then(data => {
            if(data.message){
                addToast(lang.success_score_added, {
                    appearance: 'success',
                    autoDismiss: true,
                })
                updateUserTestScore()
            }
        }).catch(error => {
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true,
            })
        })
    }

    const getScore = (ev, id, max) => {
        let value = Number(ev.target.value)

        if(isNaN(value) || value < 0 || value > max){
            let msg = `${lang.score_ange} 0 - ${max}`
            addToast(msg, {
                appearance: 'error',
                autoDismiss: true,
            })
        }else {
            const data = {...scoreData}
            let scoreName = `sc_${id}`
            setScoreData({...data, [scoreName]: value})
            setFocus(scoreName)
        }
    }

    const AnswersJSX = () => {
        if(resultData.answers && Object.keys(resultData.answers).length > 0 ){
            return resultData.answers.map((item, index ) => {
                return (
                    <Fragment key={`answer-${index}`}>
                        { item.type === "logical" && item.answerType === "text" ?
                            (
                                <Fragment>
                                    <Grid item xs={5}>
                                        <TextField
                                            multiline
                                            disabled
                                            fullWidth
                                            variant="outlined"
                                            label={lang.question}
                                            value={item.answerQuestion}
                                        />
                                    </Grid>
                                    <Grid item xs={!item.estimated ? 4 : 6}>
                                        <TextField
                                            multiline
                                            disabled
                                            fullWidth
                                            variant="outlined"
                                            label={lang.answer}
                                            value={item.answerText}
                                        />
                                    </Grid>
                                    { !item.estimated ?
                                        <>
                                            <Grid item xs={1}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    type={"number"}
                                                    autoFocus={focus === `sc_${item.id}`}
                                                    placeholder={"0"}
                                                    value={scoreData[`sc_${item.id}`] ? scoreData[`sc_${item.id}`] : 0}
                                                    onChange={(ev)=>getScore(ev, item.id, item.defaultScore)}
                                                />
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Button
                                                    variant="outlined"
                                                    className={"add-score"}
                                                    data-tip={lang.estimate}
                                                    onClick={()=>addScore(item.id)}
                                                >
                                                    <AddCircleTwoTone fontSize={"large"}/>
                                                </Button>
                                                <ReactTooltip />
                                            </Grid>
                                        </> : null
                                    }
                                    <Grid item xs={1}>
                                        <TextField
                                            disabled
                                            fullWidth
                                            variant="outlined"
                                            className={"answer-score"}
                                            value={`${item.score} / ${item.defaultScore}`}
                                        />
                                    </Grid>
                                </Fragment>
                            )
                            :
                            (
                                <Fragment>
                                    <Grid item xs={11}>
                                        <TextField
                                            multiline
                                            disabled
                                            fullWidth
                                            variant="outlined"
                                            label={lang.question}
                                            value={item.answerQuestion}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <TextField
                                            disabled
                                            fullWidth
                                            variant="outlined"
                                            className={"answer-score"}
                                            value={`${item.score} / ${item.defaultScore}`}
                                        />
                                    </Grid>
                                </Fragment>
                            )
                        }
                    </Fragment>
                )
            })
        }else {
            return null
        }
    }

    return (
        <div className={'test-result-state'}>
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={3}>
                                <Grid item lg={6} xs={12}>
                                    <Paper className={`${classes.paper} test-result-data-title first-section`}>
                                        <Animated animationIn="zoomIn" animationOut="fadeOut" isVisible={true}>
                                            <AccountCircleTwoTone />
                                            <span>{lang.user_data}</span>
                                            <hr/>
                                            <ul>
                                                <li><span>{lang.full_name}:</span>
                                                    <span>{resultData.fullName ? resultData.fullName : <SyncProblem/>}</span>
                                                </li>
                                                <li><span>{lang.email}:</span>
                                                    <span>{resultData.email ? resultData.email : <SyncProblem/>}</span>
                                                </li>
                                                <li><span>{lang.exam_date}:</span>
                                                    <span>{resultData.examDate ? resultData.examDate : <SyncProblem/>}</span>
                                                </li>
                                                <li><span>{lang.finish_time}:</span>
                                                    <span>{resultData.finishTime ? resultData.finishTime : <SyncProblem/>}</span>
                                                </li>
                                                <li><span>{lang.spent_time}:</span> <span>{getSpentTime()} {lang.minute}</span></li>
                                            </ul>
                                        </Animated>
                                    </Paper>
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <Paper className={`${classes.paper} test-result-data-title`}>
                                        <Animated animationIn="zoomIn" animationOut="fadeOut" isVisible={true}>
                                            <AssignmentTwoTone />
                                            <span>{lang.test_data}</span>
                                            <hr/>
                                            <figure>
                                                <img src={tecData.icon ? tecData.icon: "/images/pages/technology_default.png"} alt="logo"/>
                                            </figure>
                                            <ul>
                                                <li><span>{lang.test_name_}:</span> <span>{tecData.name ? tecData.name : <SyncProblem/>}</span></li>
                                                <li>
                                                    <span>{lang.test_level}:</span>
                                                    <span>
                                                        {resultData.parameters ?
                                                            levels.filter(item => item.id === resultData.parameters.testForLevel)[0].name :
                                                            <SyncProblem/>}
                                                    </span>
                                                </li>
                                                <li>
                                                    <span>{lang.test_duration}:</span>
                                                    <span>
                                                        {resultData.parameters ?
                                                            times.filter(item => item.value === resultData.parameters.testDuration)[0].name :
                                                            <SyncProblem/>}
                                                    </span>
                                                </li>
                                            </ul>
                                        </Animated>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Paper className={`${classes.paper} test-result-data-title`}>
                                        <Animated animationIn="zoomIn" animationOut="fadeOut" isVisible={true}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <AssignmentTurnedInTwoTone />
                                                    <span className={"test-result-title"}>{lang.answers}</span>
                                                    <hr/>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid  container spacing={3}>
                                                        { Object.keys(resultData).length > 0 ?
                                                            <AnswersJSX /> :
                                                            <div className={"test-state-loader"}>
                                                                <Loader type="Rings" color="#232f3e" height={150} width={150} />
                                                            </div>
                                                        }
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <hr/>
                                                    <span className={"test-result-total"}>
                                                    <FilterFramesTwoTone />
                                                    <span className={"test-result-title"}>
                                                        {lang.total_score} {resultData.score} / {resultData.userTotalScore}
                                                    </span>
                                                </span>
                                                </Grid>
                                            </Grid>
                                        </Animated>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default TestState