import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DeleteTechnologyTable from './DeleteTechnologyTable'
import {ErrorOutline} from "@material-ui/icons";

export default function DeleteModal(props) {
    const {open, setOpen, techData, lang, getTechData} = props

    const handleClose = () => {
        setOpen(false)
    }

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
                <DialogTitle id="alert-dialog-title">{lang.delete_technology}</DialogTitle>
                <DialogContent dividers>
                    {Object.keys(techData).length !== 0 ?
                        <DeleteTechnologyTable techData={techData} getTechData={getTechData} lang={lang}/> :
                        <span className={"no-found-data-text"}><ErrorOutline htmlColor={"#5e5e5e"}/>&nbsp;{lang.no_data}</span>
                    }
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" size="large" onClick={handleClose}>{lang.close}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
