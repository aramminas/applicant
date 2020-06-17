import React from 'react'
import Main from "../Main"
import {useSelector} from "react-redux"
import {ChromeReaderModeTwoTone} from '@material-ui/icons'
import lang_en from '../../../lang/en/main.json'
import lang_am from '../../../lang/am/main.json'
import '../Admin.scss'

const TestResults = () => {
    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en : lang_am

    return (
        <Main lang={lang}>
            <div className={'test-results'}>
                <div className={"admin-test-results-title"}>
                    <ChromeReaderModeTwoTone fontSize={'large'}  htmlColor={"#232f3e"}/>&nbsp; <span>{lang.test_results}</span>
                </div>
                <hr/>
                Test Results
            </div>
        </Main>
    )
}

export default TestResults

