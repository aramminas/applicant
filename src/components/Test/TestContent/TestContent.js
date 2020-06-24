import React, {useState, useEffect} from 'react'
import Welcome from "./Welcome"
import TestDescription from "./TestDescription"
import TestQuestion from "./TestQuestion"
import {Animated} from "react-animated-css"

const initTestSettings = {
    openTest: false,
    startTest: false,
}

const initAnimation = {
    desc: true,
    test: true,
}

const TestContent = (props) => {
    const [testSettings, setTestSettings] = useState(initTestSettings)
    const [animation, setAnimation] = useState(initAnimation)
    const {lang, question, saveTestResult} = props

    useEffect(function () {
        const accept = localStorage.getItem('accept')
        if(accept && accept === "1"){
            setTestSettings({...testSettings, openTest: true})
        }
    },[])

    const handleOpenTest = () => {
        setTestSettings({...testSettings, openTest: true})
    }

    const handleStartTest = () => {
        setAnimation({...testSettings, desc: false})
        setTimeout(function () {
            setTestSettings({...testSettings, startTest: true})
        },700)
    }

    return (
        <div className={'test-content'}>
            {testSettings.openTest ?
                testSettings.startTest ?
                    <Animated animationIn="zoomIn" animationOut="zoomOut" animationInDuration={1000} animationOutDuration={1000} isVisible={animation.test}>
                        <TestQuestion lang={lang} question={question} saveTestResult={saveTestResult}/>
                    </Animated>
                    :
                    <Animated animationIn="pulse" animationOut="zoomOut" animationInDuration={1000} animationOutDuration={1000} isVisible={animation.desc}>
                        <TestDescription lang={lang} question={question} handleStartTest={handleStartTest}/>
                    </Animated>
                :
                <Welcome lang={lang} handleOpenTest={handleOpenTest}/>
            }
        </div>
    )
}

export default TestContent