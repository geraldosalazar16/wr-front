import React, { Component } from 'react';
import logo from '../../assets/images/logo.png'
import './Login.css'
import { connect } from 'react-redux'
import { login, signUp, clearErrors } from '../../store/actions/authActions'
import { getDesignationsAction } from '../../store/actions/designationActions'
import { setCurrentTab } from '../../store/actions/loginTabsActions'
import { Redirect } from 'react-router-dom'
import TextInput from '../Form/TextInput'
import MySelect from '../Form/Select'
import EmailInput from '../Form/EmailInput'
import PasswordInput from '../Form/PasswordInput'
import {
	FormBuilder,
	FieldGroup,
	FieldControl,
	Validators
} from "react-reactive-form";
import { Link } from 'react-router-dom'

import { getDesignations } from '../../services/designationService';
import { listCompanies } from '../../services/companyService';

import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Skeleton from '@material-ui/lab/Skeleton';

import AccountBoxIcon from '@material-ui/icons/AccountBox';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import TitleIcon from '@material-ui/icons/Title';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import BusinessIcon from '@material-ui/icons/Business';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

const useStyles = theme => ({
	root: {
		flexGrow: 1,
		height: '100vh',
		padding: 0,
		backgroundImage: `url(../../assets/images/home-banner-bg.png)`,
		backgroundPosition: 'left top',
		backgroundSize: 'contain',
		backgroundRepeat: 'no-repeat',
		backgroundColor: '#fff'
	},
	paper: {
		padding: '16px',
		textAlign: 'center',
		// color: theme.palette.text.secondary,
	},
	logo: {
		width: '50%'
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		'& .MuiTextField-root': {
			margin: '16px',
		},
		'& .MuiFormControl-root': {
			margin: '16px',
		},
	},
	buttonContainer: {
		display: 'flex',
		padding: '8px',
		justifyContent: 'space-between'
	}
});

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`nav-tabpanel-${index}`}
			aria-labelledby={`nav-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Typography>
	);
}

function a11yProps(index) {
	return {
		id: `nav-tab-${index}`,
		'aria-controls': `nav-tabpanel-${index}`,
	};
}

function LinkTab(props) {
	return (
		<Tab
			onClick={(event) => {
				event.preventDefault();
			}}
			{...props}
		/>
	);
}

class Login extends Component {

	state = {
		currentTab: 0,
		designations: [],
		companylist: [],
		loading: true
	};

	savedDesignations = [];

	customToastId = '123';
	toastId = null;

	loginForm = FormBuilder.group({
		username: ['', Validators.compose([
			Validators.required,
			Validators.minLength(7)
		])],
		password: ['', Validators.compose([
			Validators.required,
			Validators.minLength(7)
		])]
	});

	registerForm = FormBuilder.group({
		partnerId: ['', [
			Validators.required,
			Validators.pattern('^[0-9]+$')
		]],
		businessId: ['', [
			Validators.required
		]],
		companyName: ['', Validators.required],
		title: ['', [
			Validators.required,
			Validators.pattern('^[a-zA-Z0-9]+$')
		]],
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		userEmail: ['', [
			Validators.required,
			Validators.email
		]],
		designationId: ['', [
			Validators.required,
			Validators.pattern('^[0-9]+$')
		]],
		userName: ['', Validators.compose([
			Validators.required,
			Validators.minLength(7)
		])],
		password: ['', Validators.compose([
			Validators.required,
			Validators.minLength(7),
			Validators.pattern('^(?=.*?[a-zA-Z])(?=.*?[0-9]).{7,}$')   //^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$

		])],

		address1: [''], // Check,
		address2: [''], // Check
		address3: [''], // Check
		subrub: [''], // Check
		stateId: [1], // Check
		countryId: [1], // Check
		postalCode: [''], // Check
		roleId: [2], // Head Office by default
	});

	componentDidMount() {
		const promises = [];
		promises.push(getDesignations(1));
		promises.push(getDesignations(2));
		promises.push(listCompanies());

		Promise.all(promises).then(results => {
			const options1 = results[0].map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
			const options2 = results[1].map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
			const options3 = results[2].map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
			this.savedDesignations.push({
				value: 1,
				designations: options1
			});
			this.savedDesignations.push({
				value: 2,
				designations: options2
			});
			this.setState({
				companylist: options3,
				loading: false
			});
		});
		this.registerForm.get('partnerId').valueChanges.subscribe((value) => {
			// reset select
			this.registerForm.get('designationId').reset();
			const savedD = this.savedDesignations.find(s => s.value === value);
			if (savedD) {
				this.setState({
					loading: false,
					designations: savedD.designations
				});
			} else {
				this.setState({
					loading: true,
				});
				getDesignations(value).then(designations => {
					const options = designations.map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
					this.savedDesignations.push({
						value,
						designations: options
					});
					this.setState({
						loading: false,
						designations: options
					});
				});
			}
		});
	}

	componentWillUnmount() {
		this.registerForm.get('partnerId').valueChanges.unsubscribe();
	}

	SelectCompanyInfo = ({ handler, touched, hasError, meta, onChange, value }) => {
		const requiredError = touched && hasError("required") && `${meta.label || 'Field'} required`;
		const error = requiredError ? true : false;
		return (
			<TextField
				select
				className="field"
				error={error}
				id={meta.label}
				label={meta.label}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<BusinessCenterIcon />
						</InputAdornment>
					),
				}}
				disabled={this.state.companylist.length === 0}
				variant="outlined"
				required={true}
				helperText={requiredError}
				value={value}
				onChange={onChange}
			>
				{this.state.companylist}
			</TextField>
		)
	}

	SelectD = ({ handler, touched, hasError, meta, onChange, value }) => {
		const requiredError = touched && hasError("required") && `${meta.label || 'Field'} required`;
		const error = requiredError ? true : false;
		return (
			<TextField
				select
				className="field"
				error={error}
				id={meta.label}
				label={meta.label}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<BusinessCenterIcon />
						</InputAdornment>
					),
				}}
				disabled={this.state.designations.length === 0}
				variant="outlined"
				required={true}
				helperText={requiredError}
				value={value}
				onChange={onChange}
			>
				{this.state.designations}
			</TextField>
		)
	}


	checkIfMatchingPasswords = () => {
		return (group) => {
			let passwordInput = group.controls['password'],
				passwordConfirmationInput = group.controls['passwordConfirm'];
			if (passwordInput.value !== passwordConfirmationInput.value) {
				passwordConfirmationInput.setErrors({ mismatch: true });
			} else {
				passwordConfirmationInput.setErrors(null);
			}
			return null;
		};
	}

	handleSubmitLogin = (e) => {
		e.preventDefault();
		this.props.userLogin(this.loginForm.value);
	}

	handleSubmitRegister = (e) => {
		e.preventDefault();
		const partnerId = parseInt(this.registerForm.value.partnerId);
		const designationId = parseInt(this.registerForm.value.designationId);
		const businessId = parseInt(this.registerForm.value.businessId);
		const data = Object.assign({}, this.registerForm.value, { partnerId, designationId, businessId });
		this.props.userSignUp(data);
	}

	handleTabChange = (event, tab) => {
		this.setState({
			currentTab: tab
		});
	}

	render() {
		const { user, classes } = this.props;
		if (user) {
			console.log('Already logged in, redirect to dashboard');
			return <Redirect to='/dashboard' />;
		}
		return (
			<div className="loginbody">
				<Grid container spacing={3} justify="center">
					<Grid item xs={8}>
						<Paper className={classes.paper} elevation={8}>
							<img className={classes.logo} src={logo} alt="" />
							<Tabs
								value={this.state.currentTab}
								onChange={this.handleTabChange}
								variant="fullWidth"
								indicatorColor="primary"
								textColor="primary"
								aria-label="icon label tabs example"
							>
								<LinkTab icon={<AccountBoxIcon />} label="Log In" href="/login" {...a11yProps(0)} />
								<LinkTab icon={<LockOpenIcon />} label="Sign Up" href="/register" {...a11yProps(1)} />
							</Tabs>
							<TabPanel value={this.state.currentTab} index={0}>
								<Typography variant="h5" gutterBottom>
									Member Login
								</Typography>
								<FieldGroup
									control={this.loginForm}
									strict={false}
									render={({ get, invalid }) => (
										<form className={classes.form}>
											<FieldControl
												strict={false}
												name="username"
												render={TextInput}
												meta={
													{
														label: "User ID",
														icon: <PersonIcon />,
														placeholder: 'Enter your username'
													}
												}
											/>
											<FieldControl
												strict={false}
												name="password"
												render={PasswordInput}
												meta={
													{
														label: "Password",
														icon: <LockIcon />,
														placeholder: 'Enter Your Password'
													}
												}
											/>
											<div className={classes.buttonContainer}>
												<Button disabled={invalid} onClick={this.handleSubmitLogin} variant="contained" color="primary">
													Log In
												</Button>
												<small>
													<Link to="/forgot-password">
														Forgot Your Password?
													</Link>
												</small>
											</div>
										</form>
									)}
								/>
							</TabPanel>
							<TabPanel value={this.state.currentTab} index={1}>
								<Typography variant="h5" gutterBottom>
									New Member Register
								</Typography>
								{this.state.loading ?
									<div>
										<Grid container spacing={3}>
											<Grid item xs={6}>
												<Skeleton width={100} variant="text" />
												<Skeleton variant="rect" width={200} height={50} />		
											</Grid>
											<Grid item xs={6}>
												<Skeleton width={100} variant="text" />
												<Skeleton variant="rect" width={200} height={50} />		
											</Grid>
											<Grid item xs={6}>
												<Skeleton width={100} variant="text" />
												<Skeleton variant="rect" width={200} height={50} />		
											</Grid>
											<Grid item xs={6}>
												<Skeleton width={100} variant="text" />
												<Skeleton variant="rect" width={200} height={50} />		
											</Grid>
											<Grid item xs={6}>
												<Skeleton width={100} variant="text" />
												<Skeleton variant="rect" width={200} height={50} />		
											</Grid>
											<Grid item xs={6}>
												<Skeleton width={100} variant="text" />
												<Skeleton variant="rect" width={200} height={50} />		
											</Grid>
											<Grid item xs={6}>
												<Skeleton width={100} variant="text" />
												<Skeleton variant="rect" width={200} height={50} />		
											</Grid>
											<Grid item xs={6}>
												<Skeleton width={100} variant="text" />
												<Skeleton variant="rect" width={200} height={50} />		
											</Grid>
											<Grid item xs={6}>
												<Skeleton width={100} variant="text" />
												<Skeleton variant="rect" width={200} height={50} />		
											</Grid>
											<Grid item xs={6}>
												<Skeleton width={100} variant="text" />
												<Skeleton variant="rect" width={200} height={50} />		
											</Grid>
										</Grid>
									</div>
									: <FieldGroup
										strict={false}
										control={this.registerForm}
										render={({ get, invalid }) => (
											<form className={classes.form} onSubmit={this.handleSubmitRegister}>
												<Grid container spacing={3}>
													<Grid item xs={6}>
														<FieldControl
															name="title"
															render={MySelect}
															meta={
																{
																	required: true,
																	login: true,
																	label: "Title",
																	icon: <TitleIcon />,
																	options: [
																		<MenuItem key="1" value={'Mr'}>Mr</MenuItem>,
																		<MenuItem key="2" value={'Mrs'}>Mrs</MenuItem>,
																		<MenuItem key="3" value={'Ms'}>Ms</MenuItem>,
																		<MenuItem key="4" value={'Miss'}>Miss</MenuItem>,
																		<MenuItem key="5" value={'Dr'}>Dr</MenuItem>
																	]
																}
															}
														/>
													</Grid>
													<Grid item xs={6}>
														<FieldControl
															name="firstName"
															render={TextInput}
															meta={
																{
																	required: true,
																	login: true,
																	label: "First Name",
																	icon: <PersonIcon />,
																	placeholder: 'Enter your first name'
																}
															}
														/>
													</Grid>
													<Grid item xs={6}>
														<FieldControl
															name="lastName"
															render={TextInput}
															meta={
																{
																	required: true,
																	login: true,
																	label: "Last Name",
																	icon: <PersonIcon />,
																	placeholder: 'Enter your last name'
																}
															}
														/>
													</Grid>
													<Grid item xs={6}>
														<FieldControl
															name="userEmail"
															render={EmailInput}
															meta={
																{
																	required: true,
																	login: true,
																	label: "Email Address",
																	icon: <EmailIcon />,
																	placeholder: 'Enter your email'
																}
															}
														/>

													</Grid>
													<Grid item xs={6}>
														<FieldControl
															name="partnerId"
															render={MySelect}
															meta={
																{
																	required: true,
																	login: true,
																	label: "Partner Group",
																	icon: <GroupIcon />,
																	options: [
																		<MenuItem key="1" value={'1'}>Accountants &/or Tax Agents</MenuItem>,
																		<MenuItem key="2" value={'2'}>Real Estate Agents</MenuItem>,
																	]
																}
															}
														/>
													</Grid>
													<Grid item xs={6}>
														<FieldControl
															strict={false}
															name="designationId"
															render={this.SelectD}
														/>
													</Grid>
													<Grid item xs={6}>
														<FieldControl
															name="businessId"
															render={this.SelectCompanyInfo}
															meta={
																{
																	required: true,
																	login: true,
																	label: "Business Name",
																	icon: <BusinessIcon />,
																	options: this.state.companylist
																}
															}
														/>
													</Grid>
													<Grid item xs={6}>
														<FieldControl
															name="companyName"
															render={TextInput}
															meta={
																{
																	required: true,
																	login: true,
																	label: "Company Name",
																	icon: <BusinessIcon />,
																	placeholder: 'Enter your company name'
																}
															}
														/>
													</Grid>
													<Grid item xs={6}>
														<FieldControl
															name="userName"
															render={TextInput}
															meta={
																{
																	required: true,
																	login: true,
																	hint: 'At least 7 characters',
																	label: "User Name",
																	icon: <LockIcon />,
																	placeholder: 'Enter your username'
																}
															}
														/>
													</Grid>
													<Grid item xs={6}>
														<FieldControl
															name="password"
															render={PasswordInput}
															meta={
																{
																	required: true,
																	login: true,
																	hint: 'Password most contain letters and numbers, and at least 7 characters',
																	label: "Password",
																	icon: <VpnKeyIcon />,
																	placeholder: 'Enter your password'
																}
															}
														/>
													</Grid>
													<Button disabled={invalid} onClick={this.handleSubmitRegister} variant="contained" color="primary">
														Register
													</Button>

												</Grid>
											</form>
										)}
									/>
								}

							</TabPanel>
						</Paper>
					</Grid>
				</Grid>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	const { user, authError, signUpError, signUpMessage } = state.auth;
	return {
		currentTab: state.loginTab.tab,
		user,
		error: authError || signUpError,
		signUpMessage
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeTab: (tab) => dispatch(setCurrentTab(tab)),
		userLogin: (credentials) => dispatch(login(credentials)),
		userSignUp: (newUser) => dispatch(signUp(newUser)),
		getDesignationsForGroup: (partnerId) => dispatch(getDesignationsAction(partnerId)),
		errorsDisplayed: () => dispatch(clearErrors())
	};
}


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(useStyles)(Login));