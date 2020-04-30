import React from 'react'
import GreetingText from './GreetingText'
import './Welcome.scss'

const Main = () => {
    return (
        <div className={'welcome-main'}>
            <GreetingText />
        </div>
    )
}

export default Main