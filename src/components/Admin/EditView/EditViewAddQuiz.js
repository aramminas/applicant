import React, {useState, useEffect} from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import {useToasts} from 'react-toast-notifications'
import {
    Grid,
    Button,
    Typography,
    FormHelperText,
    FormControlLabel,
    Switch,
    FormControl,
    Radio, Checkbox
} from '@material-ui/core'
import {
    AddCircleOutline,
    AddLocationOutlined,
    EditLocationOutlined,
    NewReleasesOutlined,
    PanoramaOutlined,
    RemoveCircleOutline,
} from "@material-ui/icons"
import TextField from "@material-ui/core/TextField"
import {Animated} from "react-animated-css"
import "../CreateTest/Steps/Steps.scss"
import {green, grey} from "@material-ui/core/colors"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    formRoot: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
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

const GreenCheckbox = withStyles({
    root: {
        color: grey[500],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />)

const initQuiz = {
    id: null,
    question: "",
    codeData: "",
    imageUrl: "",
    currentImageName: "",
    imageData: {
        selectedFile: null,
        file: null,
        name: null,
    },
    options: [],
    rightAnswers: [],
    multiAnswer: false,
    code: {
        tag: false,
        animate: false
    },
    image: {
        tag: false,
        animate: false
    },
}

const initValidation = {
    question: false,
    options: [],
    rightAnswer: true,
    length: 4
}

const initOption = [0, 1, 2, 3]

export default function EditViewAddQuiz(props) {
    const classes = useStyles()
    const { addToast } = useToasts()
    const [quiz, setQuiz] = useState({...initQuiz, options: []})
    const [validation, setValidation] = useState(initValidation)
    const [optionsCount, setOptionsCount] = useState([...initOption])
    const [addReduce, setAddReduce] = useState('')
    const [refuse, setRefuse] = useState(false)
    const {lang, changingQuestion, handleAddEditQuestion, cancelEditQuestion} = props

    useEffect(function () {
        if(Object.keys(changingQuestion).length > 0){
            const optionsNum = changingQuestion.options.length
            if(optionsNum > 4){
                for (let i = 4; i < optionsNum; i++){
                    addOption()
                }
            }
            setQuiz({...quiz,
                id: changingQuestion.id,
                question: changingQuestion.question,
                codeData: changingQuestion.codeData ? changingQuestion.codeData : "",
                imageUrl: changingQuestion.imageUrl ? changingQuestion.imageUrl : "",
                currentImageName: changingQuestion.imageName ? changingQuestion.imageName : "",
                options: optionsNum > 0 ? [...changingQuestion.options] : [],
                rightAnswers: changingQuestion.rightAnswers.length ? [...changingQuestion.rightAnswers] : [],
                multiAnswer: changingQuestion.multiAnswer,
                code: {
                    tag: !!changingQuestion.codeData,
                    animate: !!changingQuestion.codeData,
                },
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
        if(quiz.multiAnswer){
            // added value for multi answers (Checkbox)
            if(event.target.checked){
                quiz.rightAnswers.push(+event.target.name)
            }else{
                const index = quiz.rightAnswers.indexOf(+event.target.name)
                if (index > -1) {
                    quiz.rightAnswers.splice(index, 1)
                }
            }
            setQuiz({ ...quiz, rightAnswers: [...quiz.rightAnswers] })
            setValidation({...validation,rightAnswer: true})
        }else if(!quiz.multiAnswer){
            // added value for a single answer (Radio)
            setQuiz({ ...quiz, rightAnswers: [+event.target.value]})
            setValidation({...validation,rightAnswer: true})
        }
    }

    const handleChange = (event) => {
        if(event.target.name === 'question'){
            setQuiz({...quiz,question:event.target.value})
            setValidation({...validation,question: !!!event.target.value?.trim()})
        }else{
            quiz.options[+event.target.name] = event.target.value
            setQuiz({...quiz,options:quiz.options})
            validation.options[+event.target.name] = !!!event.target.value?.trim()
            setValidation({...validation,options: [...validation.options]})
        }
    }

    const handleChangeQuizSettings = (event) => {
        let check = event.target.checked
        switch (event.target.name) {
            case "multi-answer" :
                setQuiz({ ...quiz, multiAnswer: event.target.checked, rightAnswers: []})
                break
            case "question-code" :
                check ?
                    setQuiz({ ...quiz, code: {tag: check, animate: check}})
                    :
                    setQuiz({ ...quiz, code: {tag: true, animate: check}})
                setTimeout(function () {
                    setQuiz({ ...quiz,codeData: "", code: {tag: check, animate:check}})
                },500)
                break
            case "question-image" :
                check ?
                    setQuiz({ ...quiz, image: {tag: check, animate: check}})
                    :
                    setQuiz({ ...quiz, image: {tag: true, animate: check}})
                setTimeout(function () {
                    setQuiz({ ...quiz,imageData: {
                            selectedFile: null,
                            file: null,
                            name: null,
                        }, image: {tag: check, animate:check}})
                },500)
                break
            default:
                setQuiz({ ...quiz})
        }
    }

    const handleChangeCode = (event) => {
        setQuiz({...quiz,codeData: event.target.value})
    }

    const addOption = () => {
        setAddReduce('admin-quiz-options-add')
        setOptionsCount(optionsCount => {
            optionsCount.push(optionsCount.length)
            return [...optionsCount]
        })
        setValidation({...validation,length: optionsCount.length})
    }

    const reduceOptions = () => {
        setAddReduce('admin-quiz-options-reduce')
        if(!refuse){
            setRefuse(true)
            setTimeout(function () {
                if(quiz.multiAnswer && quiz.options.length === optionsCount.length){
                    setQuiz({...quiz, options: [...quiz.options.slice(0, -1)], rightAnswers: []})
                }else if(quiz.options.length === optionsCount.length){
                    setQuiz({...quiz, options: [...quiz.options.slice(0, -1)]})
                }
                setAddReduce('')
                setOptionsCount(optionsCount => {
                    optionsCount.pop()
                    return [...optionsCount]
                })
                setValidation({...validation,length: optionsCount.length})
                setRefuse(false)
            },1000)
        }
    }

    const setImage = e => {
        let file = e.target.files[0]
        const reader = new FileReader()
        if(file !== undefined &&
            (file.type === "image/jpeg" || file.type === "image/png" ||
                file.type === "image/jpg" || file.type === "image/gif")){
            reader.readAsDataURL(file)
            reader.onloadend = (e) => {
                setQuiz(quiz => {
                    return {
                        ...quiz, imageData: {
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

    const checkQuiz = (action) => {
        // Checking for a question
        let emptyQuestion = false, rightAnswer = false, ready = false,
            currentOption = false, errorOptions, checkAnswer, checkOption

        if(!quiz.question.trim()){
            emptyQuestion = true
        }
        // Checking for an options & right answers
        errorOptions = optionsCount.map(val => {
            // Checking for right answers
            checkAnswer = quiz.rightAnswers[val]
            if(!rightAnswer && checkAnswer !== undefined){
                rightAnswer = true
            }
            // Checking for an options
            currentOption = quiz.options[val]?.trim() === undefined || quiz.options[val]?.trim() === ""
            if(!checkOption && currentOption === true){
                checkOption = true
            }
            return currentOption
        })
        if(rightAnswer === false){
            addToast(lang.correct_answer, {
                appearance: 'warning',
                autoDismiss: true
            })
        }
        setValidation({...validation, question: emptyQuestion, options:errorOptions, rightAnswer})
        // after checking the data, the function for adding a quiz is called
        if(emptyQuestion || !rightAnswer || checkOption){
            ready = true
        }
        if(!ready){
            let addUpdateQuiz = {
                id: action === "add" ? Date.now() : quiz.id,
                question: quiz.question,
                options:  quiz.options,
                codeData: quiz.codeData,
                imageUrl: quiz.imageUrl,
                image: quiz.image.tag,
                currentImageName: quiz.currentImageName,
                multiAnswer: quiz.multiAnswer,
                rightAnswers: [...quiz.rightAnswers],
                imageData: quiz.imageData,
                type: "quiz",
            }
            handleAddEditQuestion(action, addUpdateQuiz)
            cancelEditQuestion("quiz")
        }
    }

    // options part
    const options = optionsCount.map(value => {
        return (
            <div className={`admin-quiz-options ${(value === optionsCount.length - 1 && value !== 3) ? addReduce : ""}` } key={value}>
                <Grid item xs={11}>
                    <FormControl  fullWidth>
                        <TextField
                            id={`quiz-option-${value}`}
                            label={`Option ${value+1}`}
                            multiline
                            variant="outlined"
                            fullWidth
                            required
                            error={!!validation.options[value]}
                            onChange={handleChange}
                            name={`${value}`}
                            value={quiz.options[value] !== undefined ? quiz.options[value] : ""}
                            aria-describedby={`option-helper-text-${value}`}
                        />
                        {validation.options[value] &&
                            <FormHelperText id={`option-helper-text-${value}`}>{lang.required_field}</FormHelperText>
                        }
                    </FormControl>
                </Grid>
                {quiz.multiAnswer ?
                    <Grid item xs={1} className={classes.contentRadioCheckbox}>
                        <FormControlLabel
                            className={classes.radioCheckbox}
                            control={<GreenCheckbox checked={quiz.rightAnswers.indexOf(value) !== -1}
                            onChange={handleChangeAnswer} name={`${value}`}/>}
                            label={null}/>
                    </Grid> :
                    <Grid item xs={1} className={classes.contentRadioCheckbox}>
                        <GreenRadio
                            className={classes.radioCheckbox}
                            checked={quiz.rightAnswers.indexOf(value) !== -1}
                            onChange={handleChangeAnswer}
                            value={value}
                            name="radio-button-answer"
                            inputProps={{ 'aria-label': `answer-${value}` }}
                        />
                    </Grid>
                }
                {(!validation.rightAnswer && value === 0) &&
                    <span className={"right-answer"}>
                        <NewReleasesOutlined fontSize={"small"} htmlColor={"red"}/>
                    </span>
                }
            </div>
        )
    })

    // quiz code part
    const CodePart = () => {
        return (
            <div className={"admin-quiz-code-part"}>
                <Typography variant="h6" gutterBottom className={"text-left"}>
                    {lang.add_edit_code}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item sm={12} md={6}>
                        <FormControl fullWidth>
                            <TextField
                                id={`admin-quiz-code-part`}
                                label={lang.add_code_label}
                                multiline
                                variant="outlined"
                                fullWidth
                                value={quiz.codeData !== "" ? quiz.codeData : ""}
                                onChange={handleChangeCode}
                                name={`admin-quiz-code`}/>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <pre>
                            {`${quiz.codeData}`}
                        </pre>
                    </Grid>
                </Grid>
            </div>
        )
    }

    // quiz image part
    const QuizImage = () => {
        return (
            <div className={"admin-quiz-image-part"}>
                <Typography variant="h6" gutterBottom className={"text-left"}>
                    {lang.add_edit_image}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item sm={12} md={6} className={"admin-quiz-image-input-part"}>
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
                        {quiz.imageData.selectedFile ?
                            <div className={"quiz-selected-image"}>
                                <Animated animationIn="zoomInLeft" animationOut="fadeOutDown" animationInDuration={1500} animationOutDuration={1500} isVisible={true}>
                                    <figure className={"selected-file"}>
                                        <img src={quiz.imageData.selectedFile} alt="quiz"/>
                                    </figure>
                                </Animated>
                            </div> : null
                        }
                    </Grid>
                </Grid>
            </div>
        )
    }

    return (
        <div className={`${classes.root} admin-edit-question`}>
            <Grid container spacing={3}>
                <div className={"admin-edit-view-add-title"}>
                    <h2>{lang.quiz_question}</h2>
                </div>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom className={"text-left"}>
                        {lang.add_edit_quiz_question}
                    </Typography>
                    <form className={classes.root} noValidate autoComplete="off">
                        <div>
                            <TextField
                                id="quiz-question"
                                label={lang.quiz_question}
                                multiline
                                variant="outlined"
                                name={`question`}
                                onChange={handleChange}
                                fullWidth
                                autoFocus
                                required
                                error={validation.question && true}
                                value={quiz.question !== "" ? quiz.question : ""}
                                aria-describedby={`quiz-question-helper-text`}
                            />
                            {validation.question &&
                                <FormHelperText id={`quiz-question-helper-text`}>{lang.required_field}</FormHelperText>
                            }
                        </div>
                        {/* Quiz Code Part */}
                        { quiz.code.tag ?
                            <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft"
                                      animationInDuration={1000} animationOutDuration={1000}
                                      isVisible={quiz.code.animate}>
                                { CodePart() }
                            </Animated>
                            :  null }
                        {/* Quiz Image Part */}
                        { quiz.image.tag ?
                            <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft"
                                      animationInDuration={1000} animationOutDuration={1000}
                                      isVisible={quiz.image.animate}>
                                { QuizImage() }
                            </Animated>
                            : null }
                        {/* Quiz Switch Settings Part */}
                        <div className={"text-left admin-quiz-settings"}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={quiz.multiAnswer}
                                        onChange={handleChangeQuizSettings}
                                        name="multi-answer"
                                        color="primary"
                                    />
                                }
                                label={lang.multi_answer}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={quiz.code.tag}
                                        onChange={handleChangeQuizSettings}
                                        name="question-code"
                                        color="primary"
                                    />
                                }
                                label={lang.add_edit_code}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={quiz.image.tag}
                                        onChange={handleChangeQuizSettings}
                                        name="question-image"
                                        color="primary"
                                    />
                                }
                                label={lang.add_edit_image}
                            />
                            <br/>
                            {/* Quiz Add Reduce Options Part */}
                            { optionsCount.length < 10 &&
                            <span className={`add-remove-options`} onClick={addOption}>
                                <AddCircleOutline/>&nbsp;{lang.add_more_options}
                            </span>
                            }
                            { optionsCount.length > 4 &&
                            <span className={`add-remove-options`} onClick={reduceOptions}>
                                <RemoveCircleOutline/>&nbsp;{lang.reduce_options}
                            </span>
                            }
                        </div>
                        <hr/>
                        {options}
                    </form>
                </Grid>
                <Grid container justify="center">
                    <Grid item xs={10}>
                        <hr/>
                    </Grid>
                    <Grid item xs={4}>
                        <div className={"admin-edit-view-add-btn"}>
                            <Button variant="outlined" onClick={()=>cancelEditQuestion("quiz")}>{lang.cancel}</Button>
                            {Object.keys(changingQuestion).length > 0 ?
                                <Button variant="outlined" color="primary" onClick={()=>checkQuiz("edit")}>
                                    {lang.edit} <EditLocationOutlined />
                                </Button> :
                                <Button variant="outlined" color="primary" onClick={()=>checkQuiz("add")}>
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
