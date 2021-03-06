import React, {useState, useEffect} from 'react'
import Flag from 'react-world-flags'
import {Button} from '@material-ui/core/'
import './Languages.scss'
import change_language from "../../store/actions/languageAction"
import {connect,useSelector} from "react-redux"

function Languages(props) {
    const [currentLang, setCurrentLang] = useState("GB")
    const {language} = useSelector(state => state.language)

    useEffect(()=>{
        setCurrentLang(() => language === "AM" ? "AM" : "GB")
    },[language])

    const changeLang = (newLan) => {
        setCurrentLang(() => newLan === "AM" ? "AM" : "GB")
        props.changeLanguage(newLan)
    }

    return (
        <div className="lang-content">
            <Button variant="contained" color="primary" onClick={() => changeLang(currentLang === "GB" ? "AM" : "EN")}>
                <Flag code={currentLang === "GB" ? "AM" : "GB"}/>
            </Button>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeLanguage: (data) => {dispatch(change_language(data))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Languages)
