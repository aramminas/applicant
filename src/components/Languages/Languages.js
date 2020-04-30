import React, {useState} from 'react'
import Flag from 'react-world-flags'
import {Button} from '@material-ui/core/'
import './Languages.scss'
import data from '../../constants'
import change_language from "../../store/actions/languageAction"
import {connect} from "react-redux"

const ln = data.language

function Languages(props) {
    const [selLang, setSelLang] = useState(true)
    const [currentLang, setCurrentLang] = useState("GB")

    //todo need set and get language from local storage

    const selectLang = () => {
        setSelLang(() => !selLang)
    }

    const changeLang = (newLan) => {
        setSelLang(() => !selLang)
        setCurrentLang(() => newLan === "AM" ? "AM" : "GB")
        props.changeLanguage(newLan)
    }

    const langList = ln.map(lan => (
        <Button variant="contained" color="primary" key={`lan-${lan.text}`} onClick={() => changeLang(lan.text)}>
            <Flag code={lan.flag}/> &nbsp; {lan.text}
        </Button>
    ))

    return (
        <div className="lang-content">
            {selLang ?
                <>
                    <Button variant="contained" color="primary" onClick={() => selectLang()}>
                        <Flag code={currentLang}/>
                    </Button>
                </> :
                <div className="languages">
                   {langList}
                </div>
            }
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
