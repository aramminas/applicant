import React,{useState, useEffect} from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import {useToasts} from 'react-toast-notifications'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import {FormControl, FormHelperText, FormControlLabel, Switch, Radio, Checkbox, Button} from '@material-ui/core'
import {green, grey} from '@material-ui/core/colors'
import {RemoveCircleOutline, AddCircleOutline, PanoramaOutlined,
        Add, RotateLeft, NewReleasesOutlined} from '@material-ui/icons'
import {Animated} from "react-animated-css"
import './Steps.scss'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
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
    imageData: {
        selectedFile: null,
        file: null,
        name: null,
    },
    options: [],
    rightAnswers: [],
    multiAnswer: false,
    score: "",
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
    score: false,
    length: 4
}

const initOption = [0, 1, 2, 3]

export default function Quiz(props) {
    const classes = useStyles()
    const { addToast } = useToasts()
    const [quiz, setQuiz] = useState({...initQuiz})
    const [validation, setValidation] = useState(initValidation)
    const [optionsCount, setOptionsCount] = useState([...initOption])
    const [addReduce, setAddReduce] = useState('')
    const [refuse, setRefuse] = useState(false)

    useEffect(function () {
        setQuiz({ ...quiz, options: []})
    },[])

    const {lang, totalScore, quizzesCount, addQuizData, complete} = props

    const handleChangeAnswer = (event) => {
        if(quiz.multiAnswer === true){
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
        }else if(quiz.multiAnswer === false){
            // added value for a single answer (Radio)
            setQuiz({ ...quiz, rightAnswers: [+event.target.value]})
            setValidation({...validation,rightAnswer: true})
        }
    }

    const handleChange = (event) => {
        if(event.target.name === 'question'){
            setQuiz({...quiz,question:event.target.value})
            setValidation({...validation,question: !!!event.target.value?.trim()})
        }else if(event.target.name === 'score'){
            if(event.target.value >= 0 && event.target.value < 1001){
                setValidation({...validation, score: !!!event.target.value?.trim()})
                setQuiz({...quiz, score: event.target.value})
            }else {
                addToast(lang.score_warning, {
                    appearance: 'warning',
                    autoDismiss: true
                })
            }
        }else {
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

    const resetQuizData = (type= "reset") => {
        setQuiz({...initQuiz,options: []})
        setOptionsCount([...initOption])
        let message = type === "added" ? lang.test_is_added : lang.all_data_reset

        addToast(message, {
            appearance: 'success',
            autoDismiss: true
        })
    }

    const checkQuiz = () => {
        // Checking for a question
        let emptyQuestion = false, rightAnswer = false, ready = false, score = false,
            currentOption = false, errorOptions, checkAnswer, checkOption

        let scoreValue = Number(quiz.score)

        if(!quiz.question.trim()){
            emptyQuestion = true
        }

        if(scoreValue > 0 && scoreValue < 1001){
            score = true
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
        setValidation({...validation, question: emptyQuestion, options:errorOptions, rightAnswer, score: !score})
        // after checking the data, the function for adding a quiz is called
        if(emptyQuestion || !rightAnswer || checkOption || !score){
            ready = true
        }
        if(!ready){
            let createNewQuiz = {
                id: Date.now(),
                question: quiz.question,
                options:  quiz.options,
                codeData: quiz.codeData,
                imageUrl: quiz.imageUrl,
                multiAnswer: quiz.multiAnswer,
                rightAnswers: quiz.rightAnswers,
                imageData: quiz.imageData,
                score: quiz.score,
            }
            addQuizData(createNewQuiz)
            resetQuizData("added")
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
                    {lang.add_some_code}
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
                    {lang.add_some_image}
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
                            </div>
                            :
                            null
                        }
                    </Grid>
                </Grid>
            </div>
        )
    }

    return (
        <div className={classes.root}>
            <div className={"admin-quiz-container"}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {quizzesCount > 0 && <sub className={"admin-quiz-count"}>{lang.number_quizzes} - <span>{quizzesCount}</span></sub>}
                        <form className={classes.root} noValidate autoComplete="off">
                            <div>
                                <Grid container spacing={3}>
                                    <Grid item sm={11}>
                                        <Typography variant="h6" gutterBottom className={"text-left"}>
                                            {lang.enter_question}
                                        </Typography>
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
                                    </Grid>
                                    <Grid item sm={1}>
                                        <Typography variant="h6" gutterBottom className={"text-right"}>
                                            {lang.score}
                                        </Typography>
                                        <TextField
                                            id="quiz-score"
                                            label={lang.score}
                                            multiline
                                            variant="outlined"
                                            name={`score`}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            error={validation.score && true}
                                            value={quiz.score !== "" ? quiz.score : ""}
                                            aria-describedby={`quiz-score-helper-text`}
                                        />
                                        {validation.score &&
                                            <FormHelperText id={`score-helper-text`}>{lang.required}</FormHelperText>
                                        }
                                        {totalScore > 0 && <sub className={"admin-test-total-score"}>{lang.total_score} - <span>{totalScore}</span></sub>}
                                    </Grid>
                                </Grid>
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
                                    label={lang.add_code}
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
                                    label={lang.add_image}
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
                            <hr className={classes.hr}/>
                            <div className={"admin-quiz-buttons"}>
                                <Button variant="contained" onClick={resetQuizData} disabled={complete}>
                                    <RotateLeft fontSize={"small"}/>&nbsp;{lang.reset}</Button>
                                <Button variant="contained" color="primary" onClick={checkQuiz} disabled={complete}>
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