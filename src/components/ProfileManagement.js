import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateProfile } from '../store/actions/authActions'
import Select from './Form/Select'
import TextInput from './Form/TextInput'
import SelectD from './Form/SelectDesignations'
import EmailInput from './Form/EmailInput'
import PasswordInput from './Form/PasswordInput'
import ConfirmPassword from './Form/ConfirmPassword'
import {
	FormBuilder,
	FieldGroup,
	FieldControl,
	Validators
} from "react-reactive-form";
import PhoneInput from './Form/PhoneInput'

class ProfileManagement extends Component {

	form = FormBuilder.group({
		partnerId: ['', [
			Validators.required,
			Validators.pattern('^[0-9]+$')
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
		address1: [''], // Check,
		address2: [''], // Check
		address3: [''], // Check
		subrub: ['', Validators.required], // Check
		stateId: [1], // Check
		countryId: [1], // Check
		postalCode: ['', [Validators.pattern('^[0-9]+$')]], // Check

		contact1: ['', [
			Validators.required,
			Validators.maxLength(12),
			Validators.minLength(10),
			Validators.pattern('^[0-9]+$')
		]],
		contact2: ['', [
			Validators.maxLength(12),
			Validators.minLength(10),
			Validators.pattern('^[0-9]+$')
		]],
		roleId: [2], // Head Office by default
		userName: ['', [
			Validators.required,
			Validators.minLength(7)
		]]
	});

	render() {
		return (
			<div>
				<h2>Profile Management </h2>
				<hr className="spacer10px" />

				<div className="row cutomermanagement_gapbtmtable">
					<div className="col-sm-8 cutomer_managementtable">
						<FieldGroup control={this.loginForm}
							render={({ get, invalid }) => (
								<form onSubmit={this.handleSubmit}>
									<table className="table table-bordered" cellSpacing="0" cellPadding="0">
										<tbody>
											<tr>
												<td>Title</td>
												<td>
													{/*
													<select className="customermanagement_inputbox"
														style={{width: '100%'}, {marginRight: '10px'}}>
														<option value="1">Mr</option>
														<option value="2">lorem</option>
														<option value="3">lorem</option>
														<option value="3">lorem</option>
														<option value="3">lorem</option>
													</select>
													*/}
													<FieldControl
														name="title"
														render={Select}
														meta={
															{
																label: "",
																className: 'customermanagement_inputbox',
																options: [
																	<option key="1" value="Mr"> Mr</option>,
																	<option key="2" value="Mrs" >Mrs</option>,
																	<option key="3" value="Ms"> Ms</option>,
																	<option key="4" value="Miss"> Miss</option>,
																	<option key="5" value="Dr"> Dr</option>,
																]
															}
														}
													/>
												</td>
											</tr>
											<tr>
												<td>First Name</td>
												<td>
													{/*
													<input type="text" placeholder="Lorem" className="customermanagement_inputbox" />
													*/}
													<FieldControl
														name="firstName"
														render={TextInput}
														meta={
															{
																label: "",
																className: 'customermanagement_inputbox',
																placeholder: 'Enter your first name'
															}
														}
													/>
												</td>
											</tr>
											<tr>
												<td>Last Name</td>
												<td>
													{/*
													<input type="text" placeholder="Lorem" className="customermanagement_inputbox" />
													*/}
													<FieldControl
														name="lastName"
														render={TextInput}
														meta={
															{
																label: "",
																className: 'customermanagement_inputbox',
																placeholder: 'Enter your last name'
															}
														}
													/>
												</td>
											</tr>
											<tr>
												<td>Designation</td>
												<td>
													{/*
													<select className="customermanagement_inputbox"
														style={{ width: '100%' }, { marginRight: '10px' }}>
														<option value="1">Manager</option>
														<option value="2">lorem</option>
														<option value="3">lorem</option>
														<option value="3">lorem</option>
														<option value="3">lorem</option>
													</select>
													*/}
													<FieldControl
														name="designationId"
														render={SelectD}
														meta={
															{
																label: "",
																className: 'customermanagement_inputbox',
															}
														}
													/>
												</td>
											</tr>
											<tr>
												<td>Email Address</td>
												<td>
													{/*
													<input type="text" placeholder="Lorem" className="customermanagement_inputbox" />
													*/}
													<FieldControl
														name="userEmail"
														render={EmailInput}
														meta={
															{
																label: "",
																className: 'customermanagement_inputbox',
																placeholder: 'Enter your email'
															}
														}
													/>
												</td>
											</tr>
											<tr>
												<td>Contact Number #1</td>
												<td>
													{/*
													<input type="text" placeholder="Lorem" className="customermanagement_inputbox" />
													*/}
													<FieldControl
														name="contact1"
														render={PhoneInput}
														meta={
															{
																label: "",
																hint: 'Use only numbers.  Min 10 and Max 12.',
																required: true,
																className: 'customermanagement_inputbox',
																placeholder: 'Enter phone number'
															}
														}
													/>
												</td>
											</tr>
											<tr>
												<td>Contact Number #2</td>
												<td>
													{/*
													<input type="text" placeholder="Lorem" className="customermanagement_inputbox" />
													*/}
													<FieldControl
														name="contact2"
														render={PhoneInput}
														meta={
															{
																label: "",
																hint: 'Use only numbers.  Min 10 and Max 12.',
																required: false,
																className: 'customermanagement_inputbox',
																placeholder: 'Enter phone number'
															}
														}
													/>
												</td>
											</tr>
											{/*
											<tr>
												<td>Address of the user </td>
												<td><input type="text" placeholder="Lorem" className="customermanagement_inputbox" /></td>
											</tr>
											*/}
											<tr>
												<td>User Name</td>
												{/*
												<td>
													<input type="text" placeholder="Lorem" className="customermanagement_inputbox" />
												</td>
												*/}
												{/*
												<FieldControl
													name="username"
													render={TextInput}
													meta={
														{
															label: "",
															className: 'customermanagement_inputbox',
															placeholder: 'Enter your username'
														}
													}
												/>
											</tr>
											<tr>
												<td>Password</td>
												{/*
												<td>
													<input type="text" placeholder="Lorem" className="customermanagement_inputbox" />
												</td>
												*/}
												<FieldControl
													name="password"
													render={PasswordInput}
													meta={
														{
															label: "",
															className: 'customermanagement_inputbox',
															placeholder: 'Enter your password'
														}
													}
												/>
											</tr>
											<tr>
												<td>Confirm Password</td>
												{/*
												<td>
													<input type="text" placeholder="Lorem" className="customermanagement_inputbox" />
												</td>
												*/}
												<FieldControl
													name="passwordConfirm"
													render={ConfirmPassword}
													meta={
														{
															label: "",
															className: 'customermanagement_inputbox',
															placeholder: 'Confirm your password'
														}
													}
												/>
											</tr>
										</tbody>
									</table>
								</form>
							)}
						/>


					</div>

				</div>



				<hr className="spacer10px" />

				<div className="row">
					<div className="col-sm-12 cutomer_managementlinksbtm">
						<a href="/#"><i className="fas fa-edit"></i> Update</a>
					</div>
				</div>

				<hr className="spacer30px" />
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.user
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateUserProfile: user => dispatch(updateProfile(user))
	}
}
export default connect(
	mapStateToProps,
	mapDispatchToProps)
	(ProfileManagement)
