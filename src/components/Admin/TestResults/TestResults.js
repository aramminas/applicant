import React, {useEffect, useState} from 'react'
import Main from "../Main"
import {connect, useSelector} from "react-redux"
import {ChromeReaderModeTwoTone, DeleteSweepTwoTone, FilterList} from '@material-ui/icons'
import FirebaseFunctions from "../../../helpers/FirebaseFunctions"
import {useToasts} from "react-toast-notifications"
import {Animated} from "react-animated-css"
import TestResultsList from "./TestResultsList"
import TestResultsFilters from "./TestResultsFilters"
import set_admin_data from "../../../store/actions/setAdminAction"
import {IconButton} from '@material-ui/core'
//languages
import lang_en from '../../../lang/en/main.json'
import lang_am from '../../../lang/am/main.json'
import '../Admin.scss'

const initFilters = {
    open: false,
    animate: false,
}

const TestResults = (props) => {
    const {language} = useSelector(state => state.language)
    const {admin} = useSelector(state => state)
    const {addToast} = useToasts()
    const [results, setResults] = useState({})
    const [pinResults, setPinResults] = useState({})
    const [technology, setTechnology] = useState({})
    const [isFilters, setIsFilters] = useState(initFilters)
    const [emptyResult, setEmptyResult] = useState(false)
    const [emptyData, setEmptyData] = useState(false)
    let lang = language === 'EN' ? lang_en : lang_am

    useEffect(() => {
        getTestResults()
        getTechData()
        if(admin.badge > 0){
            FirebaseFunctions.resetToZeroBadge()
            props.adminData({badge: 0})
        }
    },[])


    const getTestResults = () => {
        FirebaseFunctions.getAllTestsResults().then(data => {
            setResults(data)
            setPinResults(data)
        }).catch(error => {
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true,
            })
            setEmptyData(true)
        })
    }

    const getTechData = () => {
        FirebaseFunctions.getTechData().then(data => {
            setTechnology(data)
        }).catch(error => {
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true
            })
        })
    }

    const deleteTestResult = (id) => {
        if(id !== ""){
            FirebaseFunctions.removeTestResult(id).then(data => {
                if(data.result){
                    addToast(lang.success_delete_test_result, {
                        appearance: 'success',
                        autoDismiss: true,
                    })
                    getTestResults()
                }
            }).catch(error => {
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                })
            })
        }else {
            addToast(lang.error_delete_test_result_empty_id, {
                appearance: 'error',
                autoDismiss: true,
            })
        }
    }

    const openFilters = (data) => {
        if(data){
            setIsFilters({ ...isFilters, open: false, animate: true})
            setTimeout(function () {
                setIsFilters({ ...isFilters, open: false, animate: false})
                setResults(pinResults)
            },1000)
        }else{
            setIsFilters({ ...isFilters, open: true, animate: true})
        }
    }

    const filterResults = (data) => {
        setEmptyResult(false)
        if(data.tech || data.userName || data.email || data.examDate){
            let result = {}
            for (let key in pinResults) {
                let getName = data.userName
                let regExpName = new RegExp(getName,"gi")
                let resName = getName !== "" ? pinResults[key]?.fullName?.match(regExpName) : ""
                let getEmail = data.email
                let regExpEmail = new RegExp(getEmail,"gi")
                let resEmail = getEmail !== "" ? pinResults[key]?.email?.match(regExpEmail) : ""
                let getExamDate = data.examDate
                let regExpExamDate = new RegExp(getExamDate,"gi")
                let resExamDate = getExamDate !== "" ? pinResults[key]?.examDate?.match(regExpExamDate) : ""

                if (pinResults.hasOwnProperty(key) &&
                    (pinResults[key]?.parameters?.technologyId === +data.tech ||
                        (pinResults[key]?.fullName !== "" && resName) ||
                        (pinResults[key]?.email !== "" && resEmail) ||
                        (pinResults[key]?.examDate !== "" && resExamDate)
                    )) {
                    result[key] = pinResults[key]
                }
            }
            setResults(result)
            Object.keys(result).length === 0 && setEmptyResult(true)
        }else {
            setResults(pinResults)
        }
    }

    return (
        <Main lang={lang}>
            <div className={'test-results'}>
                <div className={"admin-test-results-title"}>
                    <ChromeReaderModeTwoTone fontSize={'large'}  htmlColor={"#232f3e"}/>&nbsp; <span>{lang.test_results}</span>
                    <IconButton onClick={()=>openFilters(isFilters.open)}
                        className={`admin-test-result-filter-icon ${isFilters.open ? `rotate` : ``}`}>
                        <FilterList htmlColor={"#232f3e"}/>
                    </IconButton>
                </div>
                <hr/>
                { Object.keys(results).length > 0 || emptyResult ?
                    <>
                        {/* Test Results Filters part */}
                        { isFilters.animate &&
                            <Animated animationIn="slideInLeft" animationOut="slideOutLeft" animationInDuration={1000}
                                animationOutDuration={1000} isVisible={isFilters.open}>
                                <TestResultsFilters lang={lang} technology={technology} filterResults={filterResults}/>
                            </Animated>
                        }
                        {/* Test Results List part */}
                        <TestResultsList
                            lang={lang}
                            data={results}
                            emptyResult={emptyResult}
                            technology={technology}
                            deleteTestResult={deleteTestResult}
                        />
                    </>
                    :
                    <div className={"admin-tests-empty-data"}>
                        <figure className={"admin-activity-loader"}>
                            { emptyData ?
                                <span className={"empty-list"}>
                                    <DeleteSweepTwoTone htmlColor={"#232f3e"} fontSize={"large"}/>
                                    {lang.empty_list}
                                </span> :
                                <>
                                    <img src="/images/gifs/load.gif" alt="loader"/>
                                    <span>{`${lang.data_loading} . . .`}</span>
                                </>
                            }
                        </figure>
                    </div>
                }
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

export default connect(mapStateToProps,mapDispatchToProps)(TestResults)

