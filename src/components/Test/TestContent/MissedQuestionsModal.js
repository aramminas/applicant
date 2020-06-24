import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core'

export default function MissedQuestionsModal(props) {
    const {lang, open, handleClose, handleFinishTest} = props

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="finish-dialog-title"
            aria-describedby="finish-dialog-description"
        >
            <DialogTitle id="finish-dialog-title">{lang.test_warning}</DialogTitle>
            <DialogContent dividers>
                <p>{lang.warning_finish_test}</p>
                <p>{lang.warning_unanswered_questions}</p>
                <p>{lang.warning_zero_points}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained">
                    {lang.cancel}
                </Button>
                <Button onClick={handleFinishTest} variant="contained" color="primary">
                    {lang.finish_anyway}
                </Button>
            </DialogActions>
        </Dialog>
    )
}