import React, {useEffect, useState} from 'react'
import {connect, useSelector} from 'react-redux'
import set_admin_data from "../../store/actions/setAdminAction"
import sha256 from 'crypto-js/sha256'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Typography,
    Container
} from '@material-ui/core/'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import {Redirect} from 'react-router-dom'
import {makeStyles} from '@material-ui/core/styles'
import {useToasts} from "react-toast-notifications"
import './Admin.scss'
import constants from '../../constants'
import Firebase from "../../Firebase"

//languages
import lang_en from '../../lang/en/admin.json'
import lang_am from '../../lang/am/admin.json'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

const initValidation = {
    email: false,
    password: false
}
const initTyping = {
    name: "",
    typingTimeout: 0
}

function AdminLogin(props) {
    const { addToast } = useToasts()
    const [noValid, setNoValid] = useState(initValidation)
    const [typing, setTyping] = useState(initTyping)
    const [redirectTo, setRedirectTo] = useState(false)
    const {email_reg,pass_reg} = constants
    const classes = useStyles()
    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en : lang_am

    //clear memory after un mounting a component
    useEffect((typing) => {
        return setTyping((typing) => {
            return {...typing, name: "", typingTimeout: 0}
        })
    },[])

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

    const toLogIn = (e) => {
        e.preventDefault()
        let email = e.target.email.value
        let password = e.target.password.value

        if (!noValid.email && !noValid.password) {
            Firebase.doSignInWithEmailAndPassword(email,password).then(function (data) {
                if (data && data.user && data.user.uid) {
                    try {
                        let adminData = {
                            adminId: data.user.uid,
                            isLogged: true
                        }

                        Firebase.database.ref(`/admin/${adminData.adminId}`).once('value').then(function(snapshot) {
                            let dataAdmin = snapshot.val() || {}
                            // for verify the encrypted password
                            const hashDigest = sha256(password)
                            const hmacDigest = Base64.stringify(hmacSHA512( hashDigest, "key"))

                            if(dataAdmin && dataAdmin.name && dataAdmin.key === hmacDigest){
                                // adding admin data in the store
                                props.adminData(adminData)
                                setTimeout(()=>{
                                    setRedirectTo(true)
                                },500)
                            }else{
                                Firebase.doSignOut().then(function() {
                                    console.log('Panda 🐼 No access!')
                                }).catch(function(error) {
                                    ErrorMessage(error,addToast)
                                })
                                addToast(lang.admin_error_login, {
                                    appearance: 'error',
                                    autoDismiss: true,
                                })
                            }
                        })
                    }catch (error) {
                        ErrorMessage(error,addToast)
                    }
                }
            }).catch(function (error) {
                ErrorMessage(error,addToast)
            })
        }else{
            addToast(lang.incorrect_data, {
                appearance: 'error',
                autoDismiss: true,
            })
        }
    }

    const checkVal = (event, type) => {
        event.preventDefault()
        let value = event.target.value
        // every time clean old time out value
        if (typing.typingTimeout) {
            clearTimeout(typing.typingTimeout)
        }

        let typingTimeout = setTimeout(() => {
            switch (type) {
                case "email":
                    !email_reg.test(String(value).toLowerCase()) ?
                        setNoValid(noValid => {
                            return {...noValid, email: true}
                        }) :
                        setNoValid((noValid) => {
                            return {...noValid, email: false}
                        })
                    break
                case "password":
                    !pass_reg.test(value) ?
                        setNoValid((noValid) => {
                            return {...noValid, password: true}
                        }) :
                        setNoValid((noValid) => {
                            return {...noValid, password: false}
                        })
                    break
                default:
                    return noValid
            }
        }, 1000)
        // set new time out value
        setTyping(() => {
            return {...typing, name: type, typingTimeout: typingTimeout}
        })

    }

    // after login, redirecting the admin to the Dashboard page
    if (redirectTo === true) {
        return <Redirect to={"/dashboard"}/>
    }

    return (
        <Container component="main" maxWidth="xs" className="log-in-container">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h5" variant="h5">
                    {`Login`}
                </Typography>
                <form className={classes.form} onSubmit={(e) => toLogIn(e)}>
                    <TextField
                        error={noValid.email}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label={`login`}
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => checkVal(e, "email")}
                        helperText={noValid.email ? `incorrect email` : null}
                    />
                    <div className={"password-input"}>
                        <TextField
                            error={noValid.password}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={`password`}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => checkVal(e, "password")}
                            helperText={noValid.password ? `incorrect password` : null}
                        />
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {`Login`}
                    </Button>
                </form>
            </div>
        </Container>
    )
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        adminData: (data) => {dispatch(set_admin_data(data))},
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AdminLogin)

