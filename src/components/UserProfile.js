import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FieldControl, FieldGroup, FormBuilder, Validators } from "react-reactive-form";
import { Redirect } from 'react-router-dom'
import { listStates } from '../services/stateService';
import { getDesignations } from '../services/designationService'
import { changePasswordLogedIn, updateProfile } from '../store/actions/authActions'
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

class UserProfile extends Component {

    state = {
        currentTab: 0,
        states: [],
        designations: [],
        userFormFilled: false
    }

    userForm = FormBuilder.group({
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
        address1: [''],
        address2: [''],
        address3: [''],
        subrub: [''],
        stateId: [1, [
            Validators.pattern('^[a-zA-Z0-9]+$')
        ]],
        countryId: [1], // 1 stands for Australia, as default
        postalCode: ['', Validators.pattern('^[0-9]+$')]
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


    handleResponse = (response) => {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            return data;
        });
    }

    componentDidMount() {
        const user = this.props.user;
        const promises = [listStates(1), getDesignations(user.partnerId)];
        Promise.all(promises).then(result => {
            const states = result[0].map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
            const designations = result[1].map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
            this.setState({
                states,
                designations
            }, () => {
                // Set user information
                this.userForm.patchValue({
                    partnerId: user.partnerId,
                    companyName: user.companyName,
                    userName: user.userName,
                    title: user.title,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userEmail: user.userEmail,
                    designationId: user.designationId,
                    address1: user.address1,
                    address2: user.address2,
                    address3: user.address3,
                    subrub: user.subrub,
                    stateId: user.stateId,
                    countryId: user.countryId || 1, // 1 stands for Australia, as default
                    postalCode: user.postalCode,
                });
                this.setState({ userFormFilled: true });
            })
        });
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

    submit = (evt) => {
        evt.preventDefault();
        if (this.state.currentTab === 0) {
            const newUserInfo = {
                userId: this.props.user.userId,
                ...this.userForm.value
            }
            this.props.updateUserProfile(newUserInfo);
        } else {
            this.props.changePassword(this.props.user.userId, this.pwdForm.value.password);
        }
    }

    handleTabChange = (event, tab) => {
        this.setState({
            currentTab: tab
        });
    }

    render() {
        const { user, classes } = this.props;

        if (!user) {
            return <Redirect to='/login' />
        }

        if (!this.state.userFormFilled) {
            return <SecondaryLoading></SecondaryLoading>
        }

        this.userForm.patchValue({
            partnerId: user.partnerId,
            companyName: user.companyName,
            userName: user.userName,
            title: user.title,
            firstName: user.firstName,
            lastName: user.lastName,
            userEmail: user.userEmail,
            designationId: user.designationId,
            address1: user.address1,
            address2: user.address2,
            address3: user.address3,
            subrub: user.subrub,
            stateId: user.stateId,
            countryId: user.countryId || 1, // 1 stands for Australia, as default
            postalCode: user.postalCode,
        });

        return (
            <div className={classes.root}>
                <Typography variant="h5">
                    Edit Profile
                </Typography>
                <Paper className={classes.paper} elevation={8}>
                    <Tabs
                        value={this.state.currentTab}
                        onChange={this.handleTabChange}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="full width tabs example"
                    >
                        <LinkTab icon={<i className="fas fa-user" />} label="General information"
                            href="/login" {...a11yProps(0)} />
                        <LinkTab icon={<i className="fas fa-key" />} label="Change Password"
                            href="/register" {...a11yProps(1)} />
                    </Tabs>

                    <TabPanel value={this.state.currentTab} index={0}>
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
                            :
                            <FieldGroup control={this.userForm} render={({ get, invalid }) => (
                                <div>
                                    <p style={{ color: 'red' }}>* Required fields</p>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <FieldControl
                                                name="companyName"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        required: true,
                                                        label: "Company name",
                                                        placeholder: 'Enter your company name'
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
                                                        label: "First Name",
                                                        required: true,
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
                                                        label: "Last Name",
                                                        required: true,
                                                        placeholder: 'Enter your last name'
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
                                                        required: true,
                                                        placeholder: 'Enter your email'
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
                                                        required: false,
                                                        placeholder: 'Enter address1'
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
                                                        required: false,
                                                        placeholder: 'Enter address2'
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
                                                        placeholder: 'Enter address3'
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
                                                        required: false,
                                                        className: 'customermanagement_inputbox',
                                                        placeholder: 'Enter subrub'
                                                    }
                                                }
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
                                                                    <BusinessCenterIcon />
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
                                                name="postalCode"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "Postal Code",
                                                        required: false,
                                                        placeholder: 'Enter postal code'
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Button variant="contained" color="primary" size="large"
                                            startIcon={<i className="fas fa-edit"></i>} disabled={invalid}
                                            onClick={this.submit}>
                                            &nbsp;Update
                                            </Button>
                                    </Grid>
                                </div>
                            )} />
                        }
                    </TabPanel>

                    <TabPanel value={this.state.currentTab} index={1}>
                        <div>
                            <p style={{ color: 'red' }}>* Required fields</p>

                            <FieldGroup control={this.pwdForm} render={({ get, invalid }) => (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FieldControl
                                            name="password"
                                            render={PasswordInput}
                                            meta={
                                                {
                                                    label: "Password",
                                                    hint: '',
                                                    required: true,
                                                    placeholder: 'Enter your password'
                                                }
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FieldControl
                                            name="passwordConfirm"
                                            render={ConfirmPassword}
                                            meta={
                                                {
                                                    label: "Confirm Password",
                                                    required: true,
                                                    placeholder: 'Confirm your password'
                                                }
                                            }
                                        />
                                    </Grid>
                                    <Button variant="contained" color="primary" size="large"
                                        startIcon={<EditIcon />} disabled={invalid}
                                        onClick={this.submit}>
                                        &nbsp;Update
                                            </Button>
                                </Grid>
                            )} />
                        </div>
                    </TabPanel>
                </Paper>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        error: state.auth.changePasswordLIError || state.auth.updateProfileError,
        message: state.auth.changePasswordLIMessage || state.auth.updateProfileMessage
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUserProfile: user => dispatch(updateProfile(user)),
        changePassword: (userId, newPassword) => dispatch(changePasswordLogedIn(userId, newPassword))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(useStyles)(UserProfile));
