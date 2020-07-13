import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Grid, Paper} from '@material-ui/core'
import {DeleteSweepTwoTone} from '@material-ui/icons'

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

const NothingFound = (props) => {
    const classes = useStyles()
    const {lang} = props

    return (
        <div className={'nothing-found'}>
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={`${classes.paper} nothing-found-content`}>
                            <DeleteSweepTwoTone />
                            <span>{lang.nothing_found}</span>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default NothingFound