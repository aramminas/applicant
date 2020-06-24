import React, {useEffect, useState} from 'react'
import {connect,useSelector} from 'react-redux'
import add_update_user_data from "../../store/actions/userAction"
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container
} from '@material-ui/core/'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import HelpTwoToneIcon from '@material-ui/icons/HelpTwoTone'
import {NavLink, Redirect, useParams} from 'react-router-dom'
import {makeStyles} from '@material-ui/core/styles'
import Layout from '../../hoc/layout/Layout'
import Copyright from "../Others/Copyright"
import './SignIn.scss'
import constants from '../../constants'
import ReactTooltip from "react-tooltip"
import {useToasts} from "react-toast-notifications"
import Firebase from "../../Firebase"
//languages
import lang_en from '../../lang/en/en.json'
import lang_am from '../../lang/am/am.json'
import lang_en_main from '../../lang/en/main.json'
import lang_am_main from '../../lang/am/main.json'

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

const initUser = {
    userId: '',
    isLogged: false,
    role: 2
}

function SignIn(props) {
    const { addToast } = useToasts()
    const [noValid, setNoValid] = useState(initValidation)
    const [typing, setTyping] = useState(initTyping)
    const [user, setUser] = useState(initUser)
    const [redirectTo, setRedirectTo] = useState(false)
    let { testId } = useParams()

    //clear memory after un mounting a component
    useEffect((typing) => {
        return setTyping((typing) => {
            return {...typing, name: "", typingTimeout: 0}
        })
    },[])

    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en : lang_am
    let lang_m = language === 'EN' ? lang_en_main : lang_am_main
    const {email_reg,pass_reg} = constants

    const classes = useStyles()

    const toSignIn = (e) => {
        e.preventDefault()
        let email = e.target.email.value
        let password = e.target.password.value

        if (!noValid.email && !noValid.password) {
            Firebase.doSignInWithEmailAndPassword(email,password).then(function (data) {
                if (data && data.user && data.user.uid) {
                    let userData = {
                        userId: data.user.uid,
                        testId: testId ? testId : '',
                        isLogged: true
                    }
                    // adding user data in the state
                    setUser(user => {
                        return {...user,...userData}
                    })
                    // adding user data in the store
                    props.addUpdateUser(userData)
                    // adding test id and user id in the local storage
                    if(testId && testId !== ""){
                        localStorage.setItem('testId', testId)
                        localStorage.setItem('userId', userData.userId)
                    }
                    setTimeout(()=>{
                        setRedirectTo(true)
                    },500)
                }
            }).catch(function (error) {
                let errorCode = error.code
                let errorMessage = error.message
                if (errorCode && errorMessage) {
                    addToast(errorMessage, {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                }
            })
        }else{
            addToast(lang_m.error_msg, {
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

    // after sign in, redirecting the user to the Test page
    if (redirectTo === true) {
        return <Redirect to={`/test/${user.userId}`}/>
    }

    return (
        <Container component="main" maxWidth="xs" className="sign-in-container">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    {lang_m.sign_in}
                </Typography>
                <form className={classes.form} onSubmit={(e) => toSignIn(e)}>
                    <TextField
                        error={noValid.email}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label={lang_m.email_address}
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => checkVal(e, "email")}
                        helperText={noValid.email ? lang_m.incorrect_email : null}
                    />
                    <div className={"password-input"}>
                        <TextField
                            error={noValid.password}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={lang_m.password}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => checkVal(e, "password")}
                            helperText={noValid.password ? lang_m.incorrect_password : null}
                        />
                        <div className={"helper-part"}>
                            {noValid.password ?
                                <>
                                    <HelpTwoToneIcon data-tip={lang_m.incorrect_password_help}/>
                                    <ReactTooltip />
                                </>
                                : null}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {lang_m.sign_in}
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <NavLink to="/sign-up" variant="body2">
                                {lang_m.no_account}
                            </NavLink>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright lang={lang} lang_m={lang_m}/>
            </Box>
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
        addUpdateUser: (data) => {dispatch(add_update_user_data(data))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Layout(SignIn))

