import React,{useState} from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Toolbar from '@material-ui/core/Toolbar'
import {withStyles} from '@material-ui/core/styles'
import {NavLink, Redirect} from "react-router-dom"
import Firebase from "../../../Firebase"
import Badge from '@material-ui/core/Badge'
import {useToasts} from "react-toast-notifications"
import {useSelector} from 'react-redux'

const lightColor = 'rgba(255, 255, 255, 0.7)'

const styles = (theme) => ({
    header: {
        height: 60,
    },
    headerToolbar: {
        height: '100%',
    },
    secondaryBar: {
        zIndex: 0,
    },
    menuButton: {
        marginLeft: -theme.spacing(1),
    },
    iconButtonAvatar: {
        padding: 4,
    },
    link: {
        textDecoration: 'none',
        color: lightColor,
        fontSize: "16px",
        '&:hover': {
            color: theme.palette.common.white,
            textDecoration: 'none',
        },
    },
    button: {
        borderColor: lightColor,
    },
})


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
    const {admin} = useSelector(state => state)
    const adminFb = Firebase.database.ref(`/admin/${admin.adminId}`)
    const {classes, onDrawerToggle, lang} = props
    const [count,setCount] = useState(0)
    const [redirectTo, setRedirectTo] = useState(false)
    const { addToast } = useToasts()
    const signOut = (e) => {
        e.preventDefault()
        Firebase.doSignOut().then(function() {
            localStorage.clear()
            adminFb.update({status: false})
        }).catch(function(error) {
            ErrorMessage(error,addToast)
        })
        setTimeout(function () {
            setRedirectTo(true)
        },500)
    }

    // after sign out, redirecting the user to the Test page
    if (redirectTo === true) {
        return <Redirect to={`/admin`}/>
    }

    return (
        <React.Fragment>
            <AppBar color="primary" position="sticky" elevation={0} className={classes.header}>
                <Toolbar className={classes.headerToolbar}>
                    <Grid container spacing={1} alignItems="center">
                        <Hidden smUp>
                            <Grid item>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={onDrawerToggle}
                                    className={classes.menuButton}
                                >
                                    <MenuIcon/>
                                </IconButton>
                            </Grid>
                        </Hidden>
                        <Grid item xs/>
                        <Grid item>
                            <Badge badgeContent={count} className={"admin-new-ap"} color="secondary">
                                <NotificationsIcon color={'inherit'} />
                            </Badge>
                        </Grid>
                        <Grid item>
                            <NavLink to="/" className={classes.link} onClick={(e)=>signOut(e)}>
                                {lang.sign_out}
                            </NavLink>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    )
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    onDrawerToggle: PropTypes.func.isRequired,
}

export default withStyles(styles)(Header)
