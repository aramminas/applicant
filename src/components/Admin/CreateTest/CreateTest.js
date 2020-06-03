import React, {useState,useEffect} from 'react'
import {useSelector} from "react-redux"
import { makeStyles } from '@material-ui/core/styles'
import Firebase from '../../../Firebase'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import FormControl from '@material-ui/core/FormControl'
import {Settings} from '@material-ui/icons'
import Select from '@material-ui/core/Select'
import {History,SupervisedUserCircleOutlined,LaptopMac,
    AddCircleOutlineRounded,RemoveCircleOutline} from '@material-ui/icons'
import Main from "../Main"
import TestCreator from "./TestCreator"
import Modal from './Modal'
import DeleteModal from './DeleteModal'
import Loader from 'react-loader-spinner'
import {useToasts} from "react-toast-notifications"

import lang_en from '../../../lang/en/main.json'
import lang_am from '../../../lang/am/main.json'
import '../Admin.scss'
import data from '../../../constants'
const levels = data.admin.applicantLevels
const times = data.admin.times

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: "80%",
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}))

const initTestData = {
    parameters: {
        technologyName: '',
        testForLevel: '',
        testDuration: '',
    },
    quizzes: [],
    logicalTests: [],
    test: {}
}

const initValidation = {
    name: false,
    level: false,
    duration: false,
    ready: false
}

