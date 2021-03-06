import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function DeleteModal(props) {
    const {open, id, lang, handleDeleteQuestion, handleClose} = props

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth = {'sm'}
            >
                <DialogTitle id="alert-dialog-title">{lang.delete_title}</DialogTitle>
                <DialogContent dividers>
                    <span className={"delete-question-desc"}>{lang.delete_question_desc}</span>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" size="large" onClick={handleClose}>{lang.close}</Button>
                    <Button variant="outlined" color="secondary" size="large" onClick={()=>handleDeleteQuestion(id)}>{lang.delete}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
