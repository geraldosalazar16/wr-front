import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { clearBranchUserCreateError, createBranchUser } from '../store/actions/employeeActions'
import { FieldControl, FieldGroup, FormBuilder, Validators } from "react-reactive-form";

import Select from './Form/Select'
import TextInput from './Form/TextInput'
import EmailInput from './Form/EmailInput'
import PasswordInput from './Form/PasswordInput'
import ConfirmPassword from './Form/ConfirmPassword'

import { listStates } from '../services/stateService';
import { getDesignations } from '../services/designationService'
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PhoneIcon from "@material-ui/icons/Phone";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import PublicIcon from "@material-ui/icons/Public";
import MailIcon from "@material-ui/icons/Mail";
import SaveIcon from "@material-ui/icons/Save";
import FlagIcon from "@material-ui/icons/Flag";
import TitleIcon from '@material-ui/icons/Title';
import EmailIcon from '@material-ui/icons/Email';

const useStyles = theme => ({
    root: {
        padding: '16px'
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiTextField-root': {
            margin: '16px',
        },
        '& .MuiFormControl-root': {
            margin: '16px',
        },
    },
    paper: {
        padding: '16px'
    }
});

class EmployeeCreate extends Component {

    state = {
        designations: [],
        states: [],
        loading: true
    };

    savedDesignations = [];