const CreateTest = () => {
    const classes = useStyles()
    const { addToast } = useToasts()
    const {language} = useSelector(state => state.language)
    const [testData, setTestData] = useState({...initTestData})
    const [open, setOpen] = useState(false)
    const [openDel, setOpenDel] = useState(false)
    const [addLoader,setAddLoader] = useState(false)
    const [added, setAdded] = useState(false)
    const [techData, setTecData] = useState({})
    const [anchorEl, setAnchorEl] = useState(null)
    const [validation, setValidation] = useState(initValidation)

    useEffect(function () {
        getTechData()
    },[])

    let lang = language === 'EN' ? lang_en : lang_am

    const getTechData = (id) => {
        const db = Firebase.database
        db.ref(`/technology`).once('value').then(function(snapshot) {
            let technologyData = snapshot.val() || {}
            if(Object.keys(technologyData).length !== 0 && technologyData.constructor === Object){
                setTecData(technologyData)
                if(id === testData.parameters.technologyName){
                    setValidation({...validation, name: false})
                    setTestData({
                        ...testData,
                        parameters: {
                            ...testData.parameters,
                            technologyName: ''
                        }
                    })
                }
            }
        })
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseAddDel = () => {
        setAnchorEl(null)
    }

    const handleChangeProgram = (event) => {
        let value = event.target.value
        setTestData({
            ...testData,
            parameters: {
                ...testData.parameters,
                technologyName: value
            }
        })

        if(value !== ""){
            setValidation({...validation, name: false})
        }
    }

    const handleChangeLevel = (event) => {
        let value = event.target.value
        setTestData({
            ...testData,
            parameters: {
                ...testData.parameters,
                testForLevel: value
            }
        })

        if(value !== ""){
            setValidation({...validation, level: false})
        }
    }

    const handleChangeTime = (event) => {
        let value = event.target.value
        setTestData({
            ...testData,
            parameters: {
                ...testData.parameters,
                testDuration: value
            }
        })

        if(value !== ""){
            setValidation({...validation, duration: false})
        }
    }

    const handleClickOpen = () => {
        handleCloseAddDel()
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const changeLoader = (data) => {
        setAddLoader(data)
    }

    const delTech = (e) => {
        e.preventDefault()
        handleCloseAddDel()
        setOpenDel(true)
    }

    const addQuizData = (quiz) => {
        setTestData((testData) => {
            testData.quizzes.push(quiz)
            return {...testData, quizzes: testData.quizzes}
        })
    }

    const addLogicalData = (logical) => {
        setTestData((testData) => {
            testData.logicalTests.push(logical)
            return {...testData, logicalTests: testData.logicalTests}
        })
    }

    const deleteTest = (type, id) => {
        let quizzes = testData.quizzes
        let logicalTests = testData.logicalTests
        if(type === 'quiz'){
            quizzes = testData.quizzes.filter(test => test.id !== id)
        }else if(type === 'logical'){
            logicalTests = testData.logicalTests.filter(test => test.id !== id)
        }

        setTestData((testData) => {
            return {...testData, quizzes, logicalTests}
        })
    }

    const resetDefaultData = () => {
        setTestData({...initTestData,quizzes: [],logicalTests: []})
    }

    const createNewTest = () => {
        let name = testData.parameters.testForLevel === ""
        let level = testData.parameters.technologyName === ""
        let duration = testData.parameters.testDuration === ""

        if(name || level || duration){
            setValidation({name, level, duration})
            addToast(lang.error_empty_fields, {
                appearance: 'error',
                autoDismiss: true
            })
            return false
        }else{
            setValidation({...validation, ready: true})
        }
        // TODO: need to add functionality for  add text in firebase
        changeLoader(true)
        setAdded(true)
        setTimeout(function () {
            setAdded(false)
            changeLoader(false)
            return true
        },10000)
    }

    return (
        <Main lang={lang}>
            <div className={"createTest"}>
                <Grid container spacing={3} justify="center">
                    {/* Programming language part*/}
                    <Grid item xs={12} sm={4} className={"admin-element"}>
                        <Paper className={classes.paper}>
                            <div className={"test-type"}>
                                <div>
                                    <LaptopMac/>&nbsp;{lang.programming_language}
                                    <div className={"add-new-item"} onClick={handleClick}>
                                        <Settings/>
                                    </div>
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleCloseAddDel}
                                    >
                                        <MenuItem onClick={() => handleClickOpen()}>
                                            <AddCircleOutlineRounded htmlColor={"#009be5"}/>&nbsp;{lang.add_technology}
                                        </MenuItem>
                                        <MenuItem onClick={delTech}>
                                            <RemoveCircleOutline htmlColor={"red"}/>&nbsp;{lang.delete_technology}
                                        </MenuItem>
                                    </Menu>
                                </div>
                                <div>
                                    <Grid container>
                                        <Grid item xs={4}>
                                            <div className={"programing-lang-image"}>
                                                <img
                                                    src={testData.parameters.technologyName &&
                                                            techData[testData.parameters.technologyName]?
                                                                techData[testData.parameters.technologyName].icon :
                                                        "/images/pages/technology_default.png"}
                                                    alt="programing lang"/>
                                            </div>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <FormControl variant="outlined" className={`select-app-lang ${classes.formControl}`}>
                                                <InputLabel id="select-lang">{lang.select_language}</InputLabel>
                                                <Select
                                                    labelId="labelId"
                                                    id="select-id-program-lang"
                                                    value={testData.parameters.technologyName}
                                                    onChange={handleChangeProgram}
                                                    label={lang.select_language}
                                                    error={validation.name}
                                                >
                                                    <MenuItem value="">
                                                        <em>-- --</em>
                                                    </MenuItem>
                                                    {Object.keys(techData).map(key =>
                                                        <MenuItem key={techData[key].id} value={techData[key].id}>
                                                            {techData[key].name}
                                                        </MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                    {/*  Level of professionalism part*/}
                    <Grid item xs={12} sm={4} className={"admin-element"}>
                        <Paper className={classes.paper}>
                            <div className={"test-type"}>
                                <div>
                                    <SupervisedUserCircleOutlined />&nbsp;{lang.level_of_professionalism}
                                </div>
                                <div>
                                    <Grid container>
                                        <Grid item xs={4}>
                                            <div className={"programing-level-image"}>
                                                <img src={"/images/pages/level1.png"} alt="programing level"/>
                                            </div>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <FormControl variant="outlined" className={`select-app-level ${classes.formControl}`}>
                                                <InputLabel id="select-level">{lang.select_level}</InputLabel>
                                                <Select
                                                    labelId="labelIdLevel"
                                                    id="select-id-program-level"
                                                    value={testData.parameters.testForLevel}
                                                    onChange={handleChangeLevel}
                                                    label={lang.select_level}
                                                    error={validation.level}
                                                >
                                                    <MenuItem value="">
                                                        <em>-- --</em>
                                                    </MenuItem>
                                                    {levels.map(level =>
                                                        <MenuItem key={level.id} value={level.id}>
                                                            {level.name}
                                                        </MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                    {/* Duration part*/}
                    <Grid item xs={12} sm={3} className={"admin-element"}>
                        <Paper className={classes.paper}>
                            <div className={"test-type"}>
                                <div>
                                    <History/>&nbsp;{lang.duration}
                                </div>
                                <div>
                                    <Grid container>
                                        <Grid item xs={4}>
                                            <div className={"programing-level-duration"}>
                                                <img src={"/images/pages/time.png"} alt="programing duration"/>
                                            </div>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <FormControl variant="outlined" className={`select-app-duration ${classes.formControl}`}>
                                                <InputLabel id="select-duration">{lang.select_duration}</InputLabel>
                                                <Select
                                                    labelId="labelIdDuration"
                                                    id="select-id-program-duration"
                                                    value={testData.parameters.testDuration}
                                                    onChange={handleChangeTime}
                                                    label={lang.select_duration}
                                                    error={validation.duration}
                                                >
                                                    <MenuItem value="">
                                                        <em>-- --</em>
                                                    </MenuItem>
                                                    {times.map(time =>
                                                        <MenuItem key={time.id} value={time.value}>
                                                            {time.name}
                                                        </MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={11} className={"admin-element"}>
                        <Paper className={classes.paper}>
                            <TestCreator
                                lang={lang}
                                added={added}
                                quizzesCount={testData.quizzes.length}
                                logicalTestsCount={testData.logicalTests.length}
                                addQuizData={addQuizData}
                                addLogicalData={addLogicalData}
                                testData={testData}
                                deleteTest={deleteTest}
                                validation={validation}
                                resetDefaultData={resetDefaultData}
                                createNewTest={createNewTest}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
            {/* Modal window for adding technology */}
            <Modal handleClose={handleClose} open={open} lang={lang} changeLoader={changeLoader}
                   techData={techData} getTechData={getTechData}
            />
            {/* Modal window for deleting technology */}
            <DeleteModal open={openDel} setOpen={setOpenDel} lang={lang} techData={techData}
                getTechData={getTechData}
            />
            {
                addLoader ?
                    <div className={"admin-loader"}>
                        <Loader type="RevolvingDot" color="#031433" height={100} width={100}/>
                    </div>:
                    null
            }
        </Main>
    )
}

export default CreateTest

