import React, {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Paper, Button} from '@material-ui/core'
import {BallotTwoTone, LiveHelpTwoTone, ScheduleTwoTone, Repeat, CheckCircleTwoTone} from '@material-ui/icons'
import {Animated} from "react-animated-css"
import {useToasts} from "react-toast-notifications"
import QuestionContent from "./QuestionContent"
import AnsweredList from "./AnsweredList"
import PutAsideList from "./PutAsideList"
import MissedQuestionsModal from "./MissedQuestionsModal"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    button: {
        margin: theme.spacing(1),
    },
    paperBg: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    greenBtn: {
        backgroundColor: '#28a745',
        '&:hover': {
            backgroundColor: '#1f8035',
        },
    },
    yellowBtn: {
        backgroundColor: '#ffc107',
        '&:hover': {
            backgroundColor: '#c49508',
        },
    },
}))

const callToaster = (addToast, type, message) => {
    addToast(message, {
        appearance: type,
        autoDismiss: true,
    })
}

const initApplicantData = {
    answers: [],
    questions: [],
    currentQuestion: {},
    currentQuestionId: 0,
    putAside: [],
    putAsideId: 0,
    currentQuestionType: "",
    currentQuestionNumber: 0,
    totalQuestionCount: 0,
    finishTime: "",
    questionsAreOver: false,
}

