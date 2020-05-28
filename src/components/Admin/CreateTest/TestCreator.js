import React from 'react'
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

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
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

export default function TestCreator(props) {
    const classes = useStyles()
    const [activeStep, setActiveStep] = React.useState(0)
    const [completed, setCompleted] = React.useState({})
    const {lang, quizzesCount, addQuizData} = props
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

    const handleComplete = () => {
        const newCompleted = completed
        newCompleted[activeStep] = true
        setCompleted(newCompleted)
        handleNext()
    }

    const handleReset = () => {
        setActiveStep(0)
        setCompleted({})
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
                    <div>
                        <Typography className={classes.instructions}>
                            {lang.steps_completed_text}
                        </Typography>
                        <Button variant="contained" onClick={handleReset}>{lang.reset}</Button>
                    </div>
                ) : (
                    <div>
                        <div>
                            {(() => {
                                switch (activeStep) {
                                    case 0: return <Quiz lang={lang} quizzesCount={quizzesCount} addQuizData={addQuizData}/>
                                    case 1: return <Logical/>
                                    case 2: return <FinishTest/>
                                    default: return <UnknownStep/>
                                }
                            })()}
                        </div>
                        <Typography className={classes.instructions}>
                            {getStepContent(activeStep,lang)}
                        </Typography>
                        <div>
                            <Button
                                variant="contained"
                                disabled={activeStep === 0}
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
                                <Button variant="contained" color="primary" onClick={handleComplete}>
                                    {completedSteps() === totalSteps() - 1 ? lang.finish : lang.complete_step}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}