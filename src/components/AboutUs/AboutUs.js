import React from 'react'
import './AboutUs.scss'
import Layout from "../../hoc/layout/Layout"
import Main from "./Main"
import Advice from "./Advice"
import End from "./End"

const AboutUs = () => {
    return (
        <div className={'about-us'}>
            <Main />
            <Advice />
            <End />
        </div>
    )
}

export default Layout(AboutUs)

