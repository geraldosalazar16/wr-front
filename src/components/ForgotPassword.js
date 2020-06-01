import React, { Component } from 'react'
import logo from '../assets/images/logo.png'
import { connect } from 'react-redux'
import EmailInput from './Form/EmailInput'
import { recoverPassword } from '../store/actions/authActions'
import {
	FormBuilder,
	FieldGroup,
	FieldControl,
	Validators
} from "react-reactive-form";
import './Login/Login.css'

import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import EmailIcon from '@material-ui/icons/Email';

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
});

class ForgotPassword extends Component {
	customToastId = 'fpToast';
	toastId = null;

	form = FormBuilder.group({
		email: ['', [
			Validators.required,
			Validators.email
		]]
	});

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.forgotPassword(this.form.value.email);
	}

	render() {
		const { classes } = this.props;
		return (
			<Grid container spacing={3} justify="center">
				<Grid item xs={8}>
					<Paper className={classes.paper} elevation={8}>
						<img className={classes.logo} src={logo} alt="" />
						<Typography variant="h5" gutterBottom>
							Forgot password
						</Typography>
						<FieldGroup control={this.form} className={classes.form}
							render={({ get, invalid }) => (
								<form onSubmit={this.handleSubmit}>
									<Grid container spacing={3} justify="start">
										<Grid item xs={12}>
											<FieldControl
												name="email"
												render={EmailInput}
												meta={
													{
														label: "Email Address",
														icon: <EmailIcon />,
														placeholder: 'Enter your email'
													}
												}
											/>
										</Grid>
									</Grid>
									<Grid container spacing={3} justify="flex-end">
										<Grid item xs={2} justify="flex-end">
											<Button disabled={invalid} onClick={this.handleSubmit} variant="contained" color="primary">
												Send
											</Button>
										</Grid>
									</Grid>
								</form>
							)}
						/>
					</Paper>
				</Grid>
			</Grid>
		)
	}
}

const mapStateToProps = (state) => {
	const { recoverPasswordError, recoverPasswordMessage } = state.auth;
	return {
		recoverPasswordError,
		recoverPasswordMessage
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		forgotPassword: (email) => dispatch(recoverPassword(email))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(useStyles)(ForgotPassword));
