import React, {useState} from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import {
    CheckCircleOutlineOutlined, DeleteForeverOutlined,
    DeleteOutline,
    LiveHelpOutlined,
    RadioButtonUncheckedOutlined,
    EditLocationOutlined,
    AddLocationOutlined,
} from "@material-ui/icons"
import {Animated} from "react-animated-css"
import Tooltip from "@material-ui/core/Tooltip"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import EditViewAddQuiz from "./EditViewAddQuiz"
import EditViewAddLogical from "./EditViewAddLogical"
import DeleteModal from "./DeleteModal"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paperRoot: {
        color: theme.palette.text.secondary,
        '& > div': {
            padding: theme.spacing(2),
        },
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    button: {
        margin: theme.spacing(1),
    },
    noMaxWidth: {
        maxWidth: 'none',
    },
    customWidth: {
        maxWidth: 'none!important',
        backgroundColor: 'transparent!important',
        '& figure img':{
            maxWidth: 300,
        },
        '& figure':{
            margin: '5px 0',
        }
    },
}))

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip)

const createTestList = (data, deleteTestById, showTestById, deleteClass, classes, lang, type) => {
    let indexQ = 1, indexL = 1
    return data.map((value) => {
        let index = value.type === "quiz" ? indexQ++ : indexL++
        return value.type === type ? (
            <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft" key={`question-${value.id}`}
                isVisible={deleteClass !== value.id}>
                <li className="table-row text-center">
                    <div className="col col-1-t text-left" data-label="Id">{index}</div>
                    <div className="col col-2-t" data-label={lang.question}>
                        <Tooltip title={value.question} placement="top-start" interactive>
                            <span>{value.question}</span>
                        </Tooltip>
                    </div>
                    <div className="col col-3-t" data-label={lang.code}>
                        { value.codeData ?
                            <HtmlTooltip
                                title={
                                    <pre>
                                    {value.codeData}
                                </pre>
                                }
                                classes={{ tooltip: classes.noMaxWidth }}
                            >
                                <Button className={classes.button}><CheckCircleOutlineOutlined htmlColor={"green"}/>{lang.yes}</Button>
                            </HtmlTooltip> :
                            <Button className={classes.button}><RadioButtonUncheckedOutlined htmlColor={"gold"}/>{lang.no}</Button>
                        }
                    </div>
                    <div className="col col-4-t" data-label={lang.image}>
                        { value.imageUrl ?
                            <HtmlTooltip
                                title={
                                    <figure className={"view-selected-file"}>
                                        <img src={value.imageUrl} alt="question"/>
                                    </figure>
                                }
                                classes={{ tooltip: classes.customWidth}}
                            >
                                <Button className={classes.button}><CheckCircleOutlineOutlined htmlColor={"green"}/>{lang.yes}</Button>
                            </HtmlTooltip> :
                            <Button className={classes.button}><RadioButtonUncheckedOutlined htmlColor={"gold"}/>{lang.no}</Button>
                        }
                    </div>
                    <div className="col col-5-t" data-label={lang.score}>{value.score}</div>
                    <div className="col col-6-t" data-label={lang.edit}>
                        <IconButton onClick={()=>showTestById(type, value.id)}>
                            <EditLocationOutlined className={"edit-icon"} htmlColor={"#343a40"}/>
                        </IconButton>
                    </div>
                    <div className="col col-7-t" data-label={lang.remove}>
                        <IconButton onClick={()=>deleteTestById(type, value.id)}>
                            <DeleteForeverOutlined className={"delete-icon"} htmlColor={"#343a40"}/>
                        </IconButton>
                    </div>
                </li>
            </Animated>
        ) : null
    })
}

