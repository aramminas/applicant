import React from 'react'
import {Grid, Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Alert} from '@material-ui/lab'

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

const TestIsFinished = (props) => {
    const classes = useStyles()
    const {lang} = props

    return (
        <div className={'test-is-finished'}>
            <Grid container spacing={3} className={classes.root} direction="row" justify="space-evenly" alignItems="center">
                <Grid item xs={6}>
                    <div className={"finish-test-title"}>{lang.test_is_finished}</div>
                    <Paper className={`${classes.paper} test-is-finished-content`} elevation={3}>
                        <h4>{lang.finished}</h4>
                        <Alert variant="filled" severity="success">
                            {lang.have_successfully_completed_test}
                        </Alert>
                        <Alert severity="info">{lang.human_resources_team}</Alert>
                        <Alert severity="info">{lang.will_certainly_contact}</Alert>
                        <Alert severity="success">{lang.good_luck}</Alert>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default TestIsFinished