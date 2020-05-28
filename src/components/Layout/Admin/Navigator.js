import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {withStyles} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import {
    DashboardOutlined, ChromeReaderModeOutlined,
    AssignmentOutlined, VerticalSplitOutlined
} from '@material-ui/icons'
import { useLocation, NavLink } from 'react-router-dom'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import PeopleIcon from '@material-ui/icons/People'

import {getPathId} from "./adminHelper"

const categories = [
    {
        id: 'dashboard',
        children: [
            {id: 1, childId: 'all_data',link: 'dashboard', icon: <DashboardOutlined/>},
        ],
    },
    {
        id: 'applicants',
        children: [
            {id: 2, childId: 'all_applicants',link: 'applicants', icon: <PeopleIcon/>},
            {id: 3, childId: 'test_results',link: 'test-results', icon: <ChromeReaderModeOutlined/>},
        ],
    },
    {
        id: 'test',
        children: [
            {id: 4, childId: 'tests_',link: 'admin-tests', icon: <AssignmentOutlined/>},
            {id: 5, childId: 'create_test_',link: 'create-test', icon: <VerticalSplitOutlined/>},
        ],
    },
    /*{
        id: 'effects',
        children: [
            {id: 6, childId: 'css_effects',link: 'css-effects', icon: <AssignmentOutlined/>},
        ],
    },*/
]

const styles = (theme) => ({
    categoryHeader: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    categoryHeaderPrimary: {
        color: theme.palette.common.white,
    },
    item: {
        paddingTop: 1,
        paddingBottom: 1,
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover,&:focus': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
    },
    itemCategory: {
        backgroundColor: '000054',
        boxShadow: '0 -1px 0 #404854 inset',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    firebase: {
        fontSize: 24,
        color: theme.palette.common.white,
    },
    itemActiveItem: {
        color: '#4fc3f7',
    },
    itemPrimary: {
        fontSize: 'inherit',
    },
    itemIcon: {
        minWidth: 'auto',
        marginRight: theme.spacing(2),
    },
    divider: {
        marginTop: theme.spacing(2),
    },
})

function Navigator(props) {
    const {pathname}  = useLocation()
    const navIdFromPath = getPathId(pathname.substr(1))

    const {classes,...other} = props
    const {lang} = other
    const [selectedIndex, setSelectedIndex] = React.useState(navIdFromPath)
    const getPage = (event, index) => {
        setSelectedIndex(index)
    }
    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
                    <img src="/images/pages/admin-logo.png" className={"admin-logo"}  alt="logo"/>
                    Applicant
                </ListItem>
                <ListItem className={clsx(classes.item, classes.itemCategory)}>
                    <ListItemIcon className={classes.itemIcon}>
                        <HomeIcon/>
                    </ListItemIcon>
                    <ListItemText
                        classes={{
                            primary: classes.itemPrimary,
                        }}
                    >
                        <NavLink to="/" color="inherit" className={'admin-main-link'}>{lang.main_site}</NavLink>
                    </ListItemText>
                </ListItem>
                {categories.map(({id, children}) => (
                    <React.Fragment key={id}>
                        <ListItem className={classes.categoryHeader}>
                            <ListItemText
                                classes={{
                                    primary: classes.categoryHeaderPrimary,
                                }}
                            >
                                {lang[id]}
                            </ListItemText>
                        </ListItem>
                        {children.map(({id, childId, link, icon}) => (
                            <ListItem
                                key={childId}
                                button
                                className={clsx(classes.item, selectedIndex === id && classes.itemActiveItem)}
                                onClick={(event) => getPage(event, id)}
                            >
                                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                                <NavLink to={`/${link}`} className={"admin-nav-link"}>
                                    <ListItemText
                                        classes={{
                                            primary: classes.itemPrimary,
                                        }}
                                    >
                                        {lang[childId]}
                                    </ListItemText>
                                </NavLink>
                            </ListItem>
                        ))}

                        <Divider className={classes.divider}/>
                    </React.Fragment>
                ))}
            </List>
        </Drawer>
    )
}

Navigator.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Navigator)
