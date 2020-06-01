import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    finishEditCustomer,
    update,
    list,
    startCustomerEdit,
    getCustomerOfUserxID,
    listByBranch,
    addContact,
    editContact,
    deleteContact
} from '../store/actions/customerActions'
import { prettifyDate } from '../services/utilsService';
import CustomerImage from './CustomerImage';

import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import MomentUtils from "@date-io/moment";
import {
    MuiPickersUtilsProvider,
    DatePicker
} from "@material-ui/pickers";

import MaterialTable from 'material-table'

const ContactDatePicker = ({ value, onChange }) => {
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid container item xs={12}>
                <DatePicker
                    keyboard="true"
                    placeholder="MM/DD/YYYY"
                    format={"MM/DD/YYYY"}
                    value={value}
                    onChange={onChange}
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
        marginTop: '16px',
        padding: '16px',
        '& .MuiTextField-root': {
            width: '100%'
        },
        '& .MuiFormControl-root': {
            width: '100%'
        },
        '& .MuiToolbar-root.MuiToolbar-regular.MTableToolbar-root-318.MuiToolbar-gutters': {
            minHeight: '0 !important'
        },
    },
    saveBtn: {
        marginTop: '8px'
    },
    conainer: {
        border: '1px solid #red'
    }
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

class CustomerDetails extends Component {

    state = {
        currentImage: undefined,
        loading: true,
        wrSubscription: true,
        columns: [
            { title: 'First Name', field: 'firstName' },
            { title: 'Last Name', field: 'lastName' },
            { title: 'Email', field: 'email' },
            { title: 'Contact Number', field: 'contactNo', type: 'numeric' },
            {
                title: 'Date of Birth',
                field: 'dob',
                editComponent: ContactDatePicker
            },
        ],
        checked: false,
        detailsTab: 0
    }

    componentDidMount() {
        const { customer, branchId, customerId } = this.props;
        if (!customer) {
            this.props.getCustomersOfBranch(branchId);
            this.props.editCustomer(customerId)
        }
    }

    handleTabClick(tab) {
        this.setState({
            detailsTab: tab
        })
    }

    render() {
        const {
            user,
            classes,
            customer
        } = this.props;

        if (!user) {
            return <Redirect to='/login' />
        }

        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="h5" component="h5">
                            Customer Details
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
                            <Grid container spacing={3} className={classes.container}>
                                <Grid item xs={4}>
                                    <Typography  gutterBottom>
                                        Customer Title
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography  gutterBottom>
                                        {customer && customer.customerTitle}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>
                                        Customer Name
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom>
                                        {customer && customer.customerName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>
                                        First Name
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom>
                                        {customer && customer.firstName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>
                                        Last Name
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom>
                                        {customer && customer.lastName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>
                                        Email
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom>
                                        {customer && customer.customerEmail}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>
                                        Contact Number
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom>
                                        {customer && customer.contactNo}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>
                                        Date of Birth
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom>
                                        {customer && customer.dob}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>
                                        Gender
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom>
                                        {customer && customer.gender}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>
                                        WR Subscription
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom>
                                        {customer && customer.wrSubscription}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>
                                        Country
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography  gutterBottom>
                                        {customer && customer.country}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>
                                        Number of Properties
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom>
                                        {customer && customer.noOfProperties}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <CustomerImage image={this.props.image} imageChanged={this.handleImageChange} mode={'view'} />
                    </Grid>
                </Grid>
                <Paper className={classes.paper} elevation={8}>
                    <Tabs
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        value={this.state.detailsTab}
                        onChange={(e, newValue) => this.handleTabClick(newValue)}
                        aria-label="simple tabs example"
                    >
                        <Tab label="Contacts" {...a11yProps(0)} />
                        <Tab label="Subscriptions" {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={this.state.detailsTab} index={0}>
                        <MaterialTable
                            options={{
                                showTitle: false,
                                search: false,
                                paging: false
                            }}
                            columns={this.state.columns}
                            data={this.props.listContacts}
                        />
                    </TabPanel>
                    <TabPanel value={this.state.detailsTab} index={1}>

                    </TabPanel>
                </Paper>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const branchId = ownProps.match.params.branch_id;
    const customerId = ownProps.match.params.customer_id;
    let customer = state.customer.customers.find(c => c.id === parseInt(ownProps.match.params.customer_id, 10));
    let image = '';
    if (customer) {
        if (customer.wrSubscription === true) {
            customer.wrSubscription = 'Yes';
        } else {
            customer.wrSubscription = 'No';
        }
        customer.customerName = customer.customerName ? customer.customerName : customer.name;
        customer.customerEmail = customer.customerEmail ? customer.customerEmail : customer.email;
        if (typeof(customer.dob === 'object')) {
            customer.dob = prettifyDate(customer.dob);
        }
        customer.country = 'Australia';
        image = customer.image;
    }

    return {
        user: state.auth.user,
        customers: state.customer.customers,
        listContacts: state.customer.listContacts,
        customer,
        image,
        branchId,
        customerId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getCustomersOfUser: () => dispatch(list(true)),
        updateCustomer: (customer) => dispatch(update(customer)),
        editCustomer: (customer) => dispatch(startCustomerEdit(customer)),
        getCustomerOfUserxID: (id) => dispatch(getCustomerOfUserxID(id)),
        getCustomersOfBranch: (branchId) => dispatch(listByBranch(branchId)),
        finish: () => dispatch(finishEditCustomer()),
        addCustomerContact: (contact) => dispatch(addContact(contact)),
        editCustomerContact: (contact) => dispatch(editContact(contact)),
        deleteCustomerContact: (contact) => dispatch(deleteContact(contact))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(useStyles)(CustomerDetails));
