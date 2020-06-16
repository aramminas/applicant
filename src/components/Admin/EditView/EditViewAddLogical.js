import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Grid, Paper ,Button}from '@material-ui/core'
import {AddLocationOutlined, EditLocationOutlined} from "@material-ui/icons"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}))

export default function EditViewAddLogical(props) {
    const classes = useStyles()
    const {lang, changingQuestion, handleAddEditQuestion, cancelEditQuestion} = props

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <div className={"admin-edit-view-add-title"}>
                    <h2>{lang.logical_question}</h2>
                </div>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        xs=12
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>xs=6</Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>xs=6</Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>xs=3</Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>xs=3</Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>xs=3</Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>xs=3</Paper>
                </Grid>
                <Grid container justify="center">
                    <Grid item xs={10}>
                        <hr/>
                    </Grid>
                    <Grid item xs={4}>
                        <div className={"admin-edit-view-add-btn"}>
                            <Button variant="outlined" onClick={()=>cancelEditQuestion("logical")} >{lang.cancel}</Button>
                            {Object.keys(changingQuestion).length > 0 ?
                                <Button variant="outlined" color="primary" onClick={()=>handleAddEditQuestion("logical", "edit")}>
                                    {lang.edit} <EditLocationOutlined />
                                </Button>:
                                <Button variant="outlined" color="primary" onClick={()=>handleAddEditQuestion("logical", "add")}>
                                    {lang.add} <AddLocationOutlined/>
                                </Button>
                            }
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}