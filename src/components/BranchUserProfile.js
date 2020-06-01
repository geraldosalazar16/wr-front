import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateProfileBranchUser, changePasswordLogedIn } from '../store/actions/authActions'
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
import Button from "@material-ui/core/Button";
import PasswordInput from "./Form/PasswordInput";
import ConfirmPassword from "./Form/ConfirmPassword";

import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Skeleton from '@material-ui/lab/Skeleton';

import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import EditIcon from '@material-ui/icons/Edit';
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PhoneIcon from "@material-ui/icons/Phone";
import TitleIcon from '@material-ui/icons/Title';
import PersonIcon from '@material-ui/icons/Person';
import SaveIcon from '@material-ui/icons/Save';
import EmailIcon from '@material-ui/icons/Email';
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import MailIcon from "@material-ui/icons/Mail";
import LockIcon from "@material-ui/icons/Lock";

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
        currentDesignation: undefined,
        loading: false,
        currentTab: 0
    };

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

    pwdForm = FormBuilder.group({
        password: ['', Validators.compose([
            Validators.required,
            Validators.minLength(7),
            Validators.pattern('^(?=.*?[a-zA-Z])(?=.*?[0-9]).{7,}$')   //^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$
        ])],
        passwordConfirm: [''],
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
        /**
         * I need to read all the designations because I don't know the partner group
         */
        const promises = [listStates(1), getDesignations(1), getDesignations(2)];
        const { branchUser } = this.props;
        this.setState({ loading: true });
        Promise.all(promises).then(result => {
            const states = result[0].map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
            const designations = result[1].concat(result[2])
            const currentDesignation = designations.find(d => d.id === branchUser.designationId);
            this.setState({
                states,
                designations: designations.map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>),
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
                this.setState({ loading: false });
            })
        })
            .catch(e => {
                this.setState({ loading: false });
                console.log('Error', e);
            })
    }

    TextDesignation = ({ handler, value }) => {
        return this.state.currentDesignation ? (<TextField {...handler()}
            disabled
            id="outlined-disabled"
            label="Designation"
            value={value}
            variant="outlined"
        />) : <div></div>
    }

    SelectD = ({ handler, touched, hasError, meta, onChange, value }) => {
        const requiredError = touched && hasError("required") && `${meta.label || 'Field'} required`;
        const error = requiredError ? true : false;
        return (
            <TextField {...handler()}
                disabled
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

    handleTabChange = (event, tab) => {
        this.setState({
            currentTab: tab
        });
    }

    submit = () => {
        this.props.editUser(this.userForm.value);
    }

    changePasword = () => {
        this.props.changePassword(this.props.branchUser.userId, this.pwdForm.value.password);
    }

    render() {
        const {
            branchUser,
            classes
        } = this.props;
        // Go to login if not authenticated
        if (!branchUser) {
            return <Redirect to='/login' />
        }
        if (this.state.loading) {
            return <SecondaryLoading></SecondaryLoading>
        }

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
                            <FieldGroup strict={false} control={this.userForm} render={({ get, invalid }) => (
                                <div>
                                    <p style={{ color: 'red' }}>* Required fields</p>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <FieldControl
                                                name="title"
                                                render={Select}
                                                meta={
                                                    {
                                                        label: "Title",
                                                        required: true,
                                                        icon: <TitleIcon />,
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
                                                        placeholder: 'Enter last name'
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
                                                        required: false,
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
                                                        icon: <MailIcon />,
                                                        required: false,
                                                        placeholder: 'Enter postal code'
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Button variant="contained" color="primary" size="large"
                                            startIcon={<SaveIcon />} disabled={invalid}
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
                                                    icon: <LockIcon />,
                                                    required: true,
                                                    placeholder: 'Enter password'
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
                                                    label: "Confirm password",
                                                    icon: <LockIcon />,
                                                    required: true,
                                                    placeholder: 'Retype the password'
                                                }
                                            }
                                        />
                                    </Grid>
                                    <Button variant="contained" color="primary" size="large"
                                        startIcon={<EditIcon />} disabled={invalid}
                                        onClick={this.changePasword}>
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
        branchUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        editUser: (user) => dispatch(updateProfileBranchUser(user)),
        changePassword: (userId, password) => dispatch(changePasswordLogedIn(userId, password))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(useStyles)(BranchUserProfile));
