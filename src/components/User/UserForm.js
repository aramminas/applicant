import React, {useEffect, useState} from 'react'
import {connect,useSelector} from 'react-redux'
import add_update_user_data from '../../store/actions/userAction'
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    Container
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MuiPhoneNumber from "material-ui-phone-number"
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import Firebase from '../../Firebase'
import { useToasts } from 'react-toast-notifications'

//languages
import lang_en_main from '../../lang/en/main.json'
import lang_am_main from '../../lang/am/main.json'

import './User.scss'
import constants from "../../constants"
import HelpTwoToneIcon from "@material-ui/icons/HelpTwoTone"
import WarningTwoToneIcon from '@material-ui/icons/WarningTwoTone'
import PersonPinTwoToneIcon from '@material-ui/icons/PersonPinTwoTone'
import ReactTooltip from "react-tooltip"
import convertData from "../../helpers/convertData"
import UserLogo from "./UserLogo"
import {NavLink} from "react-router-dom"
import Loader from "react-loader-spinner"

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
    password: false,
    newPassword: false
}
const initUserData = {
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

function SuccessMessage(success,addToast) {
    addToast(success, {
        appearance: 'success',
        autoDismiss: true,
    })
}

function UserForm(props) {
    const classes = useStyles()
    const {language} = useSelector(state => state.language)
    const {user} = useSelector(state => state)

    let lang_m = language === 'EN' ? lang_en_main : lang_am_main
    const {defaultCountry,onlyCountries,
        regions,email_reg,pass_reg,name_reg,
        phone_reg,birthday_reg} = constants

    const { addToast } = useToasts()
    const [noValid, setNoValid] = useState(initValidation)
    const [typing, setTyping] = useState(initTyping)
    const [userData, setUserData] = useState(initUserData)
    const [unknownUser, setUnknownUser] = useState(false)
    const [changeLogPass, setChangeLogPass] = useState(false)
    const [newPass, setNewPass] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())

    //clear memory after un mounting a component
    useEffect((typing) => {
        if(user.userId && user.birthday && user.isLogged){
            setSelectedDate((selectedDate)=>{
                selectedDate = new Date(user.birthday)
                return selectedDate
            })
        }
        if((userData.email === "" && userData.userId === "" && userData.firstName === "") &&
            (user.userId !== "" && user.firstName !== "" && user.email !== "")){
            setUserData(userData=>{
                userData = {
                    ...userData, ...user
                }
                return userData
            })
        }
        return setTyping((typing) => {
            return {...typing, name: "", typingTimeout: 0}
        })
    },[user,user.userId,userData.email,userData.firstName,userData.userId])

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
                case "new-password":
                    !pass_reg.test(value) ?
                        setNoValid((noValid) => {
                            return {...noValid, newPassword: true}
                        }) :
                        setNoValid((noValid) => {
                            return {...noValid, newPassword: false}
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

    const editData = (e) => {
        e.preventDefault()
        let firstName = e.target.firstName.value
        let lastName = e.target.lastName.value
        let email = e.target.email ? e.target.email.value : null
        let phone = e.target.phone.value
        let birthday = e.target.birthday.value
        let password = e.target.password ? e.target.password.value : null
        let newPassword = e.target.newPassword ? e.target.newPassword.value : null

        let now = convertData(new Date())
        if(now === birthday){
            addToast(lang_m.warning_birthday, {
                appearance: 'warning',
                autoDismiss: true
            })
            return
        }

        if (!noValid.firstName && !noValid.lastName && !noValid.email &&
            !noValid.phone && !noValid.birthday) {
            let updateData = {
                                firstName,
                                lastName,
                                phone,
                                birthday,
                                role: 2
                            }
            if (email !== null && email) {
                updateData.email = email
            }
            if (password !== null && password) {
                updateData.password = password
            }
            if (newPassword !== null && newPassword) {
                updateData.newPassword = newPassword
            }

            if(updateData.email && user.email !== updateData.email && updateData.password !== null){
                Firebase.auth
                    .signInWithEmailAndPassword(user.email, updateData.password)
                    .then(function(userCredential) {
                        userCredential.user.updateEmail(updateData.email)
                        props.addUpdateUser({...user,...updateData})
                    }).catch(error=>{
                    ErrorMessage(error,addToast)
                    return true
                })
            }

            if(updateData.newPassword !== null && newPassword !== null){
                let currentUser = Firebase.auth.currentUser
                currentUser.updatePassword(updateData.newPassword).then(function() {
                    SuccessMessage(lang_m.success_update,addToast)
                }).catch(function(error) {
                    ErrorMessage(error,addToast)
                    return true
                })
            }

            Firebase.database.ref(`users/`).child(user.userId)
                .update(updateData,function (error) {
                    if(error){
                        ErrorMessage(error,addToast)
                    }else {
                        SuccessMessage(lang_m.success_update,addToast)
                        props.addUpdateUser({...user,...updateData})
                    }
                })
        } else {
            ErrorMessage(lang_m.error_msg,addToast)
        }
    }

    const logPass = (e) => {
        e.preventDefault()
        setChangeLogPass(!changeLogPass)
    }
    const onNewPass = (e) => {
        e.preventDefault()
        setNewPass(!newPass)
    }

    setTimeout(function () {
        setUnknownUser(true)
    },5000)

    return (
        <Grid container justify="center" className={"user-form-container"}>
            <Grid item>
                <div className="user-form-body card">
                    <Container component="main" className={"default-content-height sign-up-container"} maxWidth="xs">
                        <CssBaseline />
                        <div className={classes.paper}>
                            <UserLogo />
                            <Typography component="h1" variant="h5">
                                {lang_m.user_data}
                            </Typography>
                            {
                                userData.firstName === "" && userData.email === "" ?
                                    <div className={"user-data-loader"}>
                                        {
                                            !unknownUser ?
                                                <Loader type="Rings" color="#0fa4cd" height={150} width={150} /> :
                                                <div className={"unknown-user"}>
                                                    <PersonPinTwoToneIcon fontSize={"large"}/>
                                                    <span>{lang_m.user_not_found}</span>
                                                </div>
                                        }
                                    </div> :
                                    <form className={classes.form} onSubmit={(e)=>editData(e)}>
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
                                                    defaultValue={userData.firstName}
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
                                                    defaultValue={userData.lastName}
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
                                                    value={userData.phone}
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
                                            {
                                                changeLogPass ?
                                                    <>
                                                        <Grid item xs={12}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={1} sm={1}>
                                                                    <WarningTwoToneIcon htmlColor={"#ffcc00"} />
                                                                </Grid>
                                                                <Grid item xs={11} sm={11}>
                                                        <span className={"warning-mail-info"}>
                                                            {lang_m.warning_mail_info}
                                                        </span>
                                                                </Grid>
                                                            </Grid>
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
                                                                defaultValue={userData.email}
                                                            />
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
                                                        {
                                                            newPass ?
                                                                <Grid item xs={12}>
                                                                    <div className={"password-input"}>
                                                                        <TextField
                                                                            error={noValid.newPassword}
                                                                            variant="outlined"
                                                                            required
                                                                            fullWidth
                                                                            name="newPassword"
                                                                            label={lang_m.new_password}
                                                                            type="password"
                                                                            id="new-password"
                                                                            autoComplete="current-password"
                                                                            onChange={(e) => checkVal(e, "new-password")}
                                                                            helperText={noValid.newPassword ? lang_m.incorrect_new_password : null}
                                                                        />
                                                                        <div className={"helper-part"}>
                                                                            {noValid.newPassword ?
                                                                                <>
                                                                                    <HelpTwoToneIcon data-tip={lang_m.incorrect_password_help}/>
                                                                                    <ReactTooltip />
                                                                                </>
                                                                                : null}
                                                                        </div>
                                                                    </div>
                                                                </Grid> :
                                                                null
                                                        }
                                                    </> :
                                                    null
                                            }

                                        </Grid>
                                        <Grid container justify="flex-end" className={'log-pass-title'}>
                                            <Grid item>
                                                {
                                                    !changeLogPass ?
                                                        <NavLink to="/" variant="body2" onClick={(e)=>logPass(e)}>
                                                            {lang_m.change_log_pass}
                                                        </NavLink> :
                                                        <>
                                                            {
                                                                newPass ?
                                                                    <NavLink to="/" variant="body2" onClick={(e)=>onNewPass(e)}>
                                                                        {lang_m.only_login}
                                                                    </NavLink>:
                                                                    <NavLink to="/" variant="body2" onClick={(e)=>onNewPass(e)}>
                                                                        {lang_m.change_password}
                                                                    </NavLink>
                                                            }
                                                            {changeLogPass && <> | </>}
                                                            <NavLink to="/" variant="body2" onClick={(e)=>logPass(e)}>
                                                                {lang_m.hide}
                                                            </NavLink>
                                                        </>
                                                }
                                            </Grid>
                                        </Grid>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                        >
                                            {lang_m.edit}
                                        </Button>
                                    </form>
                            }
                        </div>
                    </Container>
                </div>
            </Grid>
        </Grid>
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

export default connect(mapStateToProps,mapDispatchToProps)(UserForm)