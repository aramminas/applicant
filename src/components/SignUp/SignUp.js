import React, {useEffect, useState} from 'react'
import {connect,useSelector} from 'react-redux'
import {Redirect} from 'react-router-dom'
import add_update_user_data from '../../store/actions/userAction'
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'
import MuiPhoneNumber from "material-ui-phone-number"
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import Copyright from "../Others/Copyright"
import {NavLink} from "react-router-dom"
import Layout from "../../hoc/layout/Layout"
import Firebase from '../../Firebase'
import { useToasts } from 'react-toast-notifications'

//languages
import lang_en from '../../lang/en/en.json'
import lang_am from '../../lang/am/am.json'
import lang_en_main from '../../lang/en/main.json'
import lang_am_main from '../../lang/am/main.json'

import './SignUp.scss'
import constants from "../../constants"
import HelpTwoToneIcon from "@material-ui/icons/HelpTwoTone"
import ReactTooltip from "react-tooltip"
import formatDate from 'intl-dateformat'
import convertData from "../../helpers/convertData"

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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))
// determine initial data for state
const initValidation = {
    firstName: false,
    lastName: false,
    phone: false,
    email: false,
    birthday: false,
    password: false
}
const initUser = {
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
const initTyping = {
    name: "",
    typingTimeout: 0
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

function SignUp(props) {
    const classes = useStyles()
    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en : lang_am
    let lang_m = language === 'EN' ? lang_en_main : lang_am_main
    const {defaultCountry,onlyCountries,
        regions,email_reg,pass_reg,name_reg,
        phone_reg,birthday_reg} = constants

    const { addToast } = useToasts()
    const [noValid, setNoValid] = useState(initValidation)
    const [typing, setTyping] = useState(initTyping)
    const [user, setUser] = useState(initUser)
    const [redirectTo, setRedirectTo] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())

    //clear memory after un mounting a component
    useEffect((typing) => {
        return setTyping((typing) => {
            return {...typing, name: "", typingTimeout: 0}
        })
    },[])

    const checkVal = (event, type) => {
        let value
        if(type !== "phone" && type !== "birthday"){
            event.preventDefault()
            value = event.target.value
        }else if(type === "birthday"){
            value = new Date(event).getFullYear()
            setSelectedDate(selectedDate => event)
        }else {
            value = event
        }

        // every time clean old time out value
        if (typing.typingTimeout) {
            clearTimeout(typing.typingTimeout)
        }

        let typingTimeout = setTimeout(() => {
            switch (type) {
                case "first-name":
                    !name_reg.test(value) ?
                        setNoValid(noValid => {
                            return {...noValid, firstName: true}
                        }) :
                        setNoValid(noValid => {
                            return {...noValid, firstName: false}
                        })
                    break
                case "last-name":
                    !name_reg.test(value) ?
                        setNoValid(noValid => {
                            return {...noValid, lastName: true}
                        }) :
                        setNoValid(noValid => {
                            return {...noValid, lastName: false}
                        })
                    break
                case "email":
                    !email_reg.test(String(value).toLowerCase()) ?
                        setNoValid(noValid => {
                            return {...noValid, email: true}
                        }) :
                        setNoValid((noValid) => {
                            return {...noValid, email: false}
                        })
                    break
                case "phone":
                    !phone_reg.test(value) ?
                        setNoValid(noValid => {
                            return {...noValid, phone: true}
                        }) :
                        setNoValid(noValid => {
                            return {...noValid, phone: false}
                        })
                    break
                case "birthday":
                    !birthday_reg.test(value) ?
                        setNoValid(noValid => {
                            return {...noValid, birthday: true}
                        }) :
                        setNoValid(noValid => {
                            return {...noValid, birthday: false}
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
        // set new timeout value
        setTyping(() => {
            return {...typing, name: type, typingTimeout: typingTimeout}
        })

    }

    const toSignUp = (e) => {
        e.preventDefault()
        let firstName = e.target.firstName.value
        let lastName = e.target.lastName.value
        let email = e.target.email.value
        let phone = e.target.phone.value
        let birthday = e.target.birthday.value
        let password = e.target.password.value

        let now = convertData(new Date())
        if(now === birthday){
            addToast(lang_m.warning_birthday, {
                appearance: 'warning',
                autoDismiss: true
            })
            return
        }

        if (!noValid.firstName && !noValid.lastName && !noValid.email &&
            !noValid.phone && !noValid.birthday && !noValid.password) {
            Firebase.doCreateUserWithEmailAndPassword(email, password).then(function (data) {
                    if (data && data.user && data.user.uid) {
                        const dateAt = new Date()
                        const month = dateAt.getMonth()
                        const year = dateAt.getFullYear()
                        let userData = {
                            userId: data.user.uid,
                            firstName,
                            lastName,
                            phone,
                            email,
                            birthday,
                            password, // todo need set null
                            month,
                            year,
                            isLogged: true,
                            pastTests: false,
                            createdAt: formatDate(dateAt, 'MM/DD/YYYY'),
                            role: 2
                        }

                        // Add a new user in collection "users" with UID
                        Firebase.database.ref(`users/${userData.userId}`).set(userData, function (error) {
                            if(error){
                                ErrorMessage(error,addToast)
                            }else {
                                setTimeout(()=>{
                                    setRedirectTo(true)
                                },2500)
                            }
                        })
                        // adding user data in the state
                        setUser(user => {
                            return {...user,...userData}
                        })
                        // adding user data in the store
                        props.addUpdateUser(userData)

                        addToast(lang_m.success_sign_up, {
                            appearance: 'success',
                            autoDismiss: true,
                        })

                    }
                }
            ).catch(function (error) {
                ErrorMessage(error,addToast)
            })
        } else {
            addToast(lang_m.error_msg, {
                appearance: 'error',
                autoDismiss: true,
            })
        }
    }
    // after registration, redirecting the user to the Test page
    if (redirectTo === true) {
        return <Redirect to={`/tests/${user.userId}`}/>
    }

    return (
        <Container component="main" className={"default-content-height sign-up-container"} maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {lang_m.sign_up}
                </Typography>
                <form className={classes.form} onSubmit={(e)=>toSignUp(e)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                error={noValid.firstName}
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label={lang_m.first_name}
                                autoFocus
                                onChange={(e) => checkVal(e, "first-name")}
                                helperText={noValid.firstName ? lang_m.incorrect_name : null}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                error={noValid.lastName}
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label={lang_m.last_name}
                                name="lastName"
                                autoComplete="lname"
                                onChange={(e) => checkVal(e, "last-name")}
                                helperText={noValid.lastName ? lang_m.incorrect_name : null}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={noValid.email}
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label={lang_m.email_address}
                                name="email"
                                autoComplete="email"
                                onChange={(e) => checkVal(e, "email")}
                                helperText={noValid.email ? lang_m.incorrect_email : null}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MuiPhoneNumber
                                error={noValid.phone}
                                fullWidth
                                onlyCountries={onlyCountries}
                                defaultCountry={defaultCountry}
                                autoFormat={true}
                                regions={regions}
                                variant="outlined"
                                name="phone"
                                required
                                label={lang_m.phone}
                                onChange={(e) => checkVal(e, "phone")}
                                helperText={noValid.phone ? lang_m.incorrect_phone : null}
                            />
                        </Grid>
                        <Grid container justify="space-around" item xs={12} className={"date-picker-content"}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    error={noValid.birthday}
                                    required
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label={lang_m.birthday}
                                    format="MM/dd/yyyy"
                                    name="birthday"
                                    value={selectedDate}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    onChange={(e) => checkVal(e, "birthday")}
                                    helperText={noValid.birthday ? lang_m.incorrect_birthday : null}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={"password-input"}>
                                <TextField
                                    error={noValid.password}
                                    variant="outlined"
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
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {lang_m.sign_up}
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <NavLink to="/sign-in" variant="body2">
                                {lang_m.have_an_account}
                            </NavLink>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
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

export default connect(mapStateToProps,mapDispatchToProps)(Layout(SignUp))