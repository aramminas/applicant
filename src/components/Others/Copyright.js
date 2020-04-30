import React from 'react'
import {Typography} from '@material-ui/core'
import {NavLink} from 'react-router-dom'

function Copyright(props) {
    const {copyright, web_company} = props.lang_m
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {`${copyright} © `}
            <NavLink to="/" color="inherit">{web_company}</NavLink>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

export default Copyright