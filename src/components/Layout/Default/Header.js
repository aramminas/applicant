import React, {useState, useEffect} from 'react'
import {connect, useSelector} from "react-redux"
import add_update_user_data from "../../../store/actions/userAction"
import {NavLink, Redirect, useParams} from 'react-router-dom'
import Languages from '../../Languages/Languages'
import useStyles from './styles'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone'
import Firebase from '../../../Firebase'
import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core/'
import {useToasts} from "react-toast-notifications"
import Logo from '../../Logo/Logo'

import './styles.scss'

//languages
import lang_en_main from '../../../lang/en/main.json'
import lang_am_main from '../../../lang/am/main.json'

const resetUser = {
    userId: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    birthday: '',
    password: null,
    isLogged: false,
    role: 2
}

function ErrorMessage(error,addToast) {
    let errorCode = error.code
    let errorMessage = error.message
    if (errorCode && errorMessage) {
        addToast(errorMessage, {
            appearance: 'error',
            autoDismiss: true,
        })
    }
}

function Header(props) {
    const classes = useStyles()
    const {language} = useSelector(state => state.language)
    const {user} = useSelector(state => state)
    const { addToast } = useToasts()
    const [redirectTo, setRedirectTo] = useState(false)
    let { id } = useParams()

    useEffect(() => {
        if((user.userId && user.isLogged && !user.firstName) || (id !== undefined && user.userId === "")){
            let currentID = user.userId ? user.userId : id
            try {
                Firebase.database.ref(`/users/${currentID}`).once('value').then(function(snapshot) {
                    let userData = snapshot.val() || {}
                    if(userData.firstName){
                        props.addUpdateUser(userData)
                    }else{
                        ErrorMessage({code:404,message:lang.error_user_deleted},addToast)
                        setTimeout(function () {
                            props.addUpdateUser(resetUser)
                            setRedirectTo(true)
                        },500)
                    }
                })
            }catch (error) {
                ErrorMessage(error,addToast)
            }
        }
    },[ ])
    let lang = language === 'EN' ? lang_en_main : lang_am_main

    const signOut = (e) => {
        e.preventDefault()
        Firebase.doSignOut().then(function() {
            props.addUpdateUser(resetUser)
        }).catch(function(error) {
            ErrorMessage(error,addToast)
        })
        setTimeout(function () {
            setRedirectTo(true)
        },500)
    }

    let mob = false

    // after sign out, redirecting the user to the Test page
    if (redirectTo === true) {
        return <Redirect to={`/`}/>
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Logo />
                    {mob &&
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    }
                    <Typography className={`${classes.rootLink} main-menu nav-link-effect`}>
                        <NavLink to="/" color="inherit" className={classes.links}>{lang.home}</NavLink>
                        <NavLink to="/about-us" color="inherit" className={classes.links}>{lang.about_us}</NavLink>
                        <NavLink to="/contact-us" color="inherit" className={classes.links}>{lang.contact_us}</NavLink>

                        <NavLink to="/create-test" color="inherit" className={classes.links}>{lang.create_test}</NavLink>
                        <NavLink to="/tests" color="inherit" className={classes.links}>{lang.tests}</NavLink>
                    </Typography>
                    { user.isLogged && user.firstName ?
                        <div className={"user-title"}>
                            <NavLink to={`/user/${user.userId}`} className={classes.links}>
                                <span className={"user-title-icon"}>
                                    <AccountCircleTwoToneIcon fontSize={'large'} htmlColor={'#cdcdcc'}/>
                                </span>
                                <span className={"user-title-name"}>{user.firstName}</span>
                            </NavLink>
                        </div> :
                        null
                    }
                    <div className={classes.lang}>
                        <Languages />
                    </div>
                    {!user.isLogged ?
                        <NavLink to="/sign-in" className={classes.links}>
                            <Button variant="contained" color="primary">
                                {lang.sign_in}
                            </Button>
                        </NavLink> :
                        <NavLink to="/" className={classes.links} onClick={(e)=>signOut(e)}>
                            <Button variant="contained" color="primary">
                                {lang.sign_out}
                            </Button>
                        </NavLink>
                    }
                </Toolbar>
            </AppBar>
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
        addUpdateUser: (data) => {dispatch(add_update_user_data(data))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Header)