import React from 'react'
import Main from "../Admin/Main"
import {useSelector} from "react-redux"
import NeonButton from './NeonButton/NeonButton'
import NeonLoader from './NeonLoader/NeonLoader'
import RadioButtons3D from './RadioButtons3D/RadioButtons3D'
import Title3D from './Title3D/Title3D'
import {EmojiObjectsOutlined} from '@material-ui/icons'

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
                <div className={"admin-effects-title"}>
                    <EmojiObjectsOutlined fontSize={'large'}  htmlColor={"#232f3e"}/>&nbsp; <span>Css Effects</span>
                </div>
                <hr/>
                <div className={"admin-effects-section"}>
                    <div className={"admin-effects-content"}>
                        <h5>Neon Buttons</h5>
                        <div className={"admin-effects-black-bg"}>
                            <NeonButton variant="default">Button Default</NeonButton>
                            <NeonButton variant="primary">Button Primary</NeonButton>
                            <NeonButton variant="success">Button Success</NeonButton>
                            <NeonButton variant="warning">Button Warning</NeonButton>
                            <NeonButton variant="danger">Button Danger</NeonButton>
                        </div>
                    </div>
                    <div className={"admin-effects-content"}>
                        <h5>Neon Loader</h5>
                        <div className={"admin-effects-black-bg"}>
                            <NeonLoader />
                        </div>
                    </div>
                </div>
                <hr/>
                <div className={"admin-effects-section"}>
                    <div className={"admin-effects-content"}>
                        <h5>Radio Buttons</h5>
                        <div className={"admin-effects-black-bg"}>
                            <RadioButtons3D />
                        </div>
                    </div>
                    <div className={"admin-effects-content"}>
                        <h5>Title 3D</h5>
                        <div className={"admin-effects-black-bg"}>
                            <Title3D />
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    )
}

export default CssEffects