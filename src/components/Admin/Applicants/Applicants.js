import React, {useState,useEffect} from "react"
import Main from "../Main"
import {useSelector} from "react-redux"
import lang_en from '../../../lang/en/main.json'
import lang_am from '../../../lang/am/main.json'
import Firebase from '../../../Firebase'
import ApplicantsList from "./ApplicantsList"
import PeopleIcon from "@material-ui/icons/People"
import '../Admin.scss'

const Applicants = () => {
    const {language} = useSelector(state => state.language)
    let lang = language === 'EN' ? lang_en : lang_am
    const [users, setUsers] = useState({})

    useEffect(() => {
        getUserData()
    },[])

    const getUserData = () => {
        Firebase.database.ref(`/users`).once('value').then(function(snapshot) {
            let usersData = snapshot.val()
            if(usersData && Object.keys(usersData).length > 0){
                setUsers(usersData)
            }else if(usersData === null){
                setUsers({})
            }
        })
    }

    return (
        <Main lang={lang}>
            <div className={'admin-applicants'}>
                <div className={"admin-applicants-title"}>
                    <PeopleIcon fontSize={'large'}  htmlColor={"#232f3e"}/>&nbsp; <span>{lang.all_applicants}</span>
                </div>
                <hr/>
                <ApplicantsList users={users} lang={lang} getUserData={getUserData}/>
            </div>
        </Main>
    )
}

export default Applicants
