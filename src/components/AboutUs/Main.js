import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
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

const Main = () => {
    const classes = useStyles()
    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en : lang_am

    return (
        <div className={'about-main is-parallax'}>
            <div className={classes.root}>
                <Grid container justify="center">
                    <Grid container item xs={12} spacing={3} className={"mt50"}>
                        <Grid item xs={12}>
                            <Paper className={`${classes.paper} about-main-title`}>
                                <Animated animationIn="flipInX" animationOut="flipInX" isVisible={true} className={"animated-element"}>
                                    <h1>{lang.about_title[0]}</h1>
                                </Animated>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={3} className={"h100 mt50 about-main-title-desc"} justify="flex-start">
                        <Grid item xs={6} className={"about-main-left-part"}>
                            <Paper className={classes.paper}>
                                <Animated animationIn="fadeInDown" animationOut="fadeInDown" isVisible={true} className={"animated-element"}>
                                    <Grid container item>
                                        <Grid item xs={4}> </Grid>
                                        <Grid item xs={8}>
                                            <div className="">
                                                <h1 className="left-boarder mb5rem">
                                                    {lang.about_title[1]}<br />
                                                    {lang.about_title[2]}
                                                </h1>
                                                <h2>{lang.about_title[3]}</h2>
                                            </div>
                                            <div className="">
                                                <h2 className="">
                                                    {lang.about_title[4]},<br />
                                                    {lang.about_title[5]}
                                                </h2>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Animated>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <Animated animationIn="fadeInUp" animationOut="fadeOut" isVisible={true} className={"animated-element"}>
                                    {/*<Animated animationIn="flip" animationOut="fadeOut" isVisible={true} className={"animated-element"}>*/}
                                        <div className="about-main-image">
                                            <img src="/images/pages/web-development.png" alt="logo" />
                                        </div>
                                    {/*</Animated>*/}
                                </Animated>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default Main