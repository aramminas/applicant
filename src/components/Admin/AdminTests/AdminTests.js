import React, {useState, useEffect} from 'react'
import Main from "../Main"
import {useSelector} from "react-redux"
import {useToasts} from 'react-toast-notifications'
import FirebaseFunctions from '../../../helpers/FirebaseFunctions'
import {AssignmentOutlined} from '@material-ui/icons'
import {Animated} from 'react-animated-css'
import AdminTestsList from './AdminTestsList'
import DeleteTestModal from './DeleteTestModal'
import lang_en from '../../../lang/en/main.json'
import lang_am from '../../../lang/am/main.json'
import '../Admin.scss'
import Loader from "react-loader-spinner";

const AdminTests = () => {
    const {addToast} = useToasts()
    const {language} = useSelector(state => state.language)
    const [tests, setTests] = useState([])
    const [open, setOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [technology, setTechnology] = useState([])
    const [addLoader,setAddLoader] = useState(false)
    let lang = language === 'EN' ? lang_en : lang_am

    useEffect(() => {
        getTestData()
        getTechData()
    },[])

    const getTestData = () => {
        FirebaseFunctions.getTestData().then( data =>{
            setTests(data)
        }).catch(error => {
            setTests([false])
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true,
            })
        })
    }

    const getTechData = () => {
        FirebaseFunctions.getTechData().then(data => {
            setTechnology(data)
        }).catch(error => {
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true
            })
        })
    }

    const handleClickOpen = (id) => {
        setDeleteId(id)
        setOpen(true)
    }

    const handleClose = () => {
        setDeleteId('')
        setOpen(false)
    }

    const changeLoader = (data) => {
        setAddLoader(data)
    }

    const deleteTest = () => {
        handleClose()
        changeLoader(true)

        FirebaseFunctions.removeTest(deleteId).then(data => {
            changeLoader(false)
            if(data.result){
                addToast(lang.test_deleted, {
                    appearance: 'success',
                    autoDismiss: true,
                })
                getTestData()
            }
        }).catch(error => {
            changeLoader(false)
            setDeleteId('')
            addToast(error.message, {
                appearance: 'error',
                autoDismiss: true,
            })
        })
    }

    return (
        <Main lang={lang}>
            <div className={'admin-tests'}>
                <div className={"admin-tests-title"}>
                    <AssignmentOutlined fontSize={'large'}  htmlColor={"#232f3e"}/>&nbsp; <span>{lang.all_tests}</span>
                </div>
                <hr/>
                { tests.length > 0 ?
                    !tests[0]
                        ?
                        <div className={"admin-tests-empty-data"}>
                            <div className={"admin-activity-loader"}>
                                <span className={"admin-empty-database-data"}>{lang.empty_database_data}</span>
                            </div>
                        </div>
                        :
                        /* Tests data table */
                        <Animated animationIn="zoomIn" animationOut="fadeOut" isVisible={true}>
                            <AdminTestsList tests={tests} technology={technology} lang={lang} handleClickOpen={handleClickOpen}/>
                        </Animated>
                    :
                    <div className={"admin-tests-empty-data"}>
                        <figure className={"admin-activity-loader"}>
                            <img src="/images/gifs/load.gif" alt="loader"/>
                            <span>{lang.data_loading}. . .</span>
                        </figure>
                    </div>
                }
            </div>
            <DeleteTestModal lang={lang} open={open} handleClose={handleClose} deleteTest={deleteTest}/>
            {
                addLoader ?
                    <div className={"admin-loader"}>
                        <Loader type="RevolvingDot" color="#031433" height={100} width={100}/>
                    </div>:
                    null
            }
        </Main>
    )
}

export default AdminTests