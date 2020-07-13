import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@material-ui/core'

const useStyles = makeStyles(() => ({
    btn: {
        paddingRight: 25,
        paddingBottom: 10,
    },
}))

export default function GetLinkModal(props) {
    const classes = useStyles()
    const {lang, id, open, handleClose} = props
    const location = window.location.hostname

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="get-link-dialog-title"
            aria-describedby="get-link-dialog-description"
            fullWidth
            maxWidth = {'sm'}
        >
            <DialogTitle id="get-link-dialog-title">{lang.get_link}</DialogTitle>
            <DialogContent>
                <DialogContentText id="get-link-dialog-description">
                    {lang.copy_test_link}
                </DialogContentText>
                <TextField label={lang.test_link} fullWidth variant="outlined" readOnly
                    value={`${location}/sign-in/${id}`}
                />
            </DialogContent>
            <DialogActions className={classes.btn}>
                <Button onClick={handleClose} color="default" variant="outlined">
                    {lang.close}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
