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
import { mySQLDate, prettifyDate } from '../services/utilsService';
import CustomerImage from './CustomerImage';
import { FieldControl, FieldGroup, FormBuilder, Validators } from "react-reactive-form"
import TextInput from './Form/TextInput'
import EmailInput from './Form/EmailInput'
import Select from './Form/Select'

import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import MenuItem from '@material-ui/core/MenuItem';
import Paper from "@material-ui/core/Paper";
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';

import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TitleIcon from '@material-ui/icons/Title';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import WcIcon from '@material-ui/icons/Wc';
import CardMembershipIcon from '@material-ui/icons/CardMembership';
import PublicIcon from '@material-ui/icons/Public';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

import MomentUtils from "@date-io/moment";
import {
    MuiPickersUtilsProvider,
    DatePicker
} from "@material-ui/pickers";

import MaterialTable from 'material-table'

const MyDatePicker = ({ handler, touched, hasError, meta, onChange, value }) => {
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid container item xs={12}>
                <DatePicker
                    label={'Date of Birth'}
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

const contacts = [
    {
        id: 1,
        firstName: '',
        lastName: '',
        email: '',
        contactNo: '',
        dob: ''
    },
    {
        id: 2,
        firstName: '',
        lastName: '',
        email: '',
        contactNo: '',
        dob: ''
    },
    {
        id: 3,
        firstName: '',
        lastName: '',
        email: '',
        contactNo: '',
        dob: ''
    }
];

class CustomerEdit extends Component {

    state = {
        currentImage: undefined,
        formInvalid: true,
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
        contacts: [],
        checked: false,
        detailsTab: 0,
        contactsLoaded: false
    }

    formRef = null;

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
        dob: ['', Validators.required],
        gender: ['', Validators.required],
        countryId: [1], // 1 stands for Australia, as default
        noOfProperties: ['', Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]+$')
        ])],
        //wrSubscription: [true]
        wrSubscription: ['', Validators.required]
    });

    fillForm(customer) {
        if (customer.wrSubscription === true) {
            customer.wrSubscription = 1;
        } else {
            customer.wrSubscription = 0;
        }
        this.form.patchValue({
            customerTitle: customer.customerTitle,
            customerName: customer.customerName ? customer.customerName : customer.name,
            firstName: customer.firstName,
            lastName: customer.lastName,
            customerEmail: customer.customerEmail ? customer.customerEmail : customer.email,
            contactNo: customer.contactNo,
            dob: customer.dob,
            gender: customer.gender,
            countryId: customer.countryId,
            noOfProperties: customer.noOfProperties,
            wrSubscription: customer.wrSubscription
        });
        this.setState({
            currentImage: customer.image,
            loading: false
        });
    }

    componentDidMount() {
        const { customer, branchId, customerId } = this.props;
        if (customer) {
            this.fillForm(customer);
        } else {
            this.props.getCustomersOfBranch(branchId);
            this.props.editCustomer(customerId)
        }
    }

    componentDidUpdate(prevProps) {
        const { customer } = this.props;
        const prevCustomer = prevProps.customer;
        if (customer && (!prevCustomer || prevCustomer.id !== customer.id)) {
            this.fillForm(customer);
        }
    }

    submit = () => {
        const customer = Object.assign(this.props.customer, this.form.value);
        /**
         * When you read the customer list, it comes with an id property and a customerId,
         * that is in fact the promo code
         * but then when you need to edit the customer, it ask for the customerId to be the id
         */
        customer.customerId = this.props.customerId;
        // Format date
        customer.dateOfBirth = mySQLDate(customer.dob);
        customer.image = this.state.currentImage;
        // customer.wrSubscription = this.state.wrSubscription;

        // Contacts mapping
        const mapedContacts = this.props.listContacts.map(c => {
            let date;
            if (!c.dob) {
                const jsDate = new Date();
                date = prettifyDate(jsDate);
            } else {
                date = prettifyDate(c.dob);
            }
            return {
                customerId: this.props.customer.id,
                firstName: c.firstName,
                lastName: c.lastName,
                email: c.email,
                contactno: c.contactNo,
                dateOfBirth: date
            }
        });
        customer.contactsList = mapedContacts;
        this.props.updateCustomer(customer);
    }

    handleImageChange = (image) => {
        this.setState({ currentImage: image });
    }

    handleChangeSwitch = () => {
        const currentValue = this.state.wrSubscription;
        this.setState({ wrSubscription: !currentValue });
    }

    updateContacts = (contactData, index) => {
        const currentContacts = this.state.contacts;
        const newContacts = currentContacts.map(contact => contact.id === contactData.id ? contactData : contact);
        this.setState({ contacts: newContacts });
    }

    handleChange = (checked) => {
        this.setState({ checked });
        this.form.patchValue({
            wrSubscription: checked ? 1 : 0
        });
    }

    handleTabClick(tab) {
        this.setState({
            detailsTab: tab
        })
    }

    handleUpdateContact = (contacts) => {
        this.setState({ contacts });
    }

    render() {
        const {
            user,
            classes
        } = this.props;

        if (!user) {
            return <Redirect to='/login' />
        }
        const onRowAdd = this.props.listContacts && this.props.listContacts.length === 3 ?
        undefined : newData => {
            return new Promise(resolve => {
                /*
                const contacts = [...this.state.contacts];
                const data = Object.assign({}, newData, { id: contacts.length + 1 })
                contacts.push(data);
                this.handleUpdateContact(contacts);
                */
                const data = Object.assign({}, newData, { id: contacts.length + 1 });
                this.props.addCustomerContact(data);
                resolve();
            })
        };
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="h5" component="h5">
                            Edit Customer
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
                                        <Grid item xs={12}>
                                            <FieldControl
                                                name="customerName"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "Customer Name",
                                                        icon: <PersonIcon />,
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
                                                        icon: <PersonIcon />,
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
                                                        icon: <PersonIcon />,
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
                                                        icon: <EmailIcon />,
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
                                                        icon: <PhoneIcon />,
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
                                                        icon: <WcIcon />,
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
                                                        label: "WR Subscription",
                                                        required: true,
                                                        icon: <CardMembershipIcon />,
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
                                                        label: "Country",
                                                        icon: <PublicIcon />,
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
                                                        icon: <AccountBalanceIcon />,
                                                        required: true,
                                                        placeholder: 'Number of properties'
                                                    }
                                                }
                                            />
                                        </Grid>
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
                            icons={{
                                Add: props => (
                                    <Button {...props} variant="contained" size="small" color="primary">
                                        Add new contact
                                    </Button>
                                )
                            }}
                            columns={this.state.columns}
                            data={this.props.listContacts}
                            editable={
                                {
                                    onRowAdd: onRowAdd,
                                    onRowUpdate: (newData, oldData) => {
                                        return new Promise(resolve => {
                                            /*
                                            const contacts = [...this.state.contacts];
                                            const index = contacts.findIndex(c => c.id === oldData.id);
                                            contacts[index] = newData;
                                            this.handleUpdateContact(contacts);
                                            */
                                            // const index = this.props.listContacts.findIndex(c => c.id === oldData.id);
                                            let formatedDate;
                                            if (typeof(newData.dob.format) !== 'function') {
                                                formatedDate = prettifyDate(newData.dob);
                                            } else {
                                                formatedDate = prettifyDate(newData.dob.format('YYYY-MM-DD'));
                                            }
                                            newData.dob = formatedDate;
                                            this.props.editCustomerContact(newData);
                                            resolve();
                                        })
                                    },
                                    onRowDelete: oldData => {
                                        return new Promise(resolve => {
                                            /*
                                            const contacts = [...this.state.contacts];
                                            const index = contacts.findIndex(c => c.id === oldData.id);
                                            contacts.splice(index, 1);
                                            this.handleUpdateContact(contacts);
                                            */
                                            const contact = this.props.listContacts.find(c => c.id === oldData.id);
                                            this.props.deleteCustomerContact(contact);
                                            resolve();
                                        })
                                    }
                                }
                            }
                        />
                    </TabPanel>
                    <TabPanel value={this.state.detailsTab} index={1}>
                        
                    </TabPanel>
                </Paper>
                <Button 
                    variant="contained" 
                    color="primary" size="large" 
                    startIcon={<SaveIcon />}
                    className={classes.saveBtn}
                    onClick={this.submit}
                >
                    &nbsp;Save
                </Button>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const branchId = ownProps.match.params.branch_id;
    const customerId = ownProps.match.params.customer_id;
    const customer = state.customer.customers.find(c => c.id === parseInt(ownProps.match.params.customer_id, 10))
    return {
        user: state.auth.user,
        customers: state.customer.customers,
        listContacts: state.customer.listContacts,
        customer,
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
)(withStyles(useStyles)(CustomerEdit));
