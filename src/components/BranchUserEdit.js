import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    list,
    listUsers,
    editBranchUser,
    finishEditBranchUser,
    changePasswordBranchUser
} from '../store/actions/branchActions'


import { FieldControl, FieldGroup, FormBuilder, Validators } from "react-reactive-form";

import Select from './Form/Select'
import TextInput from './Form/TextInput'
import EmailInput from './Form/EmailInput'
import PasswordInput from './Form/PasswordInput'
import ConfirmPassword from './Form/ConfirmPassword'

import { listStates } from '../services/stateService';
import { getDesignations } from '../services/designationService'
import SecondaryLoading from './SecondaryLoading'
//import store from "../store/Store";

class BranchUserCreate extends Component {

    state = {
        loading: true,
        currentTab: 'general',
        designations: [],
        states: [],
    };

    savedDesignations = [];

    userForm = FormBuilder.group({
        userId: ['', Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]+$')
        ])],
        partnerId: ['', Validators.required],
        title: ['', Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9]+$')
        ])],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userEmail: ['', [
            Validators.required,
            Validators.email
        ]],
        designationId: ['', Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]+$')
        ])],
        contactNo1: ['', Validators.compose([
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(10),
            Validators.pattern('^[0-9]+$')
        ])],
        contactNo2: ['', Validators.compose([
            Validators.maxLength(12),
            Validators.minLength(10),
            Validators.pattern('^[0-9]+$')
        ])],
        address1: ['', Validators.required],
        address2: ['', Validators.required],
        address3: [''],
        subrub: ['', Validators.compose([
            Validators.required
        ])],
        stateId: [1, Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]+$')
        ])],
        countryId: [1], // 1 stands for Australia, as default
        postalCode: ["", Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]+$')
        ])]
    });

    pwdForm = FormBuilder.group({
        password: ["", Validators.compose([
            Validators.required,
            Validators.minLength(7),
            Validators.pattern('^(?=.*?[a-zA-Z])(?=.*?[0-9]).{7,}$')   //^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$
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

    componentDidMount() {
        // Set listener
        this.userForm.get('partnerId').valueChanges.subscribe((value) => {
            const savedD = this.savedDesignations.find(s => s.value === value);
            if (savedD) {
                this.setState({
                    designations: savedD.designations
                });
            } else {
                this.setState({ loading: true });
                getDesignations(value).then(designations => {
                    const options = designations.map(o => <option key={o.id} value={o.id}>{o.name}</option>);
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

        const { user, branchUser, branch } = this.props;
        if (user && branchUser) {
            const { partnerId } = user;
            const promises = [listStates(1), getDesignations(partnerId)];
            Promise.all(promises).then(result => {
                const states = result[0].map(o => <option key={o.id} value={o.id}>{o.name}</option>);
                const designations = result[1].map(o => <option key={o.id} value={o.id}>{o.name}</option>);
                this.setState({
                    states,
                    designations
                }, () => {
                    this.fillForm(branchUser, partnerId)
                    this.setState({ loading: false });
                })
            })
                .catch(e => {
                    this.setState({ loading: false });
                })
        } else {
            if (branch) {
                this.props.reloadUsers(this.props.user.userId, branch);
            } else {
                this.props.reloadBranches();
            }
            this.setState({ loading: false });
        }
    }

    componentDidUpdate(prevProps) {
        
        const { branchUser } = this.props;
        const prevUser = prevProps.branchUser;

        if (branchUser && (!prevUser || prevUser.userId !== branchUser.userId)) {
            this.fillForm(branchUser, this.props.user.userId)
        } else {
            const { branch  } = this.props;
            const prevBranch = prevProps.branch;

            if (branch && (!prevBranch || prevBranch.branchId !== branch.branchId)) {
                this.props.reloadUsers(this.props.user.userId, branch);
            }
        }
    }
    /*
    componentDidMount() {
        

        const { branchUser } = this.props;
        const { partnerId } = this.props.user;
        const promises = [listStates(1), getDesignations(partnerId)];
        Promise.all(promises).then(result => {
            const states = result[0].map(o => <option key={o.id} value={o.id}>{o.name}</option>);
            const designations = result[1].map(o => <option key={o.id} value={o.id}>{o.name}</option>);
            this.setState({
                states,
                designations
            }, () => {
                this.fillForm(branchUser, partnerId)
                this.setState({loading: false});
            })
        })
        .catch(e => {
            this.setState({loading: false});
        })
    }
    */
    componentWillUnmount() {
        this.userForm.get('partnerId').valueChanges.unsubscribe();
    }

    fillForm(branchUser, partnerId) {
        this.userForm.patchValue({
            userId: branchUser.userId,
            partnerId,
            title: branchUser.title,
            firstName: branchUser.firstName,
            lastName: branchUser.lastName,
            userEmail: branchUser.userEmail,
            designationId: branchUser.designationId,
            contactNo1: branchUser.contactNo1,
            contactNo2: branchUser.contactNo2,
            address1: branchUser.address1,
            address2: branchUser.address2,
            address3: branchUser.address3,
            subrub: branchUser.subrub,
            stateId: branchUser.stateId,
            countryId: branchUser.countryId,
            postalCode: branchUser.postalCode
        });
    }

    SelectState = ({ handler, touched, hasError, meta }) => {
        return (
            <div>
                <label>{meta.label}</label>
                <select className={meta.className} {...handler()} >
                    <option> Please Choose</option>
                    {this.state.states}
                </select>
                <i className={meta.icon}></i>
                <span style={{ color: 'red' }} className="hint">
                    {meta.required
                        && `*`}
                </span>
                <span className="error">
                    {touched
                        && hasError("required")
                        && `${meta.label} is required`}
                </span>
            </div>
        )
    }

    SelectD = ({ handler, touched, hasError, meta }) => {
        return (
            <div>
                <label>{meta.label}</label>
                <select className={meta.className} {...handler()} >
                    <option> Please Choose</option>
                    {this.state.designations}
                </select>
                <span style={{ color: 'red' }}>{meta.required && '*'}</span>
                <i className={meta.icon}></i>
                <span>
                    {touched
                        && hasError("required")
                        && `${meta.label} is required`}
                </span>
            </div>
        )
    }

    setCurrentTab = tab => {
        this.setState({ currentTab: tab });
    }

    submit = (evt) => {
        evt.preventDefault();
        if (this.state.currentTab === 'general') {

            this.props.editUser(this.userForm.value);
        } else {
            this.props.changePassword(this.props.branchUser.userId, this.pwdForm.value.password);
        }

    }

    render() {
        const {
            user
        } = this.props;

        // Go to login if not authenticated
        if (!user) {
            return <Redirect to='/login' />
        }
        // Go to user list if not user provided
        /*
        if (!branchUser) {
            return <Redirect to='/branch-users' />
        }
        */
        if (this.state.loading) {
            return <SecondaryLoading></SecondaryLoading>
        }
        //console.log(store.getState());
        return (
            <div>
                <h2>
                    Edit Branch User
                    <Link to={`/branch-users/${this.props.match.params.branch_id}`} className="back_tolist">
                        <i className="fas fa-long-arrow-alt-left"></i> Back to Branch Users List
                    </Link>
                </h2>

                <hr className="spacer30px" />

                <div className="row cutomermanagement_gapbtmtable">
                    <hr className="spacer10px" />
                    <ul className="nav nav-tabs">
                        <li className="nav-item active" onClick={() => this.setCurrentTab('general')}>
                            <a data-toggle="tab" href="#general">
                                <i className="fas fa-user"></i> General information
							</a>
                        </li>
                        <li className="nav-item" onClick={() => this.setCurrentTab('security')}>
                            <a data-toggle="tab" href="#security">
                                <i className="fas fa-key"></i> Change Password
							</a>
                        </li>
                    </ul>
                    <div className="tab-content row cutomermanagement_gapbtmtable">
                        <div id="general" className="col-sm-8 cutomer_managementtable tab-pane fade in active">
                            <FieldGroup control={this.userForm}
                                render={({ get, invalid }) => (
                                    <div>
                                        <form onSubmit={this.handleSubmit}>
                                            <table className="table table-bordered" cellSpacing="0" cellPadding="0">
                                                <tbody>
                                                    <tr>
                                                        <td>Title</td>
                                                        <td>
                                                            <FieldControl
                                                                name="title"
                                                                render={Select}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
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
                                                            <FieldControl
                                                                name="firstName"
                                                                render={TextInput}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'First name'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Last Name</td>
                                                        <td>
                                                            <FieldControl
                                                                name="lastName"
                                                                render={TextInput}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'Last name'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    {/*
                                                    <tr>
                                                        <td>Partner Group</td>
                                                        <td>
                                                            <FieldControl
                                                                name="partnerId"
                                                                render={Select}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        options: [
                                                                            <option key="1" value="1"> Accountants &/or Tax Agents</option>,
                                                                            <option key="2" value="2"> Real Estate Agents</option>
                                                                        ]
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    */}
                                                    <tr>
                                                        <td>Designation</td>
                                                        <td>
                                                            <FieldControl
                                                                name="designationId"
                                                                render={this.SelectD}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Email Address</td>
                                                        <td>
                                                            <FieldControl
                                                                name="userEmail"
                                                                render={EmailInput}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'Email address'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Contact No</td>
                                                        <td>
                                                            <FieldControl
                                                                name="contactNo1"
                                                                render={TextInput}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        hint: '',
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'Only numbers.  Min 10 and Max 12'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Contact No</td>
                                                        <td>
                                                            <FieldControl
                                                                name="contactNo2"
                                                                render={TextInput}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        hint: '',
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'Optional. Only numbers.  Min 10 and Max 12'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Address Line 1</td>
                                                        <td>
                                                            <FieldControl
                                                                name="address1"
                                                                render={TextInput}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'Enter address1'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Address Line 2</td>
                                                        <td>
                                                            <FieldControl
                                                                name="address2"
                                                                render={TextInput}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'Enter address2'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Address Line 3</td>
                                                        <td>
                                                            <FieldControl
                                                                name="address3"
                                                                render={TextInput}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'Enter address3'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Suburb</td>
                                                        <td>
                                                            <FieldControl
                                                                name="subrub"
                                                                render={TextInput}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'Enter suburb'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>State</td>
                                                        <td>
                                                            <FieldControl
                                                                name="stateId"
                                                                render={this.SelectState}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Country</td>
                                                        <td>
                                                            <FieldControl
                                                                name="countryId"
                                                                render={Select}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        options: [
                                                                            <option key="1" value="1"> Australia</option>
                                                                        ]
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Postal Code</td>
                                                        <td>
                                                            <FieldControl
                                                                name="postalCode"
                                                                render={TextInput}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'Enter postal code'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                        <div className="row">
                                            <div className="col-sm-12 cutomer_managementlinksbtm">
                                                <button type="button" className="btn-one" disabled={invalid} onClick={this.submit}><i className="fas fa-edit"></i> Update</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                        <div id="security" className="col-sm-8 cutomer_managementtable tab-pane fade in ">
                            <FieldGroup control={this.pwdForm}
                                render={({ get, invalid }) => (
                                    <div>
                                        <p style={{ color: 'red' }}>* Required fields</p>
                                        <form onSubmit={this.handleSubmit}>
                                            <table className="table table-bordered" cellSpacing="0" cellPadding="0">
                                                <tbody>
                                                    <tr>
                                                        <td>Password</td>
                                                        <td>
                                                            <FieldControl
                                                                name="password"
                                                                render={PasswordInput}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        hint: '',
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'Enter your password'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Confirm Password</td>
                                                        <td>
                                                            <FieldControl
                                                                name="passwordConfirm"
                                                                render={ConfirmPassword}
                                                                meta={
                                                                    {
                                                                        label: "",
                                                                        required: true,
                                                                        className: 'customermanagement_inputbox',
                                                                        placeholder: 'Confirm your password'
                                                                    }
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                        <div className="row">
                                            <div className="col-sm-12 cutomer_managementlinksbtm">
                                                <button type="button" className="btn-one" disabled={invalid} onClick={this.submit}><i className="fas fa-edit"></i> Update</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                        <hr className="spacer30px" />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const branchId = ownProps.match.params.branch_id;
    const branch = state.branch.branches.find(b => b.branchId === parseInt(branchId))
    const branchUser = state.branch.users && state.branch.users.find(u => u.userId === parseInt(ownProps.match.params.user_id))
    return {
        user: state.auth.user,
        branch,
        branchUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        reloadBranches: () => dispatch(list(true)),
        reloadUsers: (userId, branch) => dispatch(listUsers(userId, branch)),
        editUser: (user) => dispatch(editBranchUser(user)),
        changePassword: (userId, newPassword) => dispatch(changePasswordBranchUser(userId, newPassword)),
        finish: () => dispatch(finishEditBranchUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BranchUserCreate)