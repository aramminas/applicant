import React from 'react'
import Main from "../Admin/Main"
import {useSelector} from "react-redux"
import lang_en from '../../lang/en/main.json'
import lang_am from '../../lang/am/main.json'
import '../Admin/Admin.scss'
import './CssEffects.scss'

const CssEffects = () => {
    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en : lang_am

    return (
        <Main lang={lang}>
            <div className={'admin-effects'}>
                Css Effects
            </div>
        </Main>
    )
}

export default CssEffects