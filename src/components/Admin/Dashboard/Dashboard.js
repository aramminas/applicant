import React,{useState, useEffect} from "react"
import Main from "../Main"
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import {PeopleAltOutlined, DoneAllSharp, AssignmentOutlined, ChromeReaderModeOutlined, SyncProblem} from '@material-ui/icons'
import Chart from './Chart'
import {connect,useSelector} from 'react-redux'
import set_admin_data from "../../../store/actions/setAdminAction"
import {NavLink} from 'react-router-dom'
import {useToasts} from 'react-toast-notifications'
import getUpdateChartData from '../../../helpers/getUpdateChartData'
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
}))

const mainLinks = (data) => {
    return [
        {
            title: 'all_applicants',
            secondary_title: 'applicants_lc',
            url: 'applicants',
            count: data.applicants,
            icon: <PeopleAltOutlined htmlColor={"#fff"}/>,
            secondary_icon: <DoneAllSharp htmlColor={"lime"} fontWeight={600}/>
        },
        {
            title: 'all_tests',
            secondary_title: 'tests_lc',
            url: 'tests',
            count: data.tests,
            icon: <AssignmentOutlined htmlColor={"#fff"}/>,
            secondary_icon: <DoneAllSharp htmlColor={"lime"} fontWeight={600}/>
        },
        {
            title: 'all_passed_tests',
            secondary_title: 'passed_tests_lc',
            url: 'test-result',
            count: data.passedTests,
            icon: <ChromeReaderModeOutlined htmlColor={"#fff"}/>,
            secondary_icon: <DoneAllSharp htmlColor={"lime"} fontWeight={600}/>
        }
    ]
}

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

const initActivity = {
    applicants: 0,
    tests: 0,
    passedTests: 0,
    badge: 0,
}

const Dashboard = (props) => {
    const classes = useStyles()
    const {addToast} = useToasts()
    const {language} = useSelector(state => state.language)
    const [siteActivity, setSiteActivity] = useState(initActivity)
    const [chart, setChart] = useState([])
    let lang = language === 'EN' ? lang_en : lang_am

    useEffect(function () {
        getUpdateChartData().then(data => {
            let activity = data || {}
            if(Object.keys(activity).length !== 0){
                setSiteActivity({
                    applicants: activity.applicants,
                    tests: activity.tests,
                    passedTests: activity.passedTests,
                    badge: activity.badge,
                })
                const applicantsTemp = activity.applicantData.map(temp => {
                    return {...temp, x: new Date(temp.x)}
                })
                const testsTemp = activity.testData.map(temp => {
                    return {...temp, x: new Date(temp.x)}
                })
                const passedTestsTemp = activity.passedTestsData.map(temp => {
                    return {...temp, x: new Date(temp.x)}
                })
                if(activity.badge > 0){
                    props.adminData({badge: activity.badge})
                }
                setChart([applicantsTemp, testsTemp, passedTestsTemp])
            }
        }).catch(error => {
            setSiteActivity({
                applicants: NaN,
                tests: NaN,
                passedTests: NaN,
            })
            setChart([false, false])
            ErrorMessage(error,addToast)
        })
    },[])

    const main_links_data = mainLinks(siteActivity)

    const main_links = main_links_data.map((data,index)=>{
        let count = data.count !== 0 ?
                        isNaN(data.count) ?
                            <SyncProblem htmlColor={"yellow"}/> :
                            data.count :
                    <figure className={"admin-activity-loader"}>
                        <img src="/images/gifs/load.gif" alt="loader"/>
                    </figure>

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
                                {data.secondary_icon}&ensp;{count} {` ${lang[data.secondary_title]}`}
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
                        <Paper className={`${classes.paper} admin-chart-loader`}>
                            { chart.length === 0 ?
                                <figure className={"admin-activity-loader"}>
                                    <img src="/images/gifs/load.gif" alt="loader"/>
                                    <span>{lang.data_loading}. . .</span>
                                </figure> :
                                !chart[0] && !chart[1] ?
                                    <div className={"admin-activity-loader"}>
                                        <span className={"admin-empty-database-data"}>{lang.empty_database_data}</span>
                                    </div> :
                                <Chart lang={lang} chart={chart}/>
                            }
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </Main>
    )
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        adminData: (data) => {dispatch(set_admin_data(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)
