import React, {useState, useEffect} from 'react'
import Main from "../Main"
import {useSelector} from "react-redux"
import {useParams} from "react-router-dom"
import {useToasts} from "react-toast-notifications"
import {EditLocationRounded, ReportProblemOutlined} from '@material-ui/icons'
import FirebaseFunctions from "../../../helpers/FirebaseFunctions"
import { makeStyles } from '@material-ui/core/styles'
import EditViewParameters from "./EditViewParameters"
import EditViewTests from "./EditViewTests"
import lang_en from '../../../lang/en/main.json'
import lang_am from '../../../lang/am/main.json'
import '../Admin.scss'
import './EditView.scss'
import Loader from "react-loader-spinner";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    content: {
        color: 'rgba(0, 0, 0, 0.54)',
        backgroundColor: '#fff',
        padding: 16,
        margin: 12,
        borderRadius: 8,
        boxShadow: '0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px 0px rgba(0,0,0,0.14), 0 1px 3px 0px rgba(0,0,0,0.12)',
    }
}))

const EditView = () => {
    const {addToast} = useToasts()
    const {language} = useSelector(state => state.language)
    const classes = useStyles()
    const [test, setTest] = useState({})
    const [tech, setTech] = useState({})
    const [addLoader,setAddLoader] = useState(false)
    const [currentTech, setCurrentTech] = useState({})
    let {id} = useParams()
    let lang = language === 'EN' ? lang_en : lang_am
    useEffect(function () {
        getTestData()
    },[])

    const changeLoader = (data) => {
        setAddLoader(data)
    }

    const getTestData = () => {
        FirebaseFunctions.getTestDataById(id).then(data => {
            if(Object.keys(data).length !== 0){
                FirebaseFunctions.getTechData().then(tech => {
                    setTest(data)
                    if(Object.keys(tech).length !== 0){
                        setTech(tech)
                        setCurrentTech(tech[data.parameters.technologyId])
                    }else{
                        setTest({empty: true})
                        setCurrentTech({empty: true})
                    }
                }).catch(error => {
                    setTech({empty: true})
                    addToast(error.message, {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                })
            }
        }).catch(error => {
            setTest({empty: true})
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true,
            })
        })
    }

    const deleteQuestion = (delId) => {
        FirebaseFunctions.removeTestQuestion(delId,test).then(data => {
            if(data.message === true){
                addToast(lang.edit_success_message, {
                    appearance: 'success',
                    autoDismiss: true,
                })
                getTestData()
            }else {
                addToast(data.message, {
                    appearance: 'error',
                    autoDismiss: true,
                })
            }
        }).catch(error => {
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true,
            })
        })
    }

    const handleAddEditQuestion = (type, editQuestion = []) => {
        changeLoader(true)
        FirebaseFunctions.addEditQuestion(type, id, editQuestion, test).then(data => {
            changeLoader(false)
            if(data.message === true){
                addToast(lang.edit_success_message, {
                    appearance: 'success',
                    autoDismiss: true,
                })
                getTestData()
            }else {
                addToast(data.message, {
                    appearance: 'error',
                    autoDismiss: true,
                })
            }
        }).catch(error => {
            changeLoader(false)
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true,
            })
        })
    }

    return (
        <Main lang={lang}>
            <div className={'edit-view'}>
                <div className={"admin-edit-view-title"}>
                    <EditLocationRounded fontSize={'large'}  htmlColor={"#232f3e"}/>&nbsp; <span>{lang.edit_view}</span>&nbsp;&nbsp;
                    <sub className={"admin-edit-view-warning"}>
                        (<ReportProblemOutlined htmlColor={"#ff9a00"} fontSize={"small"}/> {lang.edit_view_warning_desc})
                    </sub>
                </div>
                <hr/>
                <div className={classes.root}>
                    { Object.keys(test).length !== 0 ?
                        test.empty
                            ?
                            <div className={"admin-tests-empty-data"}>
                                <div className={"admin-activity-loader"}>
                                    <span className={"admin-empty-database-data"}>{lang.empty_database_data}</span>
                                </div>
                            </div>
                            :
                            /* Test data */
                            <>
                                <EditViewParameters lang={lang} id={id} parameters={test.parameters} tech={tech}
                                    currentTech={currentTech} getTestData={getTestData}/>
                                <EditViewTests lang={lang} questions={test.tests} deleteQuestion={deleteQuestion}
                                    handleAddEditQuestion={handleAddEditQuestion}/>
                            </>
                        :
                        <div className={"admin-tests-empty-data"}>
                            <figure className={"admin-activity-loader"}>
                                <img src="/images/gifs/load.gif" alt="loader"/>
                                <span>{lang.data_loading}. . .</span>
                            </figure>
                        </div>
                    }
                </div>
                { addLoader ?
                        <div className={"admin-loader"}>
                            <Loader type="RevolvingDot" color="#031433" height={100} width={100}/>
                        </div> : null
                }
            </div>
        </Main>
    )
}

export default EditView