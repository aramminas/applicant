import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'

export default function EmptyDataModal(props) {
    const {lang, open, handleClose, handleComplete, activeStep} = props

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-empty-dialog-title"
            aria-describedby="alert-empty-dialog-description"
        >
            <DialogTitle id="alert-empty-dialog-title">{lang.empty_data}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-empty-dialog-description">
                    {lang.empty_data_continue_desc}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="default">
                    {lang.close}
                </Button>
                <Button onClick={()=>handleComplete(activeStep,"empty")} color="primary">
                    {lang.complete_step}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
