import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import FormContact from './Form'
import {useSelector} from "react-redux"

//languages
import lang_en from '../../lang/en/main.json'
import lang_am from '../../lang/am/main.json'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}))

const ContactForm = () => {
    const classes = useStyles()
    const [classesBg, setClassesBg] = useState(["leave-element"])
    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en : lang_am

    const setBackground = (type) => {
        switch (type) {
            case "hover" :
                setClassesBg(["hover-element"])
                break
            case "leave" :
                setClassesBg(["leave-element"])
                break
            default:
                setClassesBg(classesBg)
        }
    }

    const style = {
        fontSize: "24px",
        top: "34%"
    }

    return (
        <div className={`contact-us-form-container ${classesBg.join(" ")}`}>
            <div className={'contact-form-body'}>
                <div className={`${classes.root} contact-form-container`}
                     onMouseEnter={() => setBackground("hover")}
                     onMouseLeave={() => setBackground("leave")}
                >
                    <Grid container justify="center" className={"contact-form-header"}>
                        <Grid item xs={12}>
                            <h2 style={language === "AM" ? style : null}>{lang.contact_us}</h2>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={1} />
                        <Grid item xs={12} sm={10}>
                            <FormContact lang={lang} />
                        </Grid>
                        <Grid item xs={12} sm={1} />
                    </Grid>
                </div>
            </div>
        </div>
    )
}

export default ContactForm