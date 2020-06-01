import React, { Component } from 'react'
import logo from '../assets/images/logo.png'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import PasswordInput from './Form/PasswordInput'
import ConfirmPassword from './Form/ConfirmPassword'
import { changePassword } from '../store/actions/authActions'
import {
	FormBuilder,
	FieldGroup,
	FieldControl,
	Validators
} from "react-reactive-form";
import { Redirect } from 'react-router-dom'

class ForgotPassword extends Component {
	customToastId = 'cpToast';
	toastId = null;

	state = {
		token: null,
		passwordSaved: false
	}

	componentDidMount() {
        const { changePassworddError, changePasswordMessage } = this.props;
        if (!changePassworddError && !changePasswordMessage) {
            this.setState({token: this.props.match.params.token});
        }
    }

	form = FormBuilder.group({
		password: ["", Validators.compose([
			Validators.required,
			Validators.minLength(7)
		])],
		passwordConfirm: ['']
	}, {
		validators: (group) => {
			let passwordInput = group.controls['password'],
				passwordConfirmationInput = group.controls['passwordConfirm'];
			if (passwordInput.value !== passwordConfirmationInput.value) {
				passwordConfirmationInput.setErrors({ mismatch: true });
			} else {
				passwordConfirmationInput.setErrors(null);
			}
			return null;
		}
	});

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.changePassword(this.state.token, this.form.value.password);
	}

	render() {
		const { changePassworddError, changePasswordMessage } = this.props;
		if (changePassworddError) {
			if (!toast.isActive(this.toastId)) {
				this.toastId = toast(changePassworddError, {
					type: 'error',
					position: toast.POSITION.BOTTOM_CENTER,
					autoClose: 7000,
					toastId: this.customToastId
				});
			}
		} else if (changePasswordMessage && !this.state.passwordSaved) {
			if (!toast.isActive(this.toastId)) {
				this.toastId = toast(changePasswordMessage, {
					type: 'success',
					position: toast.POSITION.BOTTOM_CENTER,
					autoClose: 7000,
					toastId: this.customToastId
				});
			}
			this.setState({passwordSaved: true});
		}
		if (this.state.passwordSaved) {
			return <Redirect to="/login"></Redirect>
		}
		return (
			<div className="loginbody">
				<div className="loginpage">
					<div className="container">
						<div className="row">
							<div className="col col-md-8 col-md-push-2">
								<div className="loginbox">

									<div className="loginbox_logo">
										<img src={logo} alt="" />
									</div>

									<div className="form-body">
										<div className="tab-content">
											<div id="sectionA" className="tab-pane fade in active">
												<div className="loginpage_whitebox_bodywork">
													<FieldGroup control={this.form}
														render={({ get, invalid }) => (
															<form onSubmit={this.handleSubmit}>
																<ul>
																	<li className="title">Change password</li>

																	<li>
																		<FieldControl
																			name="password"
																			render={PasswordInput}
																			meta={
																				{
																					label: "Password",
																					className: 'loginpage_input',
																					icon: 'fas fa-key',
																					placeholder: 'Enter your password'
																				}
																			}
																		/>
																	</li>

																	<li>
																		<FieldControl
																			name="passwordConfirm"
																			render={ConfirmPassword}
																			meta={
																				{
																					label: "Confirm Password",
																					className: 'loginpage_input',
																					icon: 'fas fa-key',
																					placeholder: 'Confirm your password'
																				}
																			}
																		/>
																	</li>


																	<li>
																		<button disabled={invalid} onClick={this.handleSubmit} className="btn-one">
																			Save
																		</button>
																	</li>
																</ul>
															</form>
														)}
													/>
												</div>

												<div className="clearfix"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	const { changePassworddError, changePasswordMessage } = state.auth;
	return {
		changePassworddError,
		changePasswordMessage
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		changePassword: (token, pwd) => dispatch(changePassword(token, pwd))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ForgotPassword);