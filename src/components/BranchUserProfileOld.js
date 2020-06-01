import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateProfileBranchUser } from '../store/actions/authActions'
import {
    FormBuilder,
    FieldGroup,
    FieldControl,
    Validators
} from "react-reactive-form";

import Select from './Form/Select'
import TextInput from './Form/TextInput'
import EmailInput from './Form/EmailInput'

import { listStates } from '../services/stateService';
import { getDesignations } from '../services/designationService'
import SecondaryLoading from './SecondaryLoading'

import { withStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextInput from "./Form/TextInput";
import EmailInput from "./Form/EmailInput";
import Button from "@material-ui/core/Button";
import PasswordInput from "./Form/PasswordInput";
import ConfirmPassword from "./Form/ConfirmPassword";

import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Skeleton from '@material-ui/lab/Skeleton';

import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = theme => ({
    form: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        '& .MuiTextField-root': {
            margin: '16px',
        },
        '& .MuiFormControl-root': {
            margin: '16px',
        },
    },
});

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

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}


class BranchUserProfile extends Component {

    state = {
        designations: [],
        states: [],
        userFormFilled: false,
        currentDesignation: null
    };

    savedDesignations = [];

    userForm = FormBuilder.group({
        userId: ['', Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]+$')
        ])],
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

    componentDidMount() {
        /**
         * I need to read all the designations because I don't know the partner group
         */
        const promises = [listStates(1), getDesignations(1), getDesignations(2)];
        const { branchUser } = this.props;
        // this.props.showLoading();
        Promise.all(promises).then(result => {
            const states = result[0].map(o => <option key={o.id} value={o.id}>{o.name}</option>);
            /*
            const designations1 = result[1].map(o => <option key={o.id} value={o.id}>{o.name}</option>);
            const designations2 = result[2].map(o => <option key={o.id} value={o.id}>{o.name}</option>);
            */
            const designations = result[1].concat(result[2]);
            /**
             * For some reason I cannot disable the select
             */
            const currentDesignation = designations.find(d => d.id === branchUser.designationId);
            this.setState({
                states,
                designations,
                currentDesignation
            }, () => {
                // Use logged in user partnerId

                this.userForm.patchValue({
                    userId: branchUser.userId,
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
                // this.props.hideLoading();
                this.setState({ userFormFilled: true });
            })
        })
            .catch(e => {
                console.log('Error', e);
            })
    }

    /*
    SelectState = ({ handler, touched, hasError, meta }) => {
        return (
            <div>
                <label>{meta.label}</label>
                <select className={meta.className} {...handler()} >
                    <option> Please Choose</option>
                    {this.state.states}
                </select>
                <span style={{color: 'red'}}>{meta.required && '*'}</span>
                <i className={meta.icon}></i>
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
                <select disabled className={meta.className} {...handler()} >
                    <option disabled> Please Choose</option>
                    {this.state.designations}
                </select>
                <i className={meta.icon}></i>
                <span>
                    {touched
                        && hasError("required")
                        && `${meta.label} is required`}
                </span>
            </div>
        )
    }
    */

    SelectState = ({ handler, touched, hasError, meta, onChange, value }) => {
        const requiredError = touched && hasError("required") && `${meta.label || 'Field'} required`;
        const error = requiredError ? true : false;
        return (
            <TextField {...handler()}
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
                variant="outlined"
                required={true}
                helperText={requiredError}
                value={value}
                onChange={onChange}
            >
                {this.state.states}
            </TextField>
        )
    }

    SelectD = ({ handler, touched, hasError, meta, onChange, value }) => {
        const requiredError = touched && hasError("required") && `${meta.label || 'Field'} required`;
        const error = requiredError ? true : false;
        return (
            <TextField {...handler()}
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

    setCurrentTab = tab => {
        this.setState({ currentTab: tab });
    }

    submit = () => {
        this.props.editUser(this.userForm.value);
    }

    render() {
        const {
            branchUser
        } = this.props;
        // Go to login if not authenticated
        if (!branchUser) {
            return <Redirect to='/login' />
        }
        if (!this.state.userFormFilled) {
            return <SecondaryLoading></SecondaryLoading>
        }
        this.userForm.patchValue({
            userId: branchUser.userId,
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

        return (
            <div>
                <h2>
                    Edit Profile
                </h2>

                <hr className="spacer30px" />


                <div className="row cutomer_managementmainbox">
                    <div className="col-sm-8 cutomer_managementtable">
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

                                                <tr>
                                                    <td>Designation</td>
                                                    <td>
                                                        <input disabled className="customermanagement_inputbox" value={this.state.currentDesignation && this.state.currentDesignation.name} />
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
                                                                    placeholder: 'Email'
                                                                }
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Contact No 1</td>
                                                    <td>
                                                        <FieldControl
                                                            name="contactNo1"
                                                            render={TextInput}
                                                            meta={
                                                                {
                                                                    label: "",
                                                                    hint: 'Only numbers.  Min 10 and Max 12',
                                                                    required: true,
                                                                    className: 'customermanagement_inputbox',
                                                                    placeholder: 'Enter contact number'
                                                                }
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Contact No 2</td>
                                                    <td>
                                                        <FieldControl
                                                            name="contactNo2"
                                                            render={TextInput}
                                                            meta={
                                                                {
                                                                    label: "",
                                                                    hint: 'Optional. Only numbers.  Min 10 and Max 12',
                                                                    className: 'customermanagement_inputbox',
                                                                    placeholder: 'Enter contact number'
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
                                                                    placeholder: ''
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
                                                                    placeholder: ''
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
                                                                    placeholder: ''
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
                                                                    placeholder: ''
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
                                                                    placeholder: ''
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
        )
    }
}

const mapStateToProps = state => {
    return {
        branchUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        editUser: (user) => dispatch(updateProfileBranchUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BranchUserProfile)