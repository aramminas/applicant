import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
import {makeStyles} from '@material-ui/core/styles'
import {Grid} from '@material-ui/core'
import Layout from "../../hoc/layout/Layout"
import EmptyTest from "./EmptyTest"
import TestContent from "./TestContent/TestContent"
import FirebaseFunctions from "../../helpers/FirebaseFunctions"
import getUpdateChartData from '../../helpers/getUpdateChartData'
import {useToasts} from "react-toast-notifications"
import makeId from "../../helpers/makeId"
import TestIsFinished from "./TestContent/TestIsFinished"
import formatDate from 'intl-dateformat'

import './Test.scss'
import lang_en from "../../lang/en/main.json"
import lang_am from "../../lang/am/main.json"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    container: {
        width: '100%',
        margin: 0,
    }
}))

const ErrorMessage = (error,addToast) => {
    let errorCode = error.code
    let errorMessage = error.message
    if ((errorCode && errorMessage) || errorMessage) {
        addToast(errorMessage, {
            appearance: 'error',
            autoDismiss: true,
        })
    }
}

const Test = () => {
    const classes = useStyles()
    const {addToast} = useToasts()
    const {user} = useSelector(state => state)
    const {language} = useSelector(state => state.language)
    const [unknownTest, setUnknownTest] = useState(true)
    const [question, setQuestion] = useState({})
    const [finishedTest, setFinishedTest] = useState(false)
    const [checking, setChecking] = useState(false)
    const [loader, setLoader] = useState(false)
    let lang = language === 'EN' ? lang_en : lang_am

    useEffect(function () {
        if(user.testId === ""){
            const LSTestId = localStorage.getItem('testId')
            if(!LSTestId || LSTestId === ""){
                setUnknownTest(false)
            }else{
                getQuestion(LSTestId.trim())
            }
        }else{
            getQuestion(user.testId.trim())
        }
    }, [])

    const getQuestion = (id) => {
        if(id && id !== ""){
            setLoader(true)
            FirebaseFunctions.getTestDataById(id).then(data => {
                if(Object.keys(data).length > 0){
                    setQuestion({...data})
                }
            }).catch(error => {
                ErrorMessage(error,addToast)
            })
            // check whether this user has passed this test or not
            FirebaseFunctions.getAllTestsResults().then(result => {
                setLoader(false)
                if(Object.keys(result).length > 0){
                    Object.keys(result).map(res => {
                        let userId = user.userId
                        if(!user.userId || user.userId === ""){
                            userId = localStorage.getItem('userId')
                        }
                        if(result[res] && result[res].testId === id && result[res].userId === userId){
                            setFinishedTest(true)
                        }
                        setChecking(true)
                        return true
                    })
                }
            }).catch(error => {
                error.results === 0 && setChecking(true)
                setLoader(false)
                ErrorMessage(error,addToast)
            })
        }
    }

    const saveTestResult = (data) => {
        setLoader(true)
        const dateAt = new Date()
        const applicantTestResult = {
            id: makeId(28),
            finishTime: data.finishTime,
            examDate: formatDate(dateAt, 'MM/DD/YYYY'),
            fullName: `${user.firstName}, ${user.lastName}`,
            email: user.email,
            parameters: {...question.parameters},
            answers: [...data.answers],
        }

        const LSUserId = user.userId === "" ? localStorage.getItem('userId') : user.userId
        const LSTestId = user.testId === "" ? localStorage.getItem('testId') : user.testId
        applicantTestResult.userId = LSUserId
        applicantTestResult.testId = LSTestId
        applicantTestResult.score = 0
        applicantTestResult.userTotalScore = 0
        applicantTestResult.needManualEvaluation = false

        data.answers.map(item => {
            applicantTestResult.score += Number(item.score)
            applicantTestResult.userTotalScore += Number(item.defaultScore)
            if(item.answerType === "text"){
                applicantTestResult.needManualEvaluation = true
            }
            return true
        })

        FirebaseFunctions.addNewData("tests-results", applicantTestResult.id, applicantTestResult)
            .then(response => {
                if(response.message){
                    setLoader(false)
                    setFinishedTest(true)
                    getUpdateChartData("passed-test","add")
                    addToast(lang.success_test, {
                        appearance: 'success',
                        autoDismiss: true,
                    })
                }
            })
            .catch(error => {
                setLoader(false)
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                })
            })
    }

    return (
        <div className={`${classes.root} user-test default-content-height`}>
            { checking ?
                !finishedTest ?
                    <Grid container spacing={3} className={classes.container} direction="row" justify="space-evenly"
                        alignItems="center">
                        { unknownTest ?
                            <Grid item xs={12}>
                                <TestContent lang={lang} question={question} saveTestResult={saveTestResult}/>
                            </Grid> :
                            <Grid item xs={6}>
                                <EmptyTest lang={lang}/>
                            </Grid>
                        }
                    </Grid>
                    :
                    <Grid container spacing={3} className={classes.container} direction="row" justify="space-evenly"
                        alignItems="center">
                        <Grid item xs={12}>
                            <TestIsFinished lang={lang} />
                        </Grid>
                    </Grid>
                :
                null
            }
            { loader ?
                <div className={"test-loader-content"}>
                    <figure className={"test-activity-loader"}>
                        <img src="/images/gifs/load.gif" alt="loader"/>
                        <span>{lang.data_uploading}. . .</span>
                    </figure>
                </div>: null
            }
        </div>
    )
}

export default Layout(Test)