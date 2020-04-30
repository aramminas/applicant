import React from 'react'
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core/'
import {CopyrightTwoTone, LocationOnTwoTone, TimelapseTwoTone} from '@material-ui/icons/'
import {useSelector} from "react-redux"
import {makeStyles} from "@material-ui/core/styles"
import './styles.scss'

//languages
import lang_en_main from '../../../lang/en/main.json'
import lang_am_main from '../../../lang/am/main.json'


const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "70px",
    },
    buttonsCont: {
        height: "70px",
        background: "rgba(0,0,0,.9)",
    },
    buttonsItems: {
        color: "white",
    }
})

export default function Footer() {
    const classes = useStyles()
    const [value, setValue] = React.useState(0)
    const fullYear = new Date().getFullYear()
    const {language} = useSelector(state => state.language)

    let lang = language === 'EN' ? lang_en_main : lang_am_main

    return (
        <div className={`${classes.root} footer-content`}>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={classes.buttonsCont}
            >
                <BottomNavigationAction label={lang.web_company} icon={<CopyrightTwoTone/>} className={classes.buttonsItems}/>
                <BottomNavigationAction label={fullYear} icon={<TimelapseTwoTone/>} className={classes.buttonsItems}/>
                <BottomNavigationAction label={lang.yerevan_armenia} icon={<LocationOnTwoTone/>} className={classes.buttonsItems}/>
            </BottomNavigation>
        </div>
    )
}