import React, {useState, useEffect} from 'react'
import Main from "../Main"
import {useSelector} from "react-redux"
import {useParams} from "react-router-dom"
import {useToasts} from "react-toast-notifications"
import {ChromeReaderModeTwoTone, AccountCircleTwoTone} from "@material-ui/icons"
import FirebaseFunctions from "../../../helpers/FirebaseFunctions"
import TestState from "./TestState"
import '../Admin.scss'
//languages
import lang_en from "../../../lang/en/main.json"
import lang_am from "../../../lang/am/main.json"

const TestResult = () => {
    const {addToast} = useToasts()
    const {language} = useSelector(state => state.language)
    const [resultData, setResultData] = useState({})
    const [tecData, setTecData] = useState({})
    let {id} = useParams()
    let lang = language === 'EN' ? lang_en : lang_am

    useEffect(function () {
        getTestResultData()
    },[])

    const getTestResultData = () => {
        if(id){
            FirebaseFunctions.getTestResultById(id).then(data => {
                setResultData(data)
                if(data?.parameters?.technologyId){
                    getTechData(data?.parameters?.technologyId)
                }
            }).catch(error => {
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                })
            })
        }else {
            addToast(lang.unknown_identifier, {
                appearance: 'error',
                autoDismiss: true,
            })
        }
    }

    const getTechData = (id) => {
        FirebaseFunctions.getTechData().then(data => {
            if(id){
                setTecData(data[id])
            }
        }).catch(error => {
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true
            })
        })
    }

    const updateUserTestScore = () => {
        getTestResultData()
    }

    return (
        <Main lang={lang}>
            <div className={'test-result-single'}>
                <div className={"admin-test-results-title"}>
                    <ChromeReaderModeTwoTone fontSize={'large'}  htmlColor={"#232f3e"}/>&nbsp; <span>{lang.test_result}</span>
                    { resultData.fullName ?
                        <span className={"admin-test-results-user-name"}> {resultData.fullName} <AccountCircleTwoTone/></span> : null
                    }
                </div>
            </div>
            <hr/>
            <TestState lang={lang} resultData={resultData} tecData={tecData} updateUserTestScore={updateUserTestScore}/>
        </Main>
    )
}

export default TestResult