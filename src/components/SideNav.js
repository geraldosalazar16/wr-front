import React, { useState } from 'react'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';

import DashboardIcon from '@material-ui/icons/Dashboard';
import BusinessIcon from '@material-ui/icons/Business';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export default function SideNav({ content }) {
    const classes = useStyles();
    const [resourceOpen, setResourceOpen] = useState(false);
    const user = useSelector(state => state.auth.user);
    let open = useSelector(state => state.sidenav.menuOpen);
    console.log('open', open)

    const handleClickRM = () => {
        setResourceOpen(!resourceOpen);
    }

    const hoItems = user.roleId !== 3 ? (
        <div>
            <ListItem button onClick={handleClickRM}>
                <ListItemIcon>
                    <PeopleAltIcon />
                </ListItemIcon>
                <ListItemText primary="Resource Management" />
                {resourceOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={resourceOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button className={classes.nested} component={Link} to="/employee-list">
                        <ListItemIcon>
                            <AccountBoxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Employee Management" component={Link} to="/employee-list" />
                    </ListItem>
                </List>
            </Collapse>
        </div>
    ) : <div></div>;
    const listItems = (
        <div>
            <ListItem button key='dashboard' component={Link} to="/dashboard">
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button key='branch_management' component={Link} to="/branch-management">
                <ListItemIcon><BusinessIcon /></ListItemIcon>
                <ListItemText primary={user.roleId !== 3 ? 'Branch Management' : 'Customer Management'} />
            </ListItem>
            {hoItems}
        </div>
    );

    return (
        <Drawer
            variant="permanent"
            open={true}
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
        >
            <Toolbar />
            <List>
                {listItems}
            </List>
        </Drawer>
    )
}