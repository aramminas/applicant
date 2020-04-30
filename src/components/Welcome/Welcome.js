import React from 'react'
//components
import Main from './Main'
import Technology from './Technology'

import './Welcome.scss'
import {connect} from 'react-redux'
import update_welcome from  '../../store/actions/welcomeAction'
import Layout from '../../hoc/layout/Layout'
import SlideShow from './SlideShow/SlideShow'

const Welcome = (props) => {
    return (
        <div className={'welcome'}>
            <Main />
            <SlideShow />
            <Technology />
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
        updateWelcome: () => {dispatch(update_welcome)}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Layout(Welcome))