const TestQuestion = (props) => {
    const classes = useStyles()
    const { addToast } = useToasts()
    const [duration, setDuration] = useState("00:00:00")
    const [applicantData, setApplicantData] = useState({...initApplicantData})
    const [changeAnimation, setChangeAnimation] = useState(true)
    const [open, setOpen] = useState(false)
    const [forceStop, setForceStop] = useState(false)
    const {lang, question, saveTestResult} = props

    useEffect(function () {
        if(Object.keys(question).length > 0 && !forceStop){
            if(question.parameters && question.parameters.testDuration){
                const firstQuestion = question.tests[applicantData.currentQuestionNumber]
                setApplicantData({
                    ...applicantData,
                    questions: [...question.tests],
                    currentQuestion: {...firstQuestion},
                    currentQuestionId: firstQuestion.id,
                    currentQuestionType: firstQuestion.type,
                    totalQuestionCount: question.tests.length,
                })
                startTimer(question.parameters.testDuration)
            }
        }
        // when the test time expired
        if(forceStop){
            stopTest()
        }
        return () => clearInterval(window.intervalT)
    },[forceStop])

    const startTimer = (data, display= '') => {
        let timer = data * 60 * 1000, now, distance, minutes, seconds, hours
        let countDownDate = new Date().getTime() + timer
        window.intervalT = setInterval(() => {
            now = new Date().getTime()
            distance = countDownDate - now
            hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            seconds = Math.floor((distance % (1000 * 60)) / 1000)

            hours = hours < 10 ? "0" + hours : hours
            minutes = minutes < 10 ? "0" + minutes : minutes
            seconds = seconds < 10 ? "0" + seconds : seconds

            // when the time is up
            if(Number(hours) === 0 && Number(minutes) === 0 && Number(seconds) === 0){
                setForceStop(true)
                clearInterval(window.intervalT)
            }

            display = hours + ":" + minutes + ":" + seconds

            setDuration(display)
        }, 1000);
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleFinishTest = () => {
        handleClose()
        const collectAnswers = [...applicantData.answers]
        applicantData.putAside.map(item => {
            let writeAnswer = {
                id: item.id,
                answered: true,
                type: item.type,
                answerText: "",
                answerQuestion: item.question,
                selectedAnswers: [],
                answerType: "options",
                testNumber: item.number,
                score: 0,
                defaultScore: item.score,
            }
            if(item.options && item.options.length > 0){
                writeAnswer.answerType =  "options"
            }else if(item.optionsOrText){
                writeAnswer.answerType = "text"
                writeAnswer.estimated = false
            }
            collectAnswers.push(writeAnswer)
            return false
        })
        const clearPutAside = []
        setApplicantData(() => {
            const data = {...applicantData,
                answers: [...collectAnswers],
                currentQuestion: {},
                currentQuestionId: 0,
                currentQuestionType: "",
                currentQuestionNumber: 0,
                finishTime: duration,
                putAside: [...clearPutAside],
            }
            saveTestResult(data)
            return data
        })
    }

    const putAside = () => {
        applicantData.putAside.push({...applicantData.currentQuestion, number: applicantData.currentQuestionNumber})
        const nextQuestion = applicantData.questions[applicantData.currentQuestionNumber+1]
        if(nextQuestion !== undefined){
            setChangeAnimation(false)
            setTimeout(function () {
                setChangeAnimation(true)
                setApplicantData({...applicantData,
                    answers: [...applicantData.answers],
                    putAside: [...applicantData.putAside],
                    currentQuestion: {...nextQuestion},
                    currentQuestionId: nextQuestion.id,
                    currentQuestionType: nextQuestion.type,
                    currentQuestionNumber: applicantData.currentQuestionNumber+1,
                })
            },1000)
            callToaster(addToast, 'warning', lang.warning_question_postponed)
        }else{
            finishQuestion()
        }
    }

    const finishQuestion = () => {
        setChangeAnimation(false)
        setTimeout(function () {
            setApplicantData({...applicantData,
                currentQuestion: {},
                currentQuestionId: 0,
                currentQuestionType: "",
                finishTime: duration,
                questionsAreOver: true,
            })
        },1000)
    }

    const handleSubmitNext = (id, data) => {
        let writeAnswer = {}
        if(data.options.length > 0){
            writeAnswer = {
                id,
                answered: true,
                type: applicantData.currentQuestionType,
                answerText: "",
                answerQuestion: applicantData.currentQuestion.question,
                selectedAnswers: [...data.options],
                answerType: "options",
                testNumber: applicantData.currentQuestionNumber+1,
                score: 0,
                defaultScore: applicantData.currentQuestion.score,
            }

            let temp = applicantData.currentQuestion
            let tempScore = 0
            let getPercent = 0
            let answerCount = data.options.length
            let rightAnswersCount = temp.rightAnswers.length
            let allOptionsCount = temp.options.length

            if(temp.multiAnswer !== undefined || temp.optionsOrText === false){
                data.options.map(item => {
                    if(temp.rightAnswers.indexOf(item) !== -1){
                        tempScore++
                    }
                    return true
                })
            }
            // counting of scores
            if(tempScore !== 0){
                if(tempScore === answerCount && tempScore === rightAnswersCount){
                    writeAnswer.score = temp.score
                }else {
                    if(answerCount === allOptionsCount){
                        writeAnswer.score = 0
                    }else {
                       getPercent = 100/answerCount * tempScore
                       writeAnswer.score = Math.floor((getPercent * temp.score) / 100)
                    }
                }
            }else {
                writeAnswer.score = 0
            }

            applicantData.answers.push(writeAnswer)
            const nextQuestion = applicantData.questions[applicantData.currentQuestionNumber+1]
            if(nextQuestion !== undefined){
                setChangeAnimation(false)
                setTimeout(function () {
                    setChangeAnimation(true)
                    setApplicantData({...applicantData,
                        answers: [...applicantData.answers],
                        currentQuestion: {...nextQuestion},
                        currentQuestionId: nextQuestion.id,
                        currentQuestionType: nextQuestion.type,
                        currentQuestionNumber: applicantData.currentQuestionNumber+1,
                    })
                },1000)
                callToaster(addToast, 'success', lang.answer_is_saved)
            }else{
                finishQuestion()
            }
        }else if(applicantData.currentQuestion.optionsOrText){
            if(data.text !== ""){
                writeAnswer = {
                    id,
                    answered: true,
                    estimated: false,
                    type: applicantData.currentQuestionType,
                    answerText: data.text,
                    answerQuestion: applicantData.currentQuestion.question,
                    selectedAnswers: [],
                    answerType: "text",
                    testNumber: applicantData.currentQuestionNumber+1,
                    score: 0,
                    defaultScore: applicantData.currentQuestion.score,
                }
                applicantData.answers.push(writeAnswer)
                const nextQuestion = applicantData.questions[applicantData.currentQuestionNumber+1]
                if(nextQuestion !== undefined){
                    setChangeAnimation(false)
                    setTimeout(function () {
                        setChangeAnimation(true)
                        setApplicantData({...applicantData,
                            answers: [...applicantData.answers],
                            currentQuestion: {...nextQuestion},
                            currentQuestionId: nextQuestion.id,
                            currentQuestionType: nextQuestion.type,
                            currentQuestionNumber: applicantData.currentQuestionNumber+1,
                        })
                    },1000)
                    callToaster(addToast, 'success', lang.answer_is_saved)
                }else{
                    finishQuestion()
                }
            }else{
                callToaster(addToast, 'error', lang.error_empty_text_answers)
            }
        }else {
            let errorMessage
            if(applicantData.currentQuestion.optionsOrText){
                errorMessage = lang.error_empty_text_answers
            }else {
                errorMessage = lang.error_empty_answers
            }
            callToaster(addToast, 'error', errorMessage)
        }
    }

    const repeatMissedQuestions = () => {
        const firstQuestion = applicantData.putAside[0]
        let tempData = [...applicantData.putAside]
        applicantData.putAside = []
        if(firstQuestion && Object.keys(firstQuestion).length > 0){
            setApplicantData({
                ...applicantData,
                questions: [...tempData],
                currentQuestion: {...firstQuestion},
                currentQuestionId: firstQuestion.id,
                currentQuestionType: firstQuestion.type,
                totalQuestionCount: tempData.length,
                currentQuestionNumber: 0,
                putAside: [...applicantData.putAside],
                questionsAreOver: false,
            })
            setChangeAnimation(true)
        }else {
            callToaster(addToast, 'error', lang.an_error_occurred)
        }
    }

    const finishTest = () => {
        if(applicantData.putAside.length > 0){
            handleClickOpen()
        }else {
            saveTestResult(applicantData)
        }
    }

    const stopTest = () => {
        callToaster(addToast, 'error', lang.error_time_is_up)
        callToaster(addToast, 'warning', lang.warning_time_is_up)
        setTimeout(function () {
            handleFinishTest()
        },3000)
    }

    return (
        <div className={'test-question'}>
            <div className={classes.root}>
                { !applicantData.questionsAreOver ?
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper className={`${classes.paper} ${classes.paperBg}`}>
                                <Grid container spacing={3} className={"test-question-header"}>
                                    <Grid item xs={6}>
                                        <div>
                                            <span><LiveHelpTwoTone htmlColor={"#001f95"}/> {lang.question}:</span>&nbsp;
                                            # {applicantData.currentQuestionNumber + 1} / {applicantData.totalQuestionCount}
                                        </div>
                                        <div>
                                            <span><BallotTwoTone htmlColor={"#001f95"}/> {lang.type}:</span> {applicantData.currentQuestionType}
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div>
                                            <div>
                                                <span>{lang.time_left} <ScheduleTwoTone htmlColor={"#001f95"}/></span>
                                            </div>
                                            <div>
                                                <span className={"test-question-duration"}>{duration}</span>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={`${classes.paper} ${classes.paperBg}`}>
                                <QuestionContent lang={lang}
                                    data={applicantData.currentQuestion}
                                    changeAnimation={changeAnimation}
                                    handleSubmitNext={handleSubmitNext}
                                    putAside={putAside}
                                />
                            </Paper>
                        </Grid>
                    </Grid> :
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper className={`${classes.paper}`}>
                                <div className={"test-status-head"}>
                                    <div className={"test-status-test-title"}>
                                        <span>{lang.test_status}</span>
                                    </div>
                                    <div className={"test-status-question-duration"}>
                                        <div>
                                            <span>{lang.time_left} <ScheduleTwoTone htmlColor={"#001f95"}/></span>
                                        </div>
                                        <div>
                                            <span className={"test-question-duration"}>{duration}</span>
                                        </div>
                                    </div>
                                </div>
                                <Animated animationIn="zoomIn" animationOut="zoomOut" animationInDuration={1000} animationOutDuration={1000} isVisible={true}>
                                    <AnsweredList data={applicantData} lang={lang}/>
                                </Animated>
                                <Animated animationIn="zoomIn" animationOut="zoomOut" animationInDuration={1200} animationOutDuration={1200} isVisible={true}>
                                    <PutAsideList data={applicantData} lang={lang}/>
                                </Animated>
                                <div className={"test-question-finish-btn"}>
                                    { applicantData.putAside.length > 0 ?
                                        <Button variant="contained" color="secondary"
                                                className={`${classes.button} ${classes.yellowBtn}`}
                                                startIcon={<Repeat />} onClick={repeatMissedQuestions}
                                        >
                                            {lang.answer_missed_questions}
                                        </Button> : null
                                    }
                                    <Button variant="contained" color="primary"
                                        className={`${classes.button} ${classes.greenBtn}`}
                                        endIcon={<CheckCircleTwoTone />} onClick={finishTest}
                                    >
                                        {lang.finish_the_test}
                                    </Button>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                }
            </div>
            <MissedQuestionsModal lang={lang} open={open} handleClose={handleClose} handleFinishTest={handleFinishTest}/>
        </div>
    )
}

export default TestQuestion