    userForm = FormBuilder.group({
        partnerId: ['', Validators.compose([
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
        contactNo2: [undefined, Validators.compose([
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
        postalCode: ['', Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]+$')
        ])],
        userName: ['', Validators.compose([
            Validators.required,
            Validators.minLength(7)
        ])],
        password: ['', Validators.compose([
            Validators.required,
            Validators.minLength(7),
            Validators.pattern('^(?=.*?[a-zA-Z])(?=.*?[0-9]).{7,}$')   //^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$
        ])],
        passwordConfirm: [''],
        roleId: 3
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
        // Set the partner id
        this.userForm.patchValue({
            partnerId: this.props.user.userId
        });
        const promises = [listStates(1), getDesignations(this.props.user.partnerId)];
        Promise.all(promises).then(result => {
            const states = result[0].map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
            const designations = result[1].map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
            this.setState({
                states,
                designations,
                loading: false
            });
            this.savedDesignations.push({
                value: this.props.user.partnerId,
                designations
            });
        })
    }

    componentWillUnmount() {
        this.userForm.get('partnerId').valueChanges.unsubscribe();
    }

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
                            <FlagIcon />
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

    submit = () => {
        const businessId = this.props.user.businessId;
        const newUser = Object.assign({ businessId }, this.userForm.value);
        this.props.createUser(newUser, this.state);
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="h5" component="h5">
                            Create New Employee
                        </Typography>
                    </Grid>
                    <Grid item xs={6}
                        container
                        direction="row"
                        justify="flex-end">
                        <Button variant="contained" color="primary" size="large"
                            startIcon={<i className="fas fa-long-arrow-alt-left"></i>}
                            component={Link} className={classes.btn}
                            to="/employee-list">
                            &nbsp;Back to Employee List
                        </Button>
                    </Grid>
                </Grid>

                <hr className="spacer30px" />

                <Paper className={classes.paper} elevation={8}>
                    <FieldGroup control={this.userForm} render={({ get, invalid }) => (
                        <div>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography style={{ color: 'red' }}>
                                        * Required fields
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        name="title"
                                        render={Select}
                                        meta={
                                            {
                                                label: "Title",
                                                icon: <TitleIcon />,
                                                required: true,
                                                className: 'customermanagement_inputbox',
                                                options: [
                                                    <MenuItem key="1" value={"Mr"}>Mr</MenuItem>,
                                                    <MenuItem key="2" value={"Mrs"}>Mrs</MenuItem>,
                                                    <MenuItem key="3" value={"Ms"}>Ms</MenuItem>,
                                                    <MenuItem key="4" value={"Miss"}>Miss</MenuItem>,
                                                    <MenuItem key="5" value={"Dr"}>Dr</MenuItem>
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
                                                label: "First name",
                                                icon: <PersonIcon />,
                                                required: true,
                                                className: 'customermanagement_inputbox',
                                                placeholder: 'Enter first name'
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
                                                label: "Last name",
                                                icon: <PersonIcon />,
                                                required: true,
                                                className: 'customermanagement_inputbox',
                                                placeholder: 'Enter last name'
                                            }
                                        }
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        name="partnerId"
                                        render={Select}
                                        meta={
                                            {
                                                label: "Partner",
                                                required: true,
                                                icon: <BusinessCenterIcon />,
                                                options: [
                                                    <MenuItem key={1} value={1}>Accountants &/or Tax Agents</MenuItem>,
                                                    <MenuItem key={2} value={2}>Real Estate Agents</MenuItem>
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
                                        name="userEmail"
                                        render={EmailInput}
                                        meta={
                                            {
                                                label: "Email",
                                                icon: <EmailIcon />,
                                                required: true,
                                                placeholder: 'Enter your email'
                                            }
                                        }
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        name="contactNo1"
                                        render={TextInput}
                                        meta={
                                            {
                                                label: "Contact 1",
                                                icon: <PhoneIcon />,
                                                required: true,
                                                placeholder: 'Only numbers.  Min 10 and Max 12'
                                            }
                                        }
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        name="contactNo2"
                                        render={TextInput}
                                        meta={
                                            {
                                                label: "Contact 2",
                                                icon: <PhoneIcon />,
                                                placeholder: 'Optional. Only numbers.  Min 10 and Max 12'
                                            }
                                        }
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        name="address1"
                                        render={TextInput}
                                        meta={
                                            {
                                                label: "Address 1",
                                                icon: <LocationOnIcon />,
                                                required: true,
                                                placeholder: 'Enter address'
                                            }
                                        }
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        name="address2"
                                        render={TextInput}
                                        meta={
                                            {
                                                label: "Address 2",
                                                icon: <LocationOnIcon />,
                                                required: true,
                                                placeholder: 'Enter address'
                                            }
                                        }
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        name="address3"
                                        render={TextInput}
                                        meta={
                                            {
                                                label: "Address 3",
                                                icon: <LocationOnIcon />,
                                                placeholder: 'Enter address'
                                            }
                                        }
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        name="subrub"
                                        render={TextInput}
                                        meta={
                                            {
                                                label: "Suburb",
                                                icon: <LocationSearchingIcon />,
                                                required: true,
                                                placeholder: 'Enter suburb'
                                            }
                                        }
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        strict={false}
                                        name="countryId"
                                        render={({ value, onChange }) => (
                                            <TextField
                                                select
                                                className="field"
                                                id="country-select"
                                                label="Country"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PublicIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="outlined"
                                                required={true}
                                                value={value}
                                                onChange={onChange}
                                            >
                                                <MenuItem key="1" value={1}>Australia</MenuItem>,
                                            </TextField>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        strict={false}
                                        name="stateId"
                                        render={this.SelectState}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        name="postalCode"
                                        render={TextInput}
                                        meta={
                                            {
                                                label: "Postal code",
                                                icon: <MailIcon />,
                                                required: true,
                                                placeholder: 'Enter postal code'
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
                                                label: "User name",
                                                icon: <PersonIcon />,
                                                required: true,
                                                placeholder: 'Enter user name'
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
                                                label: "Password",
                                                icon: <LockIcon />,
                                                required: true,
                                                placeholder: 'Enter password'
                                            }
                                        }
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FieldControl
                                        name="passwordConfirm"
                                        render={ConfirmPassword}
                                        meta={
                                            {
                                                label: "Confirm password",
                                                icon: <LockIcon />,
                                                required: true,
                                                placeholder: 'Retype the password'
                                            }
                                        }
                                    />
                                </Grid>

                                <Button variant="contained" color="primary" size="large"
                                    startIcon={<SaveIcon />}
                                    disabled={invalid}
                                    onClick={this.submit}>
                                    &nbsp;Save
                                </Button>
                            </Grid>
                        </div>
                    )} />
                </Paper>
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
        createUser: (user, state) => dispatch(createBranchUser(user, state)),
        messageDisplayed: () => dispatch(clearBranchUserCreateError())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(useStyles)(EmployeeCreate));