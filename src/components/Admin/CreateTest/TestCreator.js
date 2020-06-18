import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Quiz from "./Steps/Quiz"
import Logical from "./Steps/Logical"
import FinishTest from "./Steps/FinishTest"
import UnknownStep from "./Steps/UnknownStep"
import EmptyDataModal from "./EmptyDataModal"
import {useToasts} from "react-toast-notifications"
import {CheckCircle, HourglassEmptyRounded, ReportProblemOutlined} from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    completed: {
        display: 'inline-block',
        color: '#007fba',
        fontWeight: 600,
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    finishIcon:{
        fontSize: '28px',
    }
}))

function getSteps(lang) {
    return [lang.create_test_title_1, lang.create_test_title_2, lang.create_test_title_3]
}

function getStepContent(step,lang) {
    switch (step) {
        case 0:
            return lang.step_1
        case 1:
            return lang.step_2
        case 2:
            return lang.step_3
        default:
            return lang.unknown_step
    }
}

const initComplete = {
    quiz: false,
    logical: false
}

export default function TestCreator(props) {
    const classes = useStyles()
    const { addToast } = useToasts()
    const [activeStep, setActiveStep] = React.useState(0)
    const [completed, setCompleted] = React.useState({})
    const [openEmptyModal, setEmptyModal] = useState(false)
    const [complete, setComplete] = useState(initComplete)
    const [resetSettings, setResetSettings] = useState(false)
    const {lang, quizzesCount, logicalTestsCount, totalScore, addQuizData, added,
           addLogicalData, testData, deleteTest, createNewTest, validation, resetDefaultData} = props
    const steps = getSteps(lang)

    const totalSteps = () => {
        return steps.length
    }

    const completedSteps = () => {
        return Object.keys(completed).length
    }

    const isLastStep = () => {
        return activeStep === totalSteps() - 1
    }

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps()
    }

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                  // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1
        setActiveStep(newActiveStep)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleStep = (step) => () => {
        setActiveStep(step)
    }

    const handleComplete = (step, type= "step") => {
        let goToNext = true
        if(step === 0){
            if(quizzesCount === 0){
                goToNext = false
                setEmptyModal(true)
            }
        }else if(step === 1){
            if(logicalTestsCount === 0){
                goToNext = false
                setEmptyModal(true)
            }
        }else if(step === 2){ // 2 it is finish step
            if(testData.logicalTests.length === 0 && testData.quizzes.length === 0){
                addToast(lang.complete_empty_warning, {
                    appearance: 'warning',
                    autoDismiss: true
                })
                setResetSettings(true)
                return false
            }else if(completedSteps() < 2){
                addToast(lang.not_complete_warning, {
                    appearance: 'warning',
                    autoDismiss: true
                })
                return false
            }
        }

        if(goToNext || type === "complete" || type === "empty"){
            step === 0 ? setComplete({...complete, quiz: true}) : setComplete({...complete, logical: true})
            handleCloseEmptyModal()
            const newCompleted = completed
            newCompleted[activeStep] = true
            setCompleted(newCompleted)
            handleNext()

            // calling the last function to add the test
            if(type === "complete"){
                createNewTest()
            }
        }
    }

    const handleReset = () => {
        setActiveStep(0)
        setCompleted({})
        setComplete(initComplete)
        setResetSettings(false)
        resetDefaultData()
    }

    // empty Modal
    const handleCloseEmptyModal = () => {
        setEmptyModal(false)
    }

    return (
        <div className={classes.root}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepButton onClick={handleStep(index)} completed={completed[index]}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                {allStepsCompleted() ? (
                    <div className={"reset-test-settings-container"}>
                        <div className={"reset-test-settings-text"}>
                            <Typography className={classes.instructions}>
                                {(validation.name || validation.level || validation.duration) || !validation.ready ?
                                    <><ReportProblemOutlined htmlColor={"#ff9a00"}/>{lang.empty_fields_desc}</> :
                                    added ?
                                        <><HourglassEmptyRounded htmlColor={"#2ECC71"} className={classes.finishIcon}/>{lang.loading}</> :
                                        <><CheckCircle htmlColor={"#2ECC71"} className={classes.finishIcon}/> {lang.steps_completed_text}</>
                                }
                            </Typography>
                        </div>
                        {(validation.name || validation.level || validation.duration) || !validation.ready ?
                            <Button variant="contained" color="primary" className={classes.button} onClick={()=>createNewTest()}>
                                {lang.finish}
                            </Button> :
                            <Button variant="contained" onClick={handleReset} disabled={added}>{lang.reset}</Button>
                        }
                    </div>

                ) : (
                    <>
                        {/* section step by step creating test */}
                        {(() => {
                            switch (activeStep) {
                                case 0:
                                    return <Quiz
                                        lang={lang}
                                        totalScore={totalScore}
                                        quizzesCount={quizzesCount}
                                        addQuizData={addQuizData}
                                        complete={complete.quiz}/>
                                case 1:
                                    return <Logical
                                        lang={lang}
                                        totalScore={totalScore}
                                        logicalTestsCount={logicalTestsCount}
                                        addLogicalData={addLogicalData}
                                        complete={complete.logical}/>
                                case 2:
                                    return <FinishTest
                                        lang={lang}
                                        totalScore={totalScore}
                                        testData={testData}
                                        deleteTest={deleteTest}/>
                                default: return <UnknownStep/>
                            }
                        })()}
                        <Typography className={classes.instructions}>
                            {getStepContent(activeStep,lang)}
                        </Typography>
                        <div>
                            <Button
                                variant="contained"
                                disabled={activeStep === 0 || resetSettings}
                                onClick={handleBack}
                                className={classes.button}>
                                {lang.back}
                            </Button>
                            <Button
                                variant="contained"
                                disabled={activeStep === steps.length-1}
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                {lang.next}
                            </Button>
                            {activeStep !== steps.length &&
                            (completed[activeStep] ? (
                                <Typography variant="caption" className={classes.completed}>
                                    {`${lang.step} ${activeStep + 1} ${lang.already_completed}`}
                                </Typography>
                            ) : (
                                <Button variant="contained" color="primary"
                                        className={classes.button}
                                        onClick={()=>
                                            handleComplete(activeStep,completedSteps() === totalSteps() - 1 ? "complete" : "")
                                        }
                                        disabled={resetSettings}
                                >
                                    {completedSteps() === totalSteps() - 1 ? lang.finish : lang.complete_step}
                                </Button>
                            ))}
                            {resetSettings ?
                                <Button variant="contained" onClick={handleReset} className={classes.button}>{lang.reset}</Button>
                                : null}
                        </div>
                    </>
                )}
            </div>
            <EmptyDataModal
                lang={lang}
                open={openEmptyModal}
                handleClose={handleCloseEmptyModal}
                handleComplete={handleComplete}
                activeStep={activeStep}
            />
        </div>
    )
}