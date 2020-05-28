import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {createMuiTheme, ThemeProvider, withStyles} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Hidden from '@material-ui/core/Hidden'
import Navigator from '../Layout/Admin/Navigator'
import Header from '../Layout/Admin/Header'
import Copyright from "../Others/Copyright"
import Firebase from "../../Firebase"
import {Redirect} from "react-router-dom"

let theme = createMuiTheme({
    palette: {
        primary: {
            light: '#63ccff',
            main: '#009be5',
            dark: '#006db3',
        },
    },
    typography: {
        h5: {
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: 0.5,
        },
    },
    shape: {
        borderRadius: 8,
    },
    props: {
        MuiTab: {
            disableRipple: true,
        },
    },
    mixins: {
        toolbar: {
            minHeight: 48,
        },
    },
})

theme = {
    ...theme,
    overrides: {
        MuiDrawer: {
            paper: {
                backgroundColor: 'rgba(0, 0, 51, 1)'
            },
        },
        MuiButton: {
            label: {
                textTransform: 'none',
            },
            contained: {
                boxShadow: 'none',
                '&:active': {
                    boxShadow: 'none',
                },
            },
        },
        MuiTabs: {
            root: {
                marginLeft: theme.spacing(1),
            },
            indicator: {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                backgroundColor: theme.palette.common.white,
            },
        },
        MuiTab: {
            root: {
                textTransform: 'none',
                margin: '0 16px',
                minWidth: 0,
                padding: 0,
                [theme.breakpoints.up('md')]: {
                    padding: 0,
                    minWidth: 0,
                },
            },
        },
        MuiIconButton: {
            root: {
                padding: theme.spacing(1),
            },
        },
        MuiTooltip: {
            tooltip: {
                borderRadius: 4,
            },
        },
        MuiDivider: {
            root: {
                backgroundColor: '#404854',
            },
        },
        MuiListItemText: {
            primary: {
                fontWeight: theme.typography.fontWeightMedium,
            },
        },
        MuiListItemIcon: {
            root: {
                color: 'inherit',
                marginRight: 0,
                '& svg': {
                    fontSize: 20,
                },
            },
        },
        MuiAvatar: {
            root: {
                width: 32,
                height: 32,
            },
        },
    },
}

const drawerWidth = 256

const styles = {
    root: {
        display: 'flex',
        minHeight: '100vh',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    app: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        flex: 1,
        padding: theme.spacing(6, 4),
        background: '#eaeff1',
    },
    footer: {
        padding: theme.spacing(2),
        background: '#eaeff1',
    },
}

function Main(props) {
    const adminId = localStorage.getItem('admin-id')
    const adminStatus = localStorage.getItem('admin-status')
    const [redirectTo, setRedirectTo] = useState(false)
    const adminFb = Firebase.database.ref(`/admin/${adminId}`)
    useEffect(()=>{
        if(adminId && adminId.length > 0 && +adminStatus === 1){
            adminFb.once('value').then(function(snapshot) {
                let dataAdmin = snapshot.val() || {}
                if(dataAdmin && !dataAdmin.status){
                    localStorage.clear()
                    setRedirectTo(true)
                }
            })
        }else {
            setRedirectTo(true)
        }
    },[adminFb,adminId,adminStatus])

    const {classes, children, lang} = props
    const [mobileOpen, setMobileOpen] = React.useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    // after sign out, redirecting the user to the Test page
    if (redirectTo === true) {
        return <Redirect to={`/admin`}/>
    }

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CssBaseline/>
                <nav className={classes.drawer}>
                    <Hidden smUp implementation="js">
                        <Navigator
                            PaperProps={{style: {width: drawerWidth}}}
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            lang={lang}
                        />
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Navigator PaperProps={{style: {width: drawerWidth}}} lang={lang}/>
                    </Hidden>
                </nav>
                <div className={classes.app}>
                    <Header onDrawerToggle={handleDrawerToggle} lang={lang}/>
                    <main className={classes.main}>
                        {
                           children
                        }
                    </main>
                    <footer className={classes.footer}>
                        <Copyright lang_m={lang} />
                    </footer>
                </div>
            </div>
        </ThemeProvider>
    )
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Main)
