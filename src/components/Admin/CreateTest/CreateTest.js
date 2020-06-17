import React, {useState,useEffect} from 'react'
import {useSelector} from "react-redux"
import { makeStyles } from '@material-ui/core/styles'
import Firebase from '../../../Firebase'
import FirebaseFunctions from '../../../helpers/FirebaseFunctions'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import FormControl from '@material-ui/core/FormControl'
import {Settings} from '@material-ui/icons'
import Select from '@material-ui/core/Select'
import formatDate from 'intl-dateformat'
import {History,SupervisedUserCircleOutlined,LaptopMac,
    AddCircleOutlineRounded,RemoveCircleOutline} from '@material-ui/icons'
import Main from "../Main"
import TestCreator from "./TestCreator"
import AddModal from './AddModal'
import DeleteModal from './DeleteModal'
import Loader from 'react-loader-spinner'
import {useToasts} from "react-toast-notifications"
import makeId from '../../../helpers/makeId'
import getUpdateChartData from '../../../helpers/getUpdateChartData'

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

function ErrorMessage(error,addToast) {
    let errorCode = error.code
    let errorMessage = error.message
    if (errorCode && errorMessage) {
        addToast(errorMessage, {
            appearance: 'error',
            autoDismiss: true,
        })
    }
}

const initTestData = {
    parameters: {
        technologyId: '',
        testForLevel: '',
        testDuration: '',
    },
    quizzes: [],
    logicalTests: [],
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
        FirebaseFunctions.getTechData().then(data => {
            setTecData(data)
            if(id === testData.parameters.technologyId){
                setValidation({...validation, name: false})
                setTestData({
                    ...testData,
                    parameters: {
                        ...testData.parameters,
                        technologyId: ''
                    }
                })
            }
        }).catch(error => {
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true
            })
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
                technologyId: value
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
        let name = testData.parameters.technologyId === ""
        let level = testData.parameters.testForLevel === ""
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

        changeLoader(true)
        setAdded(true)
        startProcessAddingTest()
    }

    const startProcessAddingTest = () => {
        const finalData = {
            parameters: {},
            tests: [],
        }
        const quizCount = testData.quizzes.length
        const LogicalCount = testData.logicalTests.length
        const numberOfTests = quizCount + LogicalCount
        // step 1 - add parameters
        finalData.parameters = {...testData.parameters}
        // step 2 - add quiz type test
        if(quizCount > 0){
            testData.quizzes.map( value => {
                let imageUrl = "";
                let finalQuizData = {
                    id: value.id,
                    question: value.question,
                    codeData: value.codeData,
                    imageUrl,
                    imageName: "",
                    options: value.options,
                    rightAnswers: value.rightAnswers,
                    multiAnswer: value.multiAnswer,
                    type: "quiz",
                }
                // add the image in the storage firebase and get url
                if(value.imageData.file){
                    value.imageData.name = `${Date.now()}_${value.imageData.name}`
                    finalQuizData.imageName = value.imageData.name
                    loadImage(value.imageData)
                        .then(url => {
                            if(url !== ""){
                                finalQuizData.imageUrl = url
                                finalData.tests.push(finalQuizData)
                            }
                        })
                        .catch(error => {
                            if(error !== "" && typeof error === "string"){
                                addToast(error, {
                                    appearance: 'error',
                                    autoDismiss: true,
                                })
                            }
                            console.error(error)
                        })
                }else{
                    finalData.tests.push(finalQuizData)
                }
                return true
            })
        }
        // step 3 - add logical type test
        if(LogicalCount > 0){
            testData.logicalTests.map( value => {
                let imageUrl = ""
                let finalLogicalData = {
                    id: value.id,
                    question: value.question,
                    imageUrl,
                    imageName: "",
                    options: value.options,
                    rightAnswers: value.rightAnswers,
                    optionsOrText: value.optionsOrText,
                    type: "logical",
                }
                // add the image in the storage firebase and get url
                if(value.imageData.file){
                    value.imageData.name = `${Date.now()}_${value.imageData.name}`
                    finalLogicalData.imageName = value.imageData.name
                    loadImage(value.imageData)
                        .then(url => {
                            if(url !== ""){
                                finalLogicalData.imageUrl = url
                                finalData.tests.push(finalLogicalData)
                            }
                        })
                        .catch(error => {
                            if(error !== "" && typeof error === "string"){
                                addToast(error, {
                                    appearance: 'error',
                                    autoDismiss: true,
                                })
                            }else{
                                console.error(error)
                            }
                        })
                }else{
                    finalData.tests.push(finalLogicalData)
                }
                return true
            })
        }

        // checking how many tests were added to the final array
        let checkingTestsCount = () => {
            let finalArray = finalData.tests.length
            if(finalArray === numberOfTests){
                clearInterval(interval)
                addTest(finalData)
            }
        }

        let interval = setInterval(checkingTestsCount, 1000)
    }

    const loadImage = fileData => {
        return new Promise((resolve, reject) => {
            let url = ""

            if(fileData.file){
                let storageRef = Firebase.storage.ref(`storage/images/tests`)
                let uploadTask = storageRef.child(`/${fileData.name}`).put(fileData.file)
                uploadTask.on('state_changed', function(snapshot){
                    // 😷 handling promise Id | let id = snapshot?.metadata?.generation || null
                }, function(error) {
                    ErrorMessage(error,addToast)
                }, function() {
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        if(downloadURL){
                            resolve(downloadURL)
                        }else{
                            reject(`Failed to load image's URL: ${url}`)
                        }
                    })
                })
            }
        })
    }


    const addTest = (data) => {
        if(!data.id){
            data.id = makeId(28) // generating a random ID with a length of 28
        }
        // add the date of creation of test
        const dateAt = new Date()
        data.createdAt = formatDate(dateAt, 'MM/DD/YYYY')

        // Add a new test in collection "tests" with ID
        Firebase.database.ref(`tests/${data.id}`).set(data, function (error) {
            if(error){
                ErrorMessage(error,addToast)
            }else {
                resetDefaultData()
                // update chart data
                getUpdateChartData('test','add')
                addToast(lang.success_added, {
                    appearance: 'success',
                    autoDismiss: true,
                })
            }
            setAdded(false)
            changeLoader(false)
        })
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
                                                    src={testData.parameters.technologyId &&
                                                            techData[testData.parameters.technologyId] ?
                                                                techData[testData.parameters.technologyId].icon :
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
                                                    value={testData.parameters.technologyId}
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
                                                            {lang[level.name]}
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
            <AddModal handleClose={handleClose} open={open} lang={lang} changeLoader={changeLoader}
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

