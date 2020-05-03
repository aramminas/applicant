import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import InputLabel from "@material-ui/core/InputLabel"
import Button from '@material-ui/core/Button'
import constants from '../../constants'
import {useToasts} from "react-toast-notifications"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    submit: {
        margin: theme.spacing(2, 16, 2)
    }
}))

const initError = {
    errorName: false,
    errorMail: false,
    errorPhone: false,
    errorMessage: false
}

const initTyping = {
    name: '',
    typingTimeout: 0
}

export default function Form(props) {
    const classes = useStyles()
    const { addToast } = useToasts()
    const [error, setError] = useState(initError)
    const [typing, setTyping] = useState(initTyping)
    const {email_reg,name_reg,phone_reg} = constants
    const {lang} = props

    //clear memory after un mounting a component
    useEffect((typing) => {
        errorToast(error)
        return setTyping((typing) => {
            return {...typing, name: "", typingTimeout: 0}
        })
    },[error])

    const errorToast = (error) => {
        if(error.errorName || error.errorMail || error.errorPhone || error.errorMessage){
            addToast(lang.error_valid_message, {
                appearance: 'error',
                autoDismiss: true,
            })
        }
    }

    const checkVal = (e,type) => {
        e.preventDefault()
        let value = e.target.value

        // every time clean old time out value
        if (typing.typingTimeout) {
            clearTimeout(typing.typingTimeout)
        }

        let typingTimeout =  setTimeout(() => {
            switch (type) {
                case "name":
                    !name_reg.test(value) ?
                        setError((error) => {
                            return {...error,errorName: true}
                        }) :
                        setError((error) => {
                            return {...error,errorName: false}
                        })
                    break
                case "email":
                    !email_reg.test(String(value).toLowerCase()) ?
                        setError((error) => {
                            return {...error,errorMail: true}
                        }) :
                        setError((error) => {
                            return {...error,errorMail: false}
                        })
                    break
                case "phone":
                    !phone_reg.test(value) ?
                        setError(noValid => {
                            return {...noValid, errorPhone: true}
                        }) :
                        setError(noValid => {
                            return {...noValid, errorPhone: false}
                        })
                    break
                case "message":
                    !value || (value && !value.length > 0) ?
                        setError((error) => {
                            return {...error,errorMessage: true}
                        }):
                        setError((error) => {
                            return {...error,errorMessage: false}
                        })
                    break
                default:
                    return error
            }

        }, 2000)
        // set new timeout value
        setTyping(() => {
            return {...typing, name: type, typingTimeout: typingTimeout}
        })
    }

    const sendMessage= (e) => {
        e.preventDefault()
        const{errorName, errorMail, errorPhone, errorMessage} = error
        if(!errorName && !errorMail && !errorPhone && !errorMessage){
            document.querySelector("#message").submit()
            addToast(lang.success_message, {
                appearance: 'success',
                autoDismiss: true,
            })
        }else{
            addToast(lang.error_message, {
                appearance: 'error',
                autoDismiss: true,
            })
        }
    }

    return (
        <form
            id={"message"}
            className={`${classes.root} contact-form`}
            autoComplete="off"
            onSubmit={(e)=>sendMessage(e)}
            action="https://formspree.io/xzbpwkjk"
            method="POST"
        >
            <Grid container>
                <Grid container spacing={3}>
                    <Grid item xs={3} className={"contact-field"}>
                        <InputLabel htmlFor={"full-name"}>{lang.full_name}:</InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            error={error.errorName}
                            required
                            fullWidth
                            id="full-name"
                            name="fullName"
                            placeholder={lang.enter_name}
                            onChange={(e)=>checkVal(e,"name")}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={3} className={"contact-field"}>
                        <InputLabel htmlFor={"email"}>{lang.email}:</InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            error={error.errorMail}
                            required
                            fullWidth
                            id="email"
                            name="email"
                            autoComplete="email"
                            placeholder={lang.enter_email}
                            onChange={(e)=>checkVal(e,"email")}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={3} className={"contact-field"}>
                        <InputLabel htmlFor={"phone"}>{lang.phone}:</InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            error={error.errorPhone}
                            required
                            fullWidth
                            id="phone"
                            name="phone"
                            placeholder={lang.enter_phone}
                            onChange={(e)=>checkVal(e,"phone")}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={3} className={"contact-field"}>
                        <InputLabel htmlFor={"message-inp"}>{lang.message}:</InputLabel>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            id="message-inp"
                            error={error.errorMessage}
                            placeholder={lang.your_message}
                            multiline
                            rows={5}
                            required
                            fullWidth
                            name="message"
                            onChange={(e)=>checkVal(e,"message")}
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    variant="outlined"
                    className={classes.submit}
                    fullWidth
                >
                    {lang.send}
                </Button>
            </Grid>
        </form>
    )
}