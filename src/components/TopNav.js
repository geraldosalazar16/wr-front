import React, { useState } from 'react'
import { signOut } from '../store/actions/authActions'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import logo from '../assets/images/logo.png'
import { toggle } from '../store/actions/sidenavActions'
import CloseIcon from '@material-ui/icons/Close';
import {useHistory} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import { useDispatch, useSelector } from "react-redux";

// import './TopNav.css';

const useStyles = makeStyles((theme) => ({
	root: {
	  flexGrow: 1,
	  zIndex: theme.zIndex.drawer + 1,
	},
	menuButton: {
	  marginRight: theme.spacing(2),
	  color: '#ffffff'
	},
	title: {
	  flexGrow: 1,
	},
	logo: {
		width: '20%',
	}
}));

export default function TopNav() {

	const classes = useStyles();

	const [anchorEl, setAnchorEl] = useState(null);
	const user = useSelector(state => state.auth.user);
	const menuOpen = useSelector(state => state.sidenav.menuOpen);
	let history = useHistory();
	const dispatch = useDispatch();

	const handleSignOut = (e) => {
		e.preventDefault();
		setAnchorEl(null);
		dispatch(signOut());
	}

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuNavigation = () => {
		setAnchorEl(null);
		const route = user.roleId === 3 ? "/branch-user-profile" : "/user-profile";
		history.push(route);
	}

	const handleDrawerClick = () => {
		dispatch(toggle());
	}

	const redirectDasboard = () => {
		history.push("/dasboard")
	}

	return (
		<AppBar position="fixed" className={classes.root}>
			<Toolbar>
				<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleDrawerClick}>
					{menuOpen ? <CloseIcon /> : <MenuIcon />}
				</IconButton>
				<img className={classes.logo} src={logo} alt="" onClick={(e) => redirectDasboard()} />

				<Typography variant="h6" className={classes.title}>
				</Typography>

				<Button className={classes.menuButton} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} endIcon={<KeyboardArrowDownIcon />}>
					Welcome {user.firstName}
				</Button>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem onClick={handleMenuNavigation}>
						Edit Profile
						</MenuItem>
					<MenuItem onClick={handleSignOut}>Logout</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	)
}