import React from 'react'
import {NavLink} from "react-router-dom"
import './Logo.scss'

const Logo = () => {
    return (
        <div className={'logo'}>
            <NavLink to="/" color="inherit" >
                <img src="/images/logo.png" alt="logo"/>
            </NavLink>
        </div>
    )
}

export default Logo