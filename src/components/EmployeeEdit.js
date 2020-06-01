import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {
    list,
    listUsers,
    editBranchUser
} from '../store/actions/branchActions'


import {FieldControl, FieldGroup, FormBuilder, Validators} from "react-reactive-form";

import Select from './Form/Select'
import TextInput from './Form/TextInput'
import EmailInput from './Form/EmailInput'
import PasswordInput from './Form/PasswordInput'
import ConfirmPassword from './Form/ConfirmPassword'

import {listStates} from '../services/stateService';
import {getDesignations} from '../services/designationService'
import SecondaryLoading from './SecondaryLoading'
import {withStyles} from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import MenuItem from "@material-ui/core/MenuItem";
import PhoneIcon from "@material-ui/icons/Phone";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import PublicIcon from "@material-ui/icons/Public";
import MailIcon from "@material-ui/icons/Mail";
import FlagIcon from "@material-ui/icons/Flag";
import SaveIcon from "@material-ui/icons/Save";

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
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const {children, value, index, ...other} = props;

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

class EmployeesEdit extends Component {

    state = {
        loading: true,
        currentTab: 0,
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
                passwordConfirmationInput.setErrors({mismatch: true});
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
                this.setState({loading: true});
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

        const {user, branchUser, branch} = this.props;
        if (user && branchUser) {
            const {partnerId} = user;
            const promises = [listStates(1), getDesignations(partnerId)];
            Promise.all(promises).then(result => {
                const states = result[0].map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
                const designations = result[1].map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
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
        } else {
            if (branch) {
                this.props.reloadUsers(this.props.user.userId, branch);
            } else {
                this.props.reloadBranches();
            }
            this.setState({loading: false});
        }
    }

    componentDidUpdate(prevProps) {

        const {branchUser} = this.props;
        const prevUser = prevProps.branchUser;

        if (branchUser && (!prevUser || prevUser.userId !== branchUser.userId)) {
            this.fillForm(branchUser, this.props.user.userId)
        } else {
            const {branch} = this.props;
            const prevBranch = prevProps.branch;

            if (branch && (!prevBranch || prevBranch.branchId !== branch.branchId)) {
                this.props.reloadUsers(this.props.user.userId, branch);
            }
        }
    }

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

    setCurrentTab = tab => {
        this.setState({currentTab: tab});
    }

    submit = (evt) => {
        evt.preventDefault();
        if (this.state.currentTab === 0) {
            this.props.editUser(this.userForm.value);
        } else {
            this.props.changePassword(this.props.branchUser.userId, this.pwdForm.value.password);
        }
    }

    handleTabChange = (event, tab) => {
        this.setState({
            currentTab: tab
        });
    }

    render() {
        const {user, classes} = this.props;

        // Go to login if not authenticated
        if (!user) {
            return <Redirect to='/login'/>
        }

        if (this.state.loading) {
            return <SecondaryLoading></SecondaryLoading>
        }

        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="h5" component="h5">
                            Edit Employee Info
                    </Typography>
                    </Grid>
                    <Grid item xs={6}
                          container
                          direction="row"
                          justify="flex-end">
                        <Button variant="contained" color="primary" size="large"
                                startIcon={<i className="fas fa-long-arrow-alt-left"/>}
                                component={Link} className={classes.btn}
                                to="/employee-list">
                            &nbsp;Back to Employees List
                        </Button>
                    </Grid>
                </Grid>

                <hr className="spacer30px"/>

                <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
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
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Typography style={{color: 'red'}}>
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
                                                                    <MenuItem key="1" value={"1"}>Accountants &/or Tax Agents</MenuItem>,
                                                                    <MenuItem key="2" value={"2"}>Real Estate Agents</MenuItem>
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

                                                </Grid>

                                                <Button variant="contained" color="primary" size="large"
                                                        startIcon={<SaveIcon />} disabled={invalid}
                                                        onClick={this.submit}>
                                                    &nbsp;Save
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
                                                    startIcon={<SaveIcon />} disabled={invalid}
                                                    onClick={this.submit}>
                                                &nbsp;Save
                                            </Button>
                                        </Grid>
                                    )} />
                                </div>
                            </TabPanel>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const branchUser = state.employee.employeelist && state.employee.employeelist.find(u => u.userId === parseInt(ownProps.match.params.user_id))
    return {
        user: state.auth.user,
        branchUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        reloadBranches: () => dispatch(list(true)),
        reloadUsers: (userId, branch) => dispatch(listUsers(userId, branch)),
        editUser: (user) => dispatch(editBranchUser(user)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(useStyles)(EmployeesEdit));