import React, {Fragment, useState, useEffect} from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import {Paper, Grid, TextField, Radio, Checkbox, FormControlLabel, Button} from '@material-ui/core'
import {green, grey} from "@material-ui/core/colors"
import {LowPriority, SendOutlined} from "@material-ui/icons"
import {Animated} from "react-animated-css"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    bg: {
        backgroundColor: '#fafcffab',
    },
    contentRadioCheckbox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& > label': {
            margin: 0,
            borderRadius: '5px',
        }
    },
    radioCheckbox:{
        border: '1px solid',
        borderColor: grey[400],
    },
    minHeight: {
      minHeight: '50vh',
    },
}))

const GreenRadio = withStyles({
    root: {
        color: grey[500],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />)

const GreenCheckbox = withStyles({
    root: {
        color: grey[500],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />)

const initAnswerData = {
    options: [],
    text: "",
}

const QuestionContent = (props) => {
    const classes = useStyles()
    const [answerData, setAnswerData] = useState({...initAnswerData})
    const {lang, data, changeAnimation, handleSubmitNext, putAside} = props

    useEffect(function () {
        setAnswerData({options: [], text: ""})
    },[])
    /* set answer */
    const handleSubmit = () => {
        handleSubmitNext(data.id, answerData)
        setAnswerData({options: [], text: ""})
    }

    /* put aside answer */
    const handlePutAside = () => {
        putAside()
        setAnswerData({options: [], text: ""})
    }

    /* set options answer */
    const handleChangeAnswer = (event) => {
        if(data.multiAnswer === true){
            // added value for multi answers (Checkbox)
            if(event.target.checked){
                answerData.options.push(+event.target.name)
            }else{
                const index = answerData.options.indexOf(+event.target.name)
                if (index > -1) {
                    answerData.options.splice(index, 1)
                }
            }
            setAnswerData({ ...answerData, options: [...answerData.options]})
        }else if(data.multiAnswer === false || data.multiAnswer === undefined){
            // added value for a single answer (Radio)
            setAnswerData({ ...answerData, options: [+event.target.value]})
        }
    }

    /* set text answer */
    const writeAnswer = (event) => {
        setAnswerData({ ...answerData, text: event.target.value})
    }

    /* Options view part */
    const OptionsJsx = () => {
        return (
            <Grid container spacing={3}>
                {  data.multiAnswer &&
                    <Grid item xs={12}>
                        <span className={"test-question-answer-title"}>{lang.select_all_answers}</span>
                    </Grid>
                }
                {
                    data.options && data.options.map((val, index) => {
                        return (
                            <Fragment key={index}>
                                { data.multiAnswer ?
                                    <Grid item xs={1} className={classes.contentRadioCheckbox}>
                                        <FormControlLabel
                                            className={classes.radioCheckbox}
                                            control={<GreenCheckbox
                                                checked={answerData.options.indexOf(index) !== -1}
                                                onChange={handleChangeAnswer} name={`${index}`}
                                            />}
                                            label={null}/>
                                    </Grid> :
                                    <Grid item xs={1} className={classes.contentRadioCheckbox}>
                                        <GreenRadio
                                            className={classes.radioCheckbox}
                                            checked={answerData.options.indexOf(index) !== -1}
                                            onChange={handleChangeAnswer}
                                            value={index}
                                            name="radio-button-answer"
                                            inputProps={{ 'aria-label': `answer-${index}` }}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={11}>
                                    <TextField
                                        id="test-question"
                                        className={`${classes.bg} text-color-im`}
                                        multiline
                                        disabled
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        defaultValue={val}
                                    />
                                </Grid>
                            </Fragment>
                        )
                    })
                }
            </Grid>
        )
    }

    /* Code view part */
    const CodeJsx = () => {
        return (
            <>
                { data.codeData && data.codeData !== "" ?
                    <Grid item sm={12}>
                        <pre className={"test-question-answer-code"}>
                            {`${data.codeData}`}
                        </pre>
                    </Grid> : null
                }
            </>
        )
    }

    /* Image view part */
    const ImageJsx = () => {
        return (
            <>
                { data.imageName !== "" && data.imageUrl ?
                    <Grid item sm={12}>
                        <figure className={"test-question-answer-image"}>
                            <img src={data.imageUrl} alt="question"/>
                        </figure>
                    </Grid> : null
                }
            </>
        )
    }

    return (
        <div className={`${classes.root} test-question-content`}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Animated animationIn="fadeInLeft" animationOut="fadeOutLeft" animationInDuration={1000} animationOutDuration={1000} isVisible={changeAnimation}>
                        <Paper className={`${classes.paper} ${classes.minHeight}`}>
                            {/* Question part */}
                            <TextField
                                id="test-question"
                                className={`${classes.bg} text-color-im`}
                                label={lang.question}
                                multiline
                                disabled
                                fullWidth
                                variant="outlined"
                                color="primary"
                                defaultValue={data.question}
                            />
                            {/* Code Part */}
                            <CodeJsx />
                            {/* Image Part */}
                            <ImageJsx />
                        </Paper>
                    </Animated>
                </Grid>
                <Grid item xs={6}>
                    <Animated animationIn="fadeInRight" animationOut="fadeOutRight" animationInDuration={1000} animationOutDuration={1000} isVisible={changeAnimation}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper className={`${classes.paper} ${classes.minHeight}`}>
                                    { data.optionsOrText ?
                                        /* Text answer part */
                                        <>
                                            <Grid item sm={12}>
                                                <span className={"test-question-answer-title"}>{lang.text_answer_title}</span>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <TextField
                                                    id="test-question"
                                                    className={`${classes.bg} text-color-im`}
                                                    label={lang.answer}
                                                    multiline
                                                    fullWidth
                                                    variant="outlined"
                                                    color="primary"
                                                    onChange={writeAnswer}
                                                    placeholder={lang.write_the_answer}
                                                    value={answerData.text}
                                                />
                                            </Grid>
                                        </>
                                        :
                                        /* Option answer part */
                                        <OptionsJsx />
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <div className={"test-question-answer-buttons"}>
                                        <Button variant="contained" onClick={()=>handlePutAside()} color="secondary">
                                            <LowPriority fontSize={"small"}/>&nbsp; {lang.put_aside}</Button>
                                        <Button variant="contained" color="primary" disabled={false}
                                            onClick={()=>handleSubmit()}>
                                            {lang.submit}&nbsp;<SendOutlined fontSize={"small"}/></Button>
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Animated>
                </Grid>
            </Grid>
        </div>
    )
}

export default QuestionContent