import React from "react"
import Main from "../Main"
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import {PeopleAltOutlined, DoneAllSharp,AssignmentOutlined,ChromeReaderModeOutlined} from '@material-ui/icons'
import Chart from './Chart'
import {useSelector} from "react-redux"
import {NavLink} from 'react-router-dom'
import lang_en from '../../../lang/en/main.json'
import lang_am from '../../../lang/am/main.json'
import '../Admin.scss'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));


const Dashboard = () => {
    const classes = useStyles()
    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en : lang_am

    const main_links_data = [
        {
            title: 'all_applicants',
            secondary_title: 'applicants_lc',
            url: 'applicants',
            count: 1,
            icon: <PeopleAltOutlined htmlColor={"#fff"}/>,
            secondary_icon: <DoneAllSharp htmlColor={"lime"} fontWeight={600}/>
        },
        {
            title: 'all_tests',
            secondary_title: 'tests_lc',
            url: 'tests',
            count: 2,
            icon: <AssignmentOutlined htmlColor={"#fff"}/>,
            secondary_icon: <DoneAllSharp htmlColor={"lime"} fontWeight={600}/>
        },
        {
            title: 'all_passed_tests',
            secondary_title: 'passed_tests_lc',
            url: 'test-result',
            count: 3,
            icon: <ChromeReaderModeOutlined htmlColor={"#fff"}/>,
            secondary_icon: <DoneAllSharp htmlColor={"lime"} fontWeight={600}/>
        }
    ]

    const main_links = main_links_data.map((data,index)=>{
        return (
                <Grid item xs={12} sm={4} key={index} className={"admin-element"}>
                    <Paper className={classes.paper}>
                        <div className={`dashboard-all-data`}>
                            <div>
                                {data.icon}&ensp;
                                <NavLink to={`/${data.url}`} color="inherit" className={"admin-main-link"}>
                                    <span className={"admin-main-link-item"}>{lang[data.title]}</span>
                                </NavLink>
                            </div>
                            <div>
                                {data.secondary_icon}&ensp; {`${data.count} ${lang[data.secondary_title]}`}
                            </div>
                        </div>
                    </Paper>

                </Grid>
            )
    })

    return (
        <Main lang={lang}>
            <div className={`${classes.root} admin-dashboard`}>
                <Grid container spacing={3}>
                    {main_links}
                    <Grid item xs={12} className={"admin-element"}>
                        <Paper className={classes.paper}>
                            <Chart lang={lang}/>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </Main>
    )
}

export default Dashboard
