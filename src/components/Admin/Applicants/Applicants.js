import React, {useState,useEffect} from "react"
import Main from "../Main"
import {useSelector} from "react-redux"
import lang_en from '../../../lang/en/main.json'
import lang_am from '../../../lang/am/main.json'
import Firebase from '../../../Firebase'
import ApplicantsList from "./ApplicantsList"
import PeopleIcon from "@material-ui/icons/People"
import {FilterList} from "@material-ui/icons"
import ReactTooltip from "react-tooltip"
import {Animated} from "react-animated-css"
import ApplicantsFilters from "./ApplicantsFilters"
import NothingFound from "../../NotFound/NothingFound"
import {IconButton} from '@material-ui/core'
import '../Admin.scss'

const initFilters = {
    open: false,
    animate: false,
}

const Applicants = () => {
    const {language} = useSelector(state => state.language)
    const [isFilters, setIsFilters] = useState(initFilters)
    const [pinResults, setPinResults] = useState({})
    const [emptyResult, setEmptyResult] = useState(false)
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
                setPinResults(usersData)
            }else if(usersData === null){
                setUsers({})
            }
        })
    }

    const openFilters = (data) => {
        if(data){
            setIsFilters({ ...isFilters, open: false, animate: true})
            setTimeout(function () {
                setIsFilters({ ...isFilters, open: false, animate: false})
                setUsers(pinResults)
            },1000)
        }else{
            setIsFilters({ ...isFilters, open: true, animate: true})
        }
    }

    const filterResults = (data) => {
        setEmptyResult(false)
        if(data.userName || data.email || data.phone || data.pastTest !== ""){
            let result = {}
            for (let key in pinResults) {
                let getName = data.userName
                let regExpName = new RegExp(getName,"gi")
                let mergeName = `${pinResults[key]?.firstName}, ${pinResults[key]?.lastName}`
                let resName = getName !== "" ? mergeName.match(regExpName) : ""
                let getEmail = data.email
                let regExpEmail = new RegExp(getEmail,"gi")
                let resEmail = getEmail !== "" ? pinResults[key]?.email?.match(regExpEmail) : ""
                let getPhone = data.phone !== "" ? data.phone.replace("+", "") : ""
                let regExpExamDate = new RegExp(getPhone,"gi")
                let resPhone = getPhone !== "" ? pinResults[key]?.phone?.match(regExpExamDate) : ""
                let getPastTest = data.pastTest
                let resPastTest = getPastTest !== "" ? getPastTest : ""
                if (pinResults.hasOwnProperty(key) &&
                    (pinResults[key]?.parameters?.technologyId === +data.tech ||
                        (pinResults[key]?.fullName !== "" && resName) ||
                        (pinResults[key]?.email !== "" && resEmail) ||
                        (pinResults[key]?.phone !== "" && resPhone) ||
                        (pinResults[key].pastTests === resPastTest)
                    )) {
                    result[key] = pinResults[key]
                }
            }
            setUsers(result)
            Object.keys(result).length === 0 && setEmptyResult(true)
        }else{
            setUsers(pinResults)
        }
    }

    return (
        <Main lang={lang}>
            <div className={'admin-applicants'}>
                <div className={"admin-applicants-title"}>
                    <PeopleIcon fontSize={'large'}  htmlColor={"#232f3e"}/>&nbsp; <span>{lang.all_applicants}</span>
                    <IconButton aria-label="filter list" data-tip={lang.filter_list} onClick={()=>openFilters(isFilters.open)}
                        className={`admin-applicants-filter-icon ${isFilters.open ? `rotate` : ``}`}>
                        <FilterList htmlColor={"#232f3e"}/>
                    </IconButton>
                    <ReactTooltip />
                </div>
                <hr/>
                {/* Applicants Filters part */}
                { isFilters.animate &&
                    <Animated animationIn="slideInLeft" animationOut="slideOutLeft" animationInDuration={1000}
                              animationOutDuration={1000} isVisible={isFilters.open}>
                        <ApplicantsFilters lang={lang} filterResults={filterResults}/>
                    </Animated>
                }
                { !emptyResult ?
                    <ApplicantsList users={users} lang={lang} getUserData={getUserData}/> :
                    <NothingFound lang={lang}/>
                }
            </div>
        </Main>
    )
}

export default Applicants
