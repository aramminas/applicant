import React, {useState, useEffect} from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import {Grid, Button, Typography, FormHelperText, FormControlLabel, Switch, FormControl, Radio} from '@material-ui/core'
import {green, grey} from "@material-ui/core/colors"
import TextField from "@material-ui/core/TextField"
import {
    AddLocationOutlined, EditLocationOutlined, NewReleasesOutlined, PanoramaOutlined, ReportProblemOutlined,
} from "@material-ui/icons"
import {Animated} from "react-animated-css"
import {useToasts} from "react-toast-notifications"

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
    score: "",
    currentScore: "",
    options: [],
    rightAnswers: [],
    optionsOrText: false,
}

const initValidation = {
    question: false,
    options: [],
    rightAnswer: true,
    score: false,
    length: 4
}

const optionsCount = [0, 1, 2, 3]

export default function EditViewAddLogical(props) {
    const classes = useStyles()
    const { addToast } = useToasts()
    const [logical, setLogical] = useState({...initLogical, options: []})
    const [validation, setValidation] = useState(initValidation)
    const {lang, changingQuestion, handleAddEditQuestion, cancelEditQuestion} = props

    useEffect(function () {
        if(Object.keys(changingQuestion).length > 0){
            setLogical({...logical,
                id: changingQuestion.id,
                question: changingQuestion.question,
                imageUrl: changingQuestion.imageUrl ? changingQuestion.imageUrl : "",
                currentImageName: changingQuestion.imageName ? changingQuestion.imageName : "",
                options: changingQuestion.options && changingQuestion.options.length > 0 ?
                            [...changingQuestion.options] : [],
                rightAnswers: changingQuestion.rightAnswers && changingQuestion.rightAnswers.length ?
                                [...changingQuestion.rightAnswers] : [],
                optionsOrText: changingQuestion.optionsOrText,
                score: changingQuestion.score,
                currentScore: changingQuestion.score,
                image: {
                    tag: !!changingQuestion.imageUrl,
                    animate: !!changingQuestion.imageUrl,
                },
                imageData: {
                    selectedFile: changingQuestion.imageUrl ? changingQuestion.imageUrl : null,
                    file: null,
                    name: changingQuestion.imageName ? changingQuestion.imageName : null,
                }
            })
        }
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
        }else if(event.target.name === 'score'){
            if(event.target.value >= 0 && event.target.value < 1001){
                setValidation({...validation, score: !!!event.target.value?.trim()})
                setLogical({...logical, score: event.target.value})
            }else {
                addToast(lang.score_warning, {
                    appearance: 'warning',
                    autoDismiss: true
                })
            }
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
                setLogical({ ...logical, optionsOrText: event.target.checked, rightAnswers: [], options: []})
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

    const setImage = (e) => {
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

    const checkLogicalTest = (action) => {
        // Checking for a question
        let emptyQuestion = false, rightAnswer = false, ready = false, score = false,
            currentOption = false, errorOptions, checkAnswer, checkOption

        let scoreValue = Number(logical.score)

        if(!logical.question.trim()){
            emptyQuestion = true
        }

        if(scoreValue > 0 && scoreValue < 1001){
            score = true
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

        setValidation({...validation, question: emptyQuestion, options:errorOptions, rightAnswer, score: !score})

        // after checking the data, the function for adding a logical test is called
        if(emptyQuestion || !score || (!logical.optionsOrText && (!rightAnswer || checkOption))){
            ready = true
        }

        if(!ready){
            let addUpdateLogical = {
                id: action === "add" ? Date.now() : logical.id,
                question: logical.question,
                options:  logical.options,
                imageUrl: logical.imageUrl,
                image: logical.image.tag,
                currentImageName: logical.currentImageName,
                optionsOrText: logical.optionsOrText,
                rightAnswers: logical.rightAnswers,
                imageData: logical.imageData,
                score: Number(logical.score),
                currentScore: Number(logical.currentScore),
                type: "logical",
            }
            handleAddEditQuestion(action, addUpdateLogical)
            cancelEditQuestion("logical")
        }
    }

    // quiz image part
    const LogicalImage = () => {
        return (
            <div className={"admin-logical-image-part"}>
                <Typography variant="h6" gutterBottom className={"text-left"}>
                    {lang.add_edit_image}
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
                            </div> : null
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
        <div className={`${classes.root} admin-edit-question`}>
            <Grid container spacing={3}>
                <div className={"admin-edit-view-add-title"}>
                    <h2>{lang.logical_question}</h2>
                </div>
                <Grid item xs={12}>
                    <form className={classes.root} noValidate autoComplete="off">
                        <div>
                            <Grid container spacing={3}>
                                <Grid item sm={11}>
                                    <Typography variant="h6" gutterBottom className={"text-left"}>
                                        {lang.add_edit_logical_question}
                                    </Typography>
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
                                </Grid>
                                <Grid item sm={1}>
                                    <Typography variant="h6" gutterBottom className={"text-right"}>
                                        {lang.score}
                                    </Typography>
                                    <TextField
                                        id="logical-score"
                                        label={lang.score}
                                        multiline
                                        variant="outlined"
                                        name={`score`}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        error={validation.score && true}
                                        value={logical.score !== "" ? logical.score : ""}
                                        aria-describedby={`logical-score-helper-text`}
                                    />
                                    {validation.score &&
                                        <FormHelperText id={`score-helper-text`}>{lang.required}</FormHelperText>
                                    }
                                </Grid>
                            </Grid>
                        </div>
                        {/* Logical Image Part */}
                        { logical.image.tag ?
                            <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft" animationInDuration={1000}
                                animationOutDuration={1000} isVisible={logical.image.animate}>
                                { LogicalImage() }
                            </Animated> : null
                        }
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
                                label={lang.add_edit_image}
                            />
                        </div>
                        <hr/>
                        {/* Type of answer to the question (in writing or with options) */}
                        {!logical.optionsOrText ?
                            options :
                            <Text />
                        }
                    </form>
                </Grid>
                <Grid container justify="center">
                    <Grid item xs={10}>
                        <hr/>
                    </Grid>
                    <Grid item xs={4}>
                        <div className={"admin-edit-view-add-btn"}>
                            <Button variant="outlined" onClick={()=>cancelEditQuestion("logical")} >{lang.cancel}</Button>
                            {Object.keys(changingQuestion).length > 0 ?
                                <Button variant="outlined" color="primary" onClick={()=>checkLogicalTest("edit")}>
                                    {lang.edit} <EditLocationOutlined />
                                </Button>:
                                <Button variant="outlined" color="primary" onClick={()=>checkLogicalTest("add")}>
                                    {lang.add} <AddLocationOutlined/>
                                </Button>
                            }
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}