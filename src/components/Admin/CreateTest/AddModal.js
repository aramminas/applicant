import React, {useState} from 'react'
import {withStyles, makeStyles} from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import {PanoramaOutlined} from '@material-ui/icons'
import {useToasts} from 'react-toast-notifications'
import SaveIcon from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import {Animated} from "react-animated-css"
import Firebase from '../../../Firebase'

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
})

const useStyles = makeStyles((theme) => ({
    formRoot: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    fileBtn: {
        height: '56px',
        color: '#757575',
        fontSize: '1rem',
        '&:hover': {
            backgroundColor: 'white',
            borderColor: 'black'
        }
    },
    textInput: {
        width: '80%'
    },
    fileInput: {
        display: 'none'
    }

}))

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    )
})

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent)

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions)

const ColorButton = withStyles((theme) => ({
    root: {
        color:'white',
        backgroundColor: green['A700'],
        '&:hover': {
            backgroundColor: green[500],
        },
    },
}))(Button)

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

const initFile = {
    id: null,
    selectedFile: null,
    file: null,
    techName: null,
    name: null,
    emptyName: false
}

export default function AddModal(props) {
    const { addToast } = useToasts()
    const classes = useStyles()
    const [fileData,setFileData] = useState(initFile)
    const {open, handleClose, lang, changeLoader, getTechData} = props

    const setImage = e => {
        let file = e.target.files[0]
        const reader = new FileReader()

        if(file !== undefined &&
            (file.type === "image/jpeg" || file.type === "image/png" ||
                file.type === "image/jpg" || file.type === "image/gif")){
            reader.readAsDataURL(file)
            reader.onloadend = (e) => {
                setFileData(fileData=>{
                    // return {...fileData,selectedFile: reader.result, name: file.name, file}
                    return {...fileData,selectedFile: reader.result, name: `${Date.now()}_${file.name}`, file}
                })
            }
        }else if(file !== undefined){
            addToast(lang.image_warning, {
                appearance: 'warning',
                autoDismiss: true
            })
        }
    }

    const checkTechName = e => {
        let techName = e.target.value
        if(techName?.trim() !== ""){
            setFileData(fileData=>{
                return {...fileData,emptyName: false,techName}
            })
        }
    }

    const addNewTech = (e) => {
        e.preventDefault()
        if(fileData.name?.trim() === ""){
            setFileData(fileData=>{
                return {...fileData,emptyName: true}
            })
        }
        changeLoader(true)
        if(fileData.file){
            let storageRef = Firebase.storage.ref(`storage/images/technology`)
            let uploadTask = storageRef.child(`/${fileData.name}`).put(fileData.file)
            uploadTask.on('state_changed', function(snapshot){
                let techId = snapshot?.metadata?.generation || null
                if(snapshot?.metadata?.generation){
                    setFileData(fileData=>{
                        return {...fileData,id: techId}
                    })
                }
            }, function(error) {
                console.log('error',error)
            }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    if(downloadURL){
                        let techData = {
                            id: fileData.id,
                            name: fileData.techName,
                            iconName: fileData.name,
                            icon: downloadURL,
                            isIcon: true
                        }
                        addNewTechnology(techData)
                    }
                })
            })
        }else {
            let techData = {
                id: null,
                name: fileData.techName,
                icon: "/images/pages/technology_default.png",
                isIcon: false,
                iconName: "",
            }
            addNewTechnology(techData)
        }

    }

    const addNewTechnology = data =>{
        if(!data.id){
            data.id = Date.now()
        }
        // Add a new technology in collection "technology" with UID
        Firebase.database.ref(`technology/${data.id}`).set(data, function (error) {
            if(error){
                ErrorMessage(error,addToast)
            }else {
                changeLoader(false)
                handleClose()
                setFileData(initFile)
                addToast(lang.success_added, {
                    appearance: 'success',
                    autoDismiss: true,
                })
                getTechData()
            }
        })
    }

    return (
        <div>
            <Dialog onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    fullWidth
                    maxWidth = {'sm'}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    { lang.add_new_technology }
                </DialogTitle>
                <DialogContent dividers>
                    <form id={"newTechForm"} className={classes.formRoot} autoComplete="off"
                          onSubmit={(e)=>addNewTech(e)}>
                        <TextField
                            label={lang.technology_name}
                            helperText={fileData.emptyName && lang.technology_name_required}
                            required
                            error={fileData.emptyName}
                            variant="outlined"
                            name={"techName"}
                            className={classes.textInput}
                            onChange={e=>checkTechName(e)}
                        />
                        <br/>
                        <Button variant="outlined" component="label" className={classes.fileBtn}>
                            <PanoramaOutlined htmlColor={fileData.name ? "#4DBD33" : "#797979"}/>&nbsp;
                            {lang.select_icon}
                            <input
                                type="file"
                                name={"techImg"}
                                className={classes.fileInput}
                                onChange={(e)=>setImage(e)}
                            />
                        </Button>
                        {fileData.selectedFile ?
                            <div className={"technology-selected-image"}>
                                <Animated animationIn="zoomInLeft" animationOut="fadeOutDown" animationInDuration={1500} animationOutDuration={1500} isVisible={true}>
                                    <figure className={"selected-file"}>
                                        <img src={fileData.selectedFile} alt="tech"/>
                                    </figure>
                                </Animated>
                            </div>
                            :
                            null
                        }
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" size="large" onClick={handleClose}>{lang.close}</Button>
                    <ColorButton
                        variant="contained"
                        color="primary"
                        className={classes.margin}
                        size="large"
                        startIcon={<SaveIcon />}
                        type="submit" form="newTechForm"
                    >
                        {lang.save}
                    </ColorButton>
                </DialogActions>
            </Dialog>
        </div>
    )
}
