import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Grid, Paper, Button, Tooltip, MenuItem} from '@material-ui/core'
import {
    History,
    LaptopMac,
    ListAlt,
    SupervisedUserCircleOutlined,
    EditLocationOutlined
} from '@material-ui/icons'
import data from '../../../constants'
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import {Animated} from "react-animated-css"
import {useToasts} from "react-toast-notifications"
import FirebaseFunctions from "../../../helpers/FirebaseFunctions"
const levels = data.admin.applicantLevels
const times = data.admin.times

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
        color: theme.palette.text.secondary,
    },
}))

const initEditTech = {
    technologyId: '',
    testForLevel: '',
    testDuration: '',
    technologyIcon: ''
}

const initAnimatePar = {
    showMain: true,
    showEdit: false,
}

const EditViewParameters = (props) => {
    const classes = useStyles()
    const {addToast} = useToasts()
    const [editTech, setEditTech] = useState(initEditTech)
    const [editParams, setEditParams] = useState(false)
    const [animatePar, setAnimatePar] = useState(initAnimatePar)
    const {lang, id, parameters, tech, currentTech, getTestData} = props

    useEffect(function () {
        setTimeout(function () {
            resetInitTechData()
        },400)
    },[])

    const resetInitTechData = () => {
        setEditTech({
            ...editTech,
            technologyId: parameters.technologyId,
            testForLevel: parameters.testForLevel,
            testDuration: parameters.testDuration,
        })
    }

    const handleChangeProgram = (event) => {
        let value = event.target.value
        setEditTech({
            ...editTech,
            technologyId: value,
            technologyIcon: tech[value].icon,
        })
    }

    const handleChangeLevel = (event) => {
        let value = event.target.value
        setEditTech({
            ...editTech,
            testForLevel: value,
        })
    }

    const handleChangeTime = (event) => {
        let value = event.target.value
        setEditTech({
            ...editTech,
            testDuration: value,
        })
    }

    const changeEditParams = (data) => {
        if(!data){
            resetInitTechData()
            setAnimatePar({...animatePar, showEdit: false})
            setTimeout(function () {
                setAnimatePar({...animatePar, showMain: true})
                setEditParams(!editParams)
            },800)
        }else{
            setAnimatePar({...animatePar, showMain: false})
            setTimeout(function () {
                setAnimatePar({...animatePar, showEdit: true})
                setEditParams(!editParams)
            },800)
        }

    }

    const handleEditParams = () => {
        const updateData = {
            parameters: {
                technologyId : editTech.technologyId,
                testDuration: editTech.testDuration,
                testForLevel: editTech.testForLevel,
            }
        }

        FirebaseFunctions.updateData("tests/", id, updateData).then(data => {
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

    return (
        <div className={`${classes.root} edit-view-content`}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    { !editParams ?
                        <Animated animationIn="fadeInDown" animationOut="fadeOutUp"  animationInDuration={800}
                                  animationOutDuration={1000} isVisible={animatePar.showMain}>
                            <Paper className={`${classes.paperRoot} hover-effect`}>
                                <div className={"edit-view-header"}>
                                    <ListAlt />&nbsp;{lang.test_parameters}
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        className={"edit-btn"}
                                        onClick={()=>changeEditParams(true)}
                                    >
                                        {lang.edit} <EditLocationOutlined />
                                    </Button>
                                </div>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Paper className={`${classes.paper} edit-view-paper`}>
                                            <LaptopMac/>&nbsp;
                                            <span className={"paper-name"}>{lang.test_name_}</span>
                                            <hr/>
                                            <span className={"edit-view-values"}>
                                        { Object.keys(currentTech).length > 0 ?
                                            <>
                                                <img src={currentTech.icon} alt="icon"/>
                                                <Tooltip title={currentTech.name}
                                                         placement="top" interactive>
                                                    <span>{currentTech.name}</span>
                                                </Tooltip>
                                            </>
                                            : parameters.technologyId
                                        }
                                    </span>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper className={`${classes.paper} edit-view-paper`}>
                                            <SupervisedUserCircleOutlined />&nbsp;
                                            <span className={"paper-name"}>{lang.test_level}</span>
                                            <hr/>
                                            <span className={`edit-view-values name-desc`}>
                                        {lang[levels.filter(item => item.id === parameters.testForLevel)[0].name]}
                                    </span>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper className={`${classes.paper} edit-view-paper`}>
                                            <History/>&nbsp;
                                            <span className={"paper-name"}>{lang.test_duration}</span>
                                            <hr/>
                                            <span className={`edit-view-values name-desc`}>
                                        {times.filter(item => item.value === parameters.testDuration)[0].name}
                                    </span>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Animated>
                        :
                        <div className={"edit-view-change"}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Animated animationIn="fadeInLeft" animationOut="fadeOutLeft" animationInDuration={1400}
                                              animationOutDuration={1000} isVisible={animatePar.showEdit}>
                                        <Paper className={`${classes.paper} edit-view-change-item`}>
                                            <div className={"edit-view-header"}>
                                                <LaptopMac/>&nbsp;{lang.programming_language}
                                            </div>
                                            <div className={"edit-view-header-body"}>
                                                <Grid container>
                                                    <Grid item xs={4}>
                                                        <div className={"edit-view-programing-lang-image"}>
                                                            <img
                                                                src={ editTech.technologyIcon ?
                                                                        editTech.technologyIcon :
                                                                            currentTech.icon ?
                                                                                currentTech.icon :
                                                                                "/images/pages/technology_default.png"
                                                                }
                                                                alt="programing lang"/>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <FormControl variant="outlined" className={`select-app-parameter ${classes.formControl}`}>
                                                            <InputLabel id="select-lang">{lang.select_language}</InputLabel>
                                                            <Select
                                                                labelId="labelId"
                                                                id="select-id-program-lang"
                                                                value={editTech.technologyId}
                                                                onChange={handleChangeProgram}
                                                                label={lang.select_language}
                                                            >
                                                                {Object.keys(tech).map(key =>
                                                                    <MenuItem key={tech[key].id} value={tech[key].id}>
                                                                        {tech[key].name}
                                                                    </MenuItem>
                                                                )}}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </Paper>
                                    </Animated>
                                </Grid>
                                <Grid item xs={4}>
                                    <Animated animationIn="fadeInDown" animationOut="fadeOutUp" animationInDuration={1000}
                                              animationOutDuration={1000} isVisible={animatePar.showEdit}>
                                        <Paper className={`${classes.paper} edit-view-change-item`}>
                                            <div className={"edit-view-header"}>
                                                <SupervisedUserCircleOutlined />&nbsp;{lang.level_of_professionalism}
                                            </div>
                                            <div className={"edit-view-header-body"}>
                                                <Grid container>
                                                    <Grid item xs={4}>
                                                        <div className={"programing-level-image"}>
                                                            <img src={"/images/pages/level1.png"} alt="programing level"/>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <FormControl variant="outlined" className={`select-app-parameter ${classes.formControl}`}>
                                                            <InputLabel id="select-level">{lang.select_level}</InputLabel>
                                                            <Select
                                                                labelId="labelIdLevel"
                                                                id="select-id-program-level"
                                                                value={editTech.testForLevel}
                                                                onChange={handleChangeLevel}
                                                                label={lang.select_level}
                                                            >
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
                                        </Paper>
                                    </Animated>
                                </Grid>
                                <Grid item xs={4}>
                                    <Animated animationIn="fadeInRight" animationOut="fadeOutRight" animationInDuration={1400}
                                                  animationOutDuration={1000} isVisible={animatePar.showEdit}>
                                        <Paper className={`${classes.paper} edit-view-change-item`}>
                                            <div className={"edit-view-header"}>
                                                <History/>&nbsp;{lang.duration}
                                            </div>
                                            <div className={"edit-view-header-body"}>
                                                <Grid container>
                                                    <Grid item xs={4}>
                                                        <div className={"programing-level-duration"}>
                                                            <img src={"/images/pages/time.png"} alt="programing duration"/>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <FormControl variant="outlined" className={`select-app-parameter ${classes.formControl}`}>
                                                            <InputLabel id="select-duration">{lang.select_duration}</InputLabel>
                                                            <Select
                                                                labelId="labelIdDuration"
                                                                id="select-id-program-duration"
                                                                value={ editTech.testDuration ?
                                                                    times.filter(item => item.value === editTech.testDuration)[0].value :
                                                                    ""
                                                                }
                                                                onChange={handleChangeTime}
                                                                label={lang.select_duration}
                                                            >
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
                                        </Paper>
                                    </Animated>
                                </Grid>
                                <Grid container justify="center">
                                    <Grid item xs={4}>
                                        <Animated animationIn="fadeInUp" animationOut="fadeOutDown" animationInDuration={1000}
                                                  animationOutDuration={500} isVisible={animatePar.showEdit}>
                                            <Paper className={`${classes.paper} edit-view-change-item edit-parameters-btn`}>
                                                <Button variant="outlined" onClick={()=>changeEditParams(false)}>{lang.cancel}</Button>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={handleEditParams}
                                                >
                                                    {lang.edit} <EditLocationOutlined />
                                                </Button>
                                            </Paper>
                                        </Animated>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    }
                </Grid>
            </Grid>
        </div>
    )
}

export default EditViewParameters