export default function EditViewTests(props) {
    const classes = useStyles()
    const [deleteClass,setDeleteClass] = useState(0)
    const [openDel, setOpenDel] = useState(false)
    const [delId, setDelId] = useState(0)
    const [openQuiz, setOpenQuiz] = useState(false)
    const [openLogical, setOpenLogical] = useState(false)
    const [changingQuestion, setChangingQuestion] = useState({})
    const {lang, questions, totalScore, deleteQuestion, handleAddEditQuestion} = props
    const quizType = 'quiz', logicalType = 'logical'
    let num = questions.length

    const deleteTestById = (type, id) => {
        setDelId(id)
        setOpenDel(true)
    }

    const handleCloseDeleteModal = () => {
        setOpenDel(false)
        setDelId(0)
    }

    const handleDeleteQuestion = (id) => {
        setDeleteClass(id)
        setOpenDel(false)
        setTimeout(function () {
            setDelId(0)
            deleteQuestion(id)
        },1000)
    }

    const showTestById = (type, id) => {
        const getQuestion = questions.filter(el => el.id === id)[0]
        if(getQuestion){
            setChangingQuestion({...getQuestion})
        }
        if(type === quizType){
            setOpenQuiz(true)
        }else if(type === logicalType){
            setOpenLogical(true)
        }
    }

    const cancelEditQuestion = (type) => {
        setChangingQuestion({})
        if(type === quizType){
            setOpenQuiz(false)
        }else if(type === logicalType){
            setOpenLogical(false)
        }
    }

    const addNewQuestion = (type) => {
        if(type === quizType){
            setOpenQuiz(true)
        }else if(type === logicalType){
            setOpenLogical(true)
        }
    }

    /* Questions list part */
    const quizTestsList = questions.length > 0 ?
        createTestList(questions, deleteTestById, showTestById, deleteClass, classes, lang, quizType)
            .filter(el => el != null) : null

    const logicalTestList = questions.length > 0 ?
        createTestList(questions, deleteTestById, showTestById, deleteClass, classes, lang, logicalType)
            .filter(el => el != null) : null

    let editTitle = !openQuiz && !openLogical ? lang.test_questions_list
                        : openQuiz ? lang.test_quiz_questions
                            : openLogical && lang.test_logical_questions

    return (
        <div className={`${classes.paper} edit-view-tests-content`}>
            <Paper className={`${classes.paperRoot} hover-effect`}>
                <div className={"edit-view-header"}>
                    <LiveHelpOutlined />&nbsp;{editTitle}
                </div>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {!openQuiz && !openLogical ?
                            <Paper className={classes.paper}>
                                <div className="edit-view-question-table">
                                    <h2>{lang.all_questions} {num !== 0 &&
                                    <small>{lang.total_number_tests} {`{${num}}`}</small>}</h2>
                                    <ul className="ul-table">
                                        <li className="table-header text-center">
                                            <div className="col col-1-t text-left">&#8470;</div>
                                            <div className="col col-2-t ">{lang.question}</div>
                                            <div className="col col-3-t ">{lang.code}</div>
                                            <div className="col col-4-t ">{lang.image}</div>
                                            <div className="col col-5-t ">{lang.score}</div>
                                            <div className="col col-6-t ">{lang.edit}</div>
                                            <div className="col col-7-t ">{lang.remove}</div>
                                        </li>
                                        <h5>
                                            {lang.quizzes}
                                            <span onClick={() => addNewQuestion(quizType)}>
                                                {lang.add_new} <AddLocationOutlined/>
                                            </span>
                                        </h5>
                                        {/* all quizzes list */}
                                        {quizTestsList.length > 0 ?
                                            quizTestsList :
                                            <><DeleteOutline/>{lang.no_added_tests}<br/></>
                                        }
                                        <h5>
                                            {lang.logical_tests}
                                            <span onClick={() => addNewQuestion(logicalType)}>
                                                {lang.add_new} <AddLocationOutlined/>
                                            </span>
                                        </h5>
                                        {/* all logical tests list*/}
                                        {logicalTestList.length > 0 ?
                                            logicalTestList :
                                            <><DeleteOutline/>{lang.no_added_tests}</>
                                        }
                                        <h5>
                                            {lang.total_score} - {totalScore}
                                        </h5>
                                    </ul>
                                </div>
                            </Paper>
                            :
                            openQuiz ?
                                <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft" isVisible={openQuiz}>
                                    <EditViewAddQuiz lang={lang} changingQuestion={changingQuestion}
                                        handleAddEditQuestion={handleAddEditQuestion}
                                        cancelEditQuestion={cancelEditQuestion}
                                    />
                                </Animated>
                                :
                                openLogical &&
                                    <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft" isVisible={openLogical}>
                                        <EditViewAddLogical lang={lang} changingQuestion={changingQuestion}
                                            handleAddEditQuestion={handleAddEditQuestion}
                                            cancelEditQuestion={cancelEditQuestion}
                                        />
                                    </Animated>
                        }
                    </Grid>
                </Grid>
            </Paper>
            {/* Modal window for deleting question */}
            <DeleteModal open={openDel} id={delId} lang={lang} handleDeleteQuestion={handleDeleteQuestion}
                handleClose={handleCloseDeleteModal}/>
        </div>
    )
}