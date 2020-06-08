import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'

export default function DeleteTestModal(props) {
    const {lang, open, handleClose, deleteTest} = props

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-delete-dialog-title"
            aria-describedby="alert-empty-dialog-description"
        >
            <DialogTitle id="alert-delete-dialog-title">{lang.delete_test}.</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-delete-dialog-description">
                    {lang.delete_test_answer}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="default">
                    {lang.close}
                </Button>
                <Button onClick={deleteTest} color="secondary">
                    {lang.delete}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
