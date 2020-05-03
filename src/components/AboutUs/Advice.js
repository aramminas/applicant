import React, {useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import DoneRoundedIcon from '@material-ui/icons/DoneRounded'
import ScrollListener from 'react-scroll-listen'
import {useSelector} from "react-redux"
import {Animated} from "react-animated-css"

//languages
import lang_en from '../../lang/en/main.json'
import lang_am from '../../lang/am/main.json'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: "#ecf0f1",
        backgroundColor: "transparent",
        boxShadow: "none",
    },
}))

const Advice = () => {
    const classes = useStyles()
    const {language} = useSelector(state => state.language)
    const [scroll,setScroll] = useState({scrollPosition: 0})
    const [showAdvices,setShowAdvices] = useState(false)
    useEffect(() => {
        if(scroll.scrollPosition > 200){
            setShowAdvices(true)
        }else{
            setShowAdvices(false)
        }
    },[scroll])

    let lang = language === 'EN' ? lang_en : lang_am

    const advices_element = lang.advices.map((advice,index) =>
        <React.Fragment key={index}>
            <Grid item xs={12} sm={3} className={"about-advice-items-spacing"}> </Grid>
            <Grid item xs={12} sm={6} className={"about-advice-items"}>
                <Animated animationIn="lightSpeedIn" animationOut="fadeOut" isVisible={true} className={`animated-element animated-element-${index+1}`}>
                    <Paper className={classes.paper}>
                        <DoneRoundedIcon htmlColor={"#2351a7"} /> {`  ${advice}`}
                    </Paper>
                </Animated>
            </Grid>
            <Grid item xs={12} sm={3} className={"about-advice-items-spacing"}> </Grid>
        </React.Fragment>
    )

    return (
        <>
            <ScrollListener
                onScroll={value => setScroll({scrollPosition: value})}
            />
            <div className={'about-advice'}>
                <div className={classes.root}>
                    <Grid container justify="flex-start">
                        <Grid container item xs={12} spacing={3} className={"mt50"}>
                            <Grid item xs={12}>
                                <Paper className={`${classes.paper} about-advice-title`}>
                                    <Animated animationIn="flipInX" animationOut="flipInX" isVisible={true} className={"animated-element"}>
                                        <h1>{lang.about_advice_title}</h1>
                                    </Animated>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid container className={"h100 mt50  about-advice-content"} justify="flex-start">
                            {
                                showAdvices ?
                                    <>
                                        {advices_element}
                                        <Grid item xs={12} className={"about-advice-image"}>
                                            <Animated animationIn="flipInX" animationOut="flipInX" isVisible={true} className={"animated-element animated-element-4"}>
                                                <figure>
                                                    <img src="/images/pages/about-us-end.png" alt=""/>
                                                </figure>
                                            </Animated>
                                        </Grid>
                                    </>
                                    : null
                            }
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>

    )
}

export default Advice