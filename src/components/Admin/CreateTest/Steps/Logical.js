import React, {useEffect, useState} from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import TextField from "@material-ui/core/TextField";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Radio,
    Switch
} from "@material-ui/core"
import {
    Add,
    NewReleasesOutlined,
    PanoramaOutlined,
    RotateLeft,
    ReportProblemOutlined
} from "@material-ui/icons"
import {Animated} from "react-animated-css"
import {useToasts} from "react-toast-notifications"
import {green, grey} from "@material-ui/core/colors"

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
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
    fileBtn: {
        height: '56px',
        width: '50%',
        color: '#757575',
        fontSize: '1rem',
        '&:hover': {
            backgroundColor: 'white',
            borderColor: 'black'
        }
    },
    fileInput: {
        display: 'none'
    },
    hr: {
        width: "70%"
    }
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

const initLogical = {
    id: null,
    question: "",
    imageUrl: "",
    imageData: {
        selectedFile: null,
        file: null,
        name: null,
    },
    image: {
        tag: false,
        animate: false
    },
    options: [],
    rightAnswers: [],
    optionsOrText: false,
}

const initValidation = {
    question: false,
    options: [],
    rightAnswer: true,
    length: 4
}

const optionsCount = [0, 1, 2, 3]

export default function Logical(props) {
    const classes = useStyles()
    const { addToast } = useToasts()
    const [logical, setLogical] = useState({...initLogical})
    const [validation, setValidation] = useState(initValidation)
    const {lang, logicalTestsCount, addLogicalData, complete} = props

    useEffect(function () {
        setLogical({ ...logical, options: []})
    },[])

    const handleChangeAnswer = (event) => {
        // added value for a single answer (Radio)
        setLogical({ ...logical, rightAnswers: [+event.target.value]})
        setValidation({...validation,rightAnswer: true})
    }

    const handleChange = (event) => {
        if(event.target.name === 'logical'){
            setLogical({...logical,question:event.target.value})
            setValidation({...validation,question: !!!event.target.value?.trim()})
        }else {
            logical.options[+event.target.name] = event.target.value
            setLogical({...logical,options:logical.options})
            validation.options[+event.target.name] = !!!event.target.value?.trim()
            setValidation({...validation,options: [...validation.options]})
        }
    }

    const handleChangeLogicalSettings = (event) => {
        let check = event.target.checked
        switch (event.target.name) {
            case "options-text" :
                setLogical({ ...logical, optionsOrText: event.target.checked, rightAnswers: []})
                break
            case "question-image" :
                check ?
                    setLogical({ ...logical, image: {tag: check, animate: check}})
                    :
                    setLogical({ ...logical, image: {tag: true, animate: check}})
                setTimeout(function () {
                    setLogical({ ...logical,imageData: {
                            selectedFile: null,
                            file: null,
                            name: null,
                        }, image: {tag: check, animate:check}})
                },500)
                break
            default:
                setLogical({ ...logical})
        }
    }

    const resetLogicalData = (type= "reset") => {
        setLogical({...initLogical,options: []})
        let message = type === "added" ? lang.test_is_added : lang.all_logical_data_reset

        addToast(message, {
            appearance: 'success',
            autoDismiss: true
        })
    }

    const setImage = e => {
        let file = e.target.files[0]
        const reader = new FileReader()
        if(file !== undefined &&
            (file.type === "image/jpeg" || file.type === "image/png" ||
                file.type === "image/jpg" || file.type === "image/gif")){
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                setLogical(logical => {
                    return {
                        ...logical, imageData: {
                            selectedFile: reader.result,
                            name: file.name,
                            file
                        },
                    }
                })
            }
        }else if(file !== undefined){
            addToast(lang.image_warning, {
                appearance: 'warning',
                autoDismiss: true
            })
        }
    }

    const checkLogicalTest = () => {
        // Checking for a question
        let emptyQuestion = false, rightAnswer = false, ready = false,
            currentOption = false, errorOptions, checkAnswer, checkOption

        if(!logical.question.trim()){
            emptyQuestion = true
        }

        // Checking for an options & right answers
        errorOptions = optionsCount.map(val => {
            // Checking for right answers
            checkAnswer = logical.rightAnswers[val]
            if(!logical.optionsOrText){
                if(!rightAnswer && checkAnswer !== undefined){
                    rightAnswer = true
                }
            }else{
                rightAnswer = true
            }
            // Checking for an options if selected
            if(!logical.optionsOrText){
                currentOption = logical.options[val]?.trim() === undefined || logical.options[val]?.trim() === ""
                if(!checkOption && currentOption === true){
                    checkOption = true
                }
            }

            return currentOption
        })

        if(rightAnswer === false && !logical.optionsOrText){
            addToast(lang.correct_answer, {
                appearance: 'warning',
                autoDismiss: true
            })
        }
        setValidation({...validation, question: emptyQuestion, options:errorOptions, rightAnswer})
        // after checking the data, the function for adding a logical test is called
        if(emptyQuestion || (!logical.optionsOrText && (!rightAnswer || checkOption))){
            ready = true
        }

        if(!ready){
            let createNewLogical = {
                id: Date.now(),
                question: logical.question,
                options:  logical.options,
                imageUrl: logical.imageUrl,
                optionsOrText: logical.optionsOrText,
                rightAnswers: logical.rightAnswers,
                imageData: logical.imageData,
            }
            addLogicalData(createNewLogical)
            resetLogicalData("added")
        }
    }

    // quiz image part
    const LogicalImage = () => {
        return (
            <div className={"admin-logical-image-part"}>
                <Typography variant="h6" gutterBottom className={"text-left"}>
                    {lang.add_some_image}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item sm={12} md={6} className={"admin-logical-image-input-part"}>
                        <Button variant="outlined" component="label" className={classes.fileBtn}>
                            <PanoramaOutlined htmlColor={"#797979"}/>&nbsp;
                            {lang.select_image}
                            <input
                                type="file"
                                name={"techImg"}
                                className={classes.fileInput}
                                onChange={(e)=>setImage(e)}
                            />
                        </Button>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        {logical.imageData.selectedFile ?
                            <div className={"logical-selected-image"}>
                                <Animated animationIn="zoomInLeft" animationOut="fadeOutDown" animationInDuration={1500} animationOutDuration={1500} isVisible={true}>
                                    <figure className={"selected-file"}>
                                        <img src={logical.imageData.selectedFile} alt="quiz"/>
                                    </figure>
                                </Animated>
                            </div>
                            :
                            null
                        }
                    </Grid>
                </Grid>
            </div>
        )
    }

    // options part
    const options = optionsCount.map(value => {
        return (
            <div className={`admin-logical-options`} key={value}>
                <Grid item xs={11}>
                    <FormControl  fullWidth>
                        <TextField
                            id={`logical-option-${value}`}
                            label={`Option ${value+1}`}
                            multiline
                            variant="outlined"
                            fullWidth
                            required
                            error={!!validation.options[value]}
                            onChange={handleChange}
                            name={`${value}`}
                            value={logical.options[value] !== undefined ? logical.options[value] : ""}
                            aria-describedby={`option-helper-text-${value}`}
                        />
                        {validation.options[value] &&
                        <FormHelperText id={`option-helper-text-${value}`}>{lang.required_field}</FormHelperText>
                        }
                    </FormControl>
                </Grid>
                <Grid item xs={1} className={classes.contentRadioCheckbox}>
                    <GreenRadio
                        className={classes.radioCheckbox}
                        checked={logical.rightAnswers.indexOf(value) !== -1}
                        onChange={handleChangeAnswer}
                        value={value}
                        name="radio-button-answer"
                        inputProps={{ 'aria-label': `answer-${value}` }}
                    />
                </Grid>
                {(!validation.rightAnswer && value === 0) &&
                <span className={"right-answer"}>
                    <NewReleasesOutlined htmlColor={"red"}/>
                </span>
                }
            </div>
        )
    })

    // text part
    const Text = () => {
        return (
            <>
                <Typography variant="h6" gutterBottom className={"text-left"}>
                    {lang.answer_field_title}&nbsp;
                    <span className={"admin-logical-text-warning"}>
                        (<ReportProblemOutlined htmlColor={"#ff9a00"} fontSize={"small"}/>{lang.answer_field_warning})
                    </span>
                </Typography>
                <TextField
                    id="logical-answer"
                    label={lang.answer_field_not_fill}
                    multiline
                    variant="outlined"
                    name={`logical`}
                    fullWidth
                />
            </>
        )
    }

    return (
        <div className={classes.root}>
            <div className={"admin-logical-container"}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {logicalTestsCount > 0 && <sub className={"admin-logical-count"}>{lang.number_logical} - <span>{logicalTestsCount}</span></sub>}
                        <Typography variant="h6" gutterBottom className={"text-left"}>
                            {lang.enter_logical_question}
                        </Typography>
                        <form className={classes.root} noValidate autoComplete="off">
                            <div>
                                <TextField
                                    id="logical-question"
                                    label={lang.logical_question}
                                    multiline
                                    variant="outlined"
                                    name={`logical`}
                                    onChange={handleChange}
                                    fullWidth
                                    autoFocus
                                    required
                                    error={validation.question && true}
                                    value={logical.question !== "" ? logical.question : ""}
                                    aria-describedby={`logical-question-helper-text`}
                                />
                                {validation.question &&
                                    <FormHelperText id={`logical-question-helper-text`}>{lang.required_field}</FormHelperText>
                                }
                            </div>
                            {/* Logical Image Part */}
                            { logical.image.tag ?
                                <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft"
                                          animationInDuration={1000} animationOutDuration={1000}
                                          isVisible={logical.image.animate}>
                                    { LogicalImage() }
                                </Animated>
                                : null }
                            {/* Logical Switch Settings Part */}
                            <div className={"text-left admin-multi-answer"}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={logical.optionsOrText}
                                            onChange={handleChangeLogicalSettings}
                                            name="options-text"
                                            color="primary"
                                        />
                                    }
                                    label={lang.text_or_options}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={logical.image.tag}
                                            onChange={handleChangeLogicalSettings}
                                            name="question-image"
                                            color="primary"
                                        />
                                    }
                                    label={lang.add_image}
                                />
                            </div>
                            <hr/>
                            {/* Type of answer to the question (in writing or with options) */}
                            {!logical.optionsOrText ?
                                options :
                                <Text />
                            }
                            <hr className={classes.hr}/>
                            <div className={"admin-logical-buttons"}>
                                <Button variant="contained" onClick={resetLogicalData} disabled={complete}>
                                    <RotateLeft fontSize={"small"}/>&nbsp;{lang.reset}</Button>
                                <Button variant="contained" color="primary" onClick={checkLogicalTest} disabled={complete}>
                                    <Add fontSize={"small"}/>&nbsp;{lang.add}</Button>
                            </div>
                            {complete ? <span className={"complete-wrapper"}>{lang.complete_wrapper}</span> : null}
                        </form>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}