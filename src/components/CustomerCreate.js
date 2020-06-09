import React, { Component} from 'react'
import { Link, Redirect} from 'react-router-dom'
import { connect } from 'react-redux'
import { create } from '../store/actions/customerActions'
import CustomerImage from './CustomerImage';
import { FieldControl, FieldGroup, FormBuilder, Validators } from "react-reactive-form";
import TextInput from './Form/TextInput'
import Select from './Form/Select'
import EmailInput from './Form/EmailInput'
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import MenuItem from '@material-ui/core/MenuItem';
import Paper from "@material-ui/core/Paper";
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MomentUtils from "@date-io/moment";
import {
    MuiPickersUtilsProvider,
    DatePicker
} from "@material-ui/pickers";  

const MyDatePicker = ({ handler, touched, hasError, meta, value, onChange}) => {
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container item xs={12}>
            <DatePicker {...handler()}
              label={'Date of Birth'}
              keyboard
              placeholder="MM/DD/YYYY"
              format={"MM/DD/YYYY"}
              // handle clearing outside => pass plain array if you are not controlling value outside
              mask={value =>
                value
                  ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
                  : []
              }
              value={value}
              onChange={onChange}
              disableOpenOnEnter
              animateYearScrolling={false}
              autoOk={true}
              clearable
            />
          </Grid>
        </MuiPickersUtilsProvider>
    )
}

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
            width: '100%'
        },
        '& .MuiFormControl-root': {
            margin: '16px',
            width: '100%'
        },
    },
    paper: {
        padding: '16px',
        '& .MuiTextField-root': {
            width: '100%'
        },
        '& .MuiFormControl-root': {
            width: '100%'
        },
    }
});
class CustomerCreate extends Component {

    state = {
        customer: null,
        currentImage: undefined,
        formFilled: false,
            }

    form = FormBuilder.group({
        customerTitle: ['', Validators.required],
        customerName: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        customerEmail: ['', Validators.compose([
            Validators.required,
            Validators.email
        ])],
        contactNo: ['', Validators.compose([
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(10),
            Validators.pattern('^[0-9]+$')
        ])],
        dob: [null, Validators.required],
        gender: ['', Validators.required],
        countryId: [1], // 1 stands for Australia, as default
        noOfProperties: ['', Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]+$')
        ])],
        wrSubscription: [0, Validators.compose([
            Validators.required
        ])]
    });

    submit = () => {
        // Format date
        const customer = this.form.value;
        /*
        const jsDate = customer.dob;
        const year = jsDate.getFullYear();
        let month = jsDate.getMonth();
        month = month + 1;
        if (month < 10) {
            month = `0${month}`
        }
        let day = jsDate.getDate();
        if (day < 10) {
            day = `0${day}`
        }
        const formatedDate = `${year}-${month}-${day}`;
        */
        let formatedDate;
        if (typeof(customer.dob.format) !== 'function') {
            const jsDate = customer.dob;
            const year = jsDate.getFullYear();
            let month = jsDate.getMonth();
            month = month + 1;
            if (month < 10) {
                month = `0${month}`
            }
            let day = jsDate.getDate();
            if (day < 10) {
                day = `0${day}`
            }
            formatedDate = `${year}-${month}-${day}`;
        } else {
            formatedDate = customer.dob.format('YYYY-MM-DD');
        } 
        customer.dateOfBirth = formatedDate;
        customer.image = this.state.currentImage;
        customer.branchId = this.props.branchId
        this.props.createCustomer(customer);
                         
    } 

    handleImageChange = (image) => {
        this.setState({ currentImage: image });
    }

    render() {
        const {
            user,
            classes
        } = this.props;

        if (!user) {
            return <Redirect to='/login' />
        }

        // validation by the type of role
        if (user.roleId !== 3) {
            return <Redirect to='' />
        }

        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="h5" component="h5">
                            Create Customer
                        </Typography>
                    </Grid>
                    <Grid item xs={6}
                        container
                        direction="row"
                        justify="flex-end">
                        <Button variant="contained" color="primary" size="large" startIcon={<ArrowBackIcon />}
                            component={Link} className={classes.btn}
                            to={`/branch-customers/${this.props.branchId}`}>
                            &nbsp;Back to Customer List
                    </Button>
                    </Grid>
                </Grid>
                <hr className="spacer30px" />
                <Grid container spacing={3}>
                    <Grid item xs={8}>                   
                        <Paper className={classes.paper} elevation={8}>
                            <FieldGroup control={this.form} render={({ get, invalid }) => (
                                <div>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography style={{ color: 'red' }}>
                                                * Required fields
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="customerTitle"
                                                render={Select}
                                                meta={
                                                    {
                                                        label: "Title",
                                                        required: true,
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
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="customerName"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "Customer Name",
                                                        required: true,
                                                        placeholder: 'Customer name'
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="firstName"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "First Name",
                                                        required: true,
                                                        placeholder: 'First name'
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="lastName"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "Last Name",
                                                        required: true,
                                                        placeholder: 'Last name'
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="customerEmail"
                                                render={EmailInput}
                                                meta={
                                                    {
                                                        label: "Email",
                                                        required: true,
                                                        placeholder: 'Email'
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="contactNo"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "Contact Number",
                                                        required: true,
                                                        placeholder: 'Only numbers. Min 10 and Max 12'
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="dob"
                                                render={MyDatePicker}
                                                meta={
                                                    {
                                                        label: "Date of Birdth",
                                                        required: true,
                                                        className: 'customermanagement_inputbox',
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="gender"
                                                render={Select}
                                                meta={
                                                    {
                                                        label: "Gender",
                                                        required: true,
                                                        options: [
                                                            <MenuItem key="1" value={"Male"}>Male</MenuItem>,
                                                            <MenuItem key="2" value={"Female"}>Female</MenuItem>
                                                        ]
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="wrSubscription"
                                                render={Select}
                                                meta={
                                                    {
                                                        label: "",
                                                        required: true,
                                                        className: 'customermanagement_inputbox',
                                                        options: [
                                                            <MenuItem key="1" value={"0"}>No</MenuItem>,
                                                            <MenuItem key="2" value={"1"}>Yes</MenuItem>
                                                        ]
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="countryId"
                                                render={Select}
                                                meta={
                                                    {
                                                        label: "",
                                                        required: true,
                                                        className: 'customermanagement_inputbox',
                                                        options: [
                                                            <MenuItem key="1" value={"1"}>Australia</MenuItem>,
                                                        ]
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="noOfProperties"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "Number of Properties",
                                                        required: true,
                                                        placeholder: 'Number of properties'
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Button variant="contained" color="primary" size="large"
                                            startIcon={<SaveIcon />}
                                            disabled={invalid}
                                            onClick={this.submit}
                                            >
                                            &nbsp;Save
                                        </Button>
                                    </Grid>
                                </div>
                            )}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <CustomerImage image={this.state.currentImage} imageChanged={this.handleImageChange} />                       
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const branchId = ownProps.match.params.branch_id;
    return {
        branchId,
        user: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createCustomer: (branch) => dispatch(create(branch))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(useStyles)(CustomerCreate));

