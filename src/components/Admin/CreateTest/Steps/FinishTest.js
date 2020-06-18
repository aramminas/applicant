import React,{useState} from 'react'
import {
    DeleteForeverOutlined,
    CheckCircleOutlineOutlined,
    RadioButtonUncheckedOutlined,
    DeleteOutline
} from '@material-ui/icons'
import {withStyles, makeStyles} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import {Animated} from "react-animated-css"

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip)

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    noMaxWidth: {
        maxWidth: 'none',
    },
    customWidth: {
        maxWidth: 'none',
        backgroundColor: 'transparent',
        '& figure img':{
            maxWidth: 300,
        },
        '& figure':{
            margin: '5px 0',
        }
    }
}))

const createTestList = (data, deleteTestById, deleteClass, classes, lang, type) => {

    return data.map((value, index) => {

        return (
            <Animated animationIn="bounceInLeft" animationOut="bounceOutLeft" key={`quiz-${value.id}`}
                      isVisible={deleteClass !== value.id}>
                <li className="table-row">
                    <div className="col col-1-t" data-label="Id">{index + 1}</div>
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
                        { value.imageData.selectedFile ?
                            <HtmlTooltip
                                title={
                                    <figure className={"view-selected-file"}>
                                        <img src={value.imageData.selectedFile} alt="quiz"/>
                                    </figure>
                                }
                                classes={{ tooltip: classes.customWidth }}
                            >
                                <Button className={classes.button}><CheckCircleOutlineOutlined htmlColor={"green"}/>{lang.yes}</Button>
                            </HtmlTooltip> :
                            <Button className={classes.button}><RadioButtonUncheckedOutlined htmlColor={"gold"}/>{lang.no}</Button>
                        }
                    </div>
                    <div className="col col-5-t" data-label={lang.score}>{value.score}</div>
                    <div className="col col-6-t" data-label={lang.remove}>
                        <IconButton onClick={()=>deleteTestById(type, value.id)}>
                            <DeleteForeverOutlined className={"delete-icon"} htmlColor={"#343a40"}/>
                        </IconButton>
                    </div>
                </li>
            </Animated>
        )
    })
}

export default function FinishTest(props) {
    const classes = useStyles()
    const [deleteClass,setDeleteClass] = useState(0)
    const {lang, totalScore, testData, deleteTest} = props
    const quizType = 'quiz', logicalType = 'logical'

    const deleteTestById = (type, id) =>{
        setDeleteClass(id)
        setTimeout(function () {
            deleteTest(type, id)
        },1000)
    }

    const quizTestsList = testData.quizzes.length > 0 ?
        createTestList(testData.quizzes, deleteTestById, deleteClass, classes, lang, quizType) : null

    const logicalTestList = testData.logicalTests.length > 0 ?
        createTestList(testData.logicalTests, deleteTestById, deleteClass, classes, lang, logicalType) : null

    return (
        <div className={"admin-finish-test-container"}>
            <hr/>
            {
                testData.quizzes.length === 0 && testData.logicalTests.length === 0 ?
                    <div className={"admin-empty-test-data"}>
                        <DeleteOutline />{lang.empty_data}
                    </div> :
                    <div className="finish-test-container">
                        <h2>{lang.all_tests} <small>{lang.final_stage}</small></h2>
                        <ul className="ul-table">
                            <li className="table-header">
                                <div className="col col-1-t">&#8470;</div>
                                <div className="col col-2-t text-center">{lang.question}</div>
                                <div className="col col-3-t text-center">{lang.code}</div>
                                <div className="col col-4-t text-center">{lang.image}</div>
                                <div className="col col-5-t">{lang.score}</div>
                                <div className="col col-6-t">{lang.remove}</div>
                            </li>
                            <h5>
                                {lang.quizzes}
                            </h5>
                            {/* all quizzes list*/}
                            {testData.quizzes.length > 0 ?
                                quizTestsList :
                                <><DeleteOutline />{lang.no_added_tests}<br/></>
                            }
                            <h5>
                                {lang.logical_tests}
                            </h5>
                            {/* all logical tests list*/}
                            {testData.logicalTests.length > 0 ?
                                logicalTestList :
                                <><DeleteOutline />{lang.no_added_tests}</>
                            }
                            <h5>
                                {lang.total_score} - {totalScore}
                            </h5>
                        </ul>
                    </div>
            }
            <hr/>
        </div>
    )
}