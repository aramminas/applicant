import React from 'react'
import { useSelector } from "react-redux"
import { NavLink } from 'react-router-dom'
import Logo from '../../Logo/Logo'
import NavBar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import './styles.scss'

//languages
import lang_en_main from '../../../lang/en/main.json'
import lang_am_main from '../../../lang/am/main.json'

export default function ButtonAppBar() {
    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en_main : lang_am_main

    return (
        <NavBar bg="dark" variant="dark">
            <Logo />
            <Nav className="mr-auto nav-404">
                <NavLink to="/" color="inherit" className="nav-link">{lang.home}</NavLink>
            </Nav>
        </NavBar>
    )
}