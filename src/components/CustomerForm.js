
import React, { Component } from 'react'
import {
    FormBuilder,
    FieldGroup,
    FieldControl,
    Validators
} from "react-reactive-form";
import { toast } from 'react-toastify'
import TextInput from './Form/TextInput'
import Select from './Form/Select'
import EmailInput from './Form/EmailInput'
import RadioInput from './Form/RadioInput'
import OnOffInput from './Form/OnOffInput'
import DateInput from './Form/DateInput'
import SecondaryLoading from './SecondaryLoading'
/*
export default class CustomerForm extends Component {

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
            Validators.pattern('^[0-9]+$')
        ])],
        dob: ['', Validators.required],
        gender: ['', Validators.required],
        countryId: [1], // 1 stands for Australia, as default
        noOfProperties: ['', Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]+$')
        ])],
        wrSubscription: [1, Validators.compose([
            Validators.required,
            Validators.pattern('^[0-1]+$')
        ])]
    });

    render() {
        const {
            action,
            customer
        } = this.props;
        if (customer && action === 'edit') {
            form.patchValue({
                customerTitle: customer.customerTitle,
                customerName: customer.customerName,
                firstName: customer.firstName,
                lastName: customer.lastName,
                customerEmail: customer.customerEmail,
                contactNo: customer.contactNo,
                dob: customer.dob,
                gender: customer.gender,
                countryId: customer.countryId,
                noOfProperties: customer.noOfProperties,
                wrSubscription: customer.wrSubscription
            });
        }
        return (
            <FieldGroup control={this.form}
                render={({ get, invalid }) => {
                    this.props.submit(invalid);
                    return (
                    <div>
                        <p style={{ color: 'red' }}>* Required fields</p>
                        <form>
                            <table className="table table-bordered" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    <tr className={action === 'create' ? 'hidden' : ''}>
                                        <td width="30%">Customer ID </td>
                                        <td width="70%">{customer && customer.id}</td>
                                    </tr>
                                    <tr>
                                        <td>Title</td>
                                        <td>
                                            <FieldControl
                                                name="customerTitle"
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
                                        <td>Customer Name</td>
                                        <td>
                                            <FieldControl
                                                name="customerName"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "",
                                                        required: true,
                                                        className: 'customermanagement_inputbox',
                                                        placeholder: 'Customer name'
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
                                        <td>Email Address</td>
                                        <td>
                                            <FieldControl
                                                name="customerEmail"
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
                                        <td>Contact Number</td>
                                        <td>
                                            <FieldControl
                                                name="contactNo"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "",
                                                        required: true,
                                                        className: 'customermanagement_inputbox',
                                                        placeholder: 'Contact number'
                                                    }
                                                }
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>DOB</td>
                                        <td>
                                            <FieldControl
                                                name="dob"
                                                render={DateInput}
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
                                        <td>Gender</td>
                                        <td>
                                            <FieldControl
                                                name="gender"
                                                render={Select}
                                                meta={
                                                    {
                                                        label: "",
                                                        required: true,
                                                        className: 'customermanagement_inputbox',
                                                        options: [
                                                            <option key="1" value="m"> Male</option>,
                                                            <option key="2" value="f" > Female</option>
                                                        ]
                                                    }
                                                }
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Subscribe to WR</td>
                                        <td>
                                            <FieldControl
                                                name="wrSubscription"
                                                render={OnOffInput}
                                                meta={
                                                    {
                                                        checked: true,
                                                        label: "",
                                                        className: 'customermanagement_inputbox',
                                                        placeholder: ''
                                                    }
                                                }
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Number of Properties</td>
                                        <td>
                                            <FieldControl
                                                name="noOfProperties"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "",
                                                        required: true,
                                                        className: 'customermanagement_inputbox',
                                                        placeholder: 'Number of properties'
                                                    }
                                                }
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                )}
            }
            />
        )
    }
}
*/

export default function CustomerForm({
    action,
    customer,
    submit
}) {
    const form = FormBuilder.group({
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
        wrSubscription: [1, Validators.compose([
            Validators.required,
            Validators.pattern('^[0-1]+$')
        ])]
    });

    if (customer && action === 'edit') {
        form.patchValue({
            customerTitle: customer.customerTitle,
            customerName: customer.customerName,
            firstName: customer.firstName,
            lastName: customer.lastName,
            customerEmail: customer.customerEmail,
            contactNo: customer.contactNo,
            dob: customer.dob,
            gender: customer.gender,
            countryId: customer.countryId,
            noOfProperties: customer.noOfProperties,
            wrSubscription: customer.wrSubscription
        });
    }

    function eventSubmitCustomer() {
        submit(form.value);
    }

    return (
        <FieldGroup control={form}
            render={({ get, invalid }) => (
                <div>
                    <p style={{ color: 'red' }}>* Required fields</p>
                    <form>
                        <table className="table table-bordered" cellPadding="0" cellSpacing="0">
                            <tbody>
                                <tr className={action === 'create' ? 'hidden' : ''}>
                                    <td width="30%">Customer ID </td>
                                    <td width="70%">{customer && customer.id}</td>
                                </tr>
                                <tr>
                                    <td>Title</td>
                                    <td>
                                        <FieldControl
                                            name="customerTitle"
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
                                    <td>Customer Name</td>
                                    <td>
                                        <FieldControl
                                            name="customerName"
                                            render={TextInput}
                                            meta={
                                                {
                                                    label: "",
                                                    required: true,
                                                    className: 'customermanagement_inputbox',
                                                    placeholder: 'Customer name'
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
                                    <td>Email Address</td>
                                    <td>
                                        <FieldControl
                                            name="customerEmail"
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
                                    <td>Contact Number</td>
                                    <td>
                                        <FieldControl
                                            name="contactNo"
                                            render={TextInput}
                                            meta={
                                                {
                                                    label: "",
                                                    hint: '',
                                                    required: true,
                                                    className: 'customermanagement_inputbox',
                                                    placeholder: 'Use only numbers.  Min 10 and Max 12.'
                                                }
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>DOB</td>
                                    <td>
                                        <FieldControl
                                            name="dob"
                                            render={DateInput}
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
                                    <td>Gender</td>
                                    <td>
                                        <FieldControl
                                            name="gender"
                                            render={Select}
                                            meta={
                                                {
                                                    label: "",
                                                    required: true,
                                                    className: 'customermanagement_inputbox',
                                                    options: [
                                                        <option key="1" value="m"> Male</option>,
                                                        <option key="2" value="f" > Female</option>
                                                    ]
                                                }
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Subscribe to WR</td>
                                    <td>
                                        <FieldControl
                                            name="wrSubscription"
                                            render={OnOffInput}
                                            meta={
                                                {
                                                    checked: true,
                                                    label: "",
                                                    className: 'customermanagement_inputbox',
                                                    placeholder: ''
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
                                    <td>Number of Properties</td>
                                    <td>
                                        <FieldControl
                                            name="noOfProperties"
                                            render={TextInput}
                                            meta={
                                                {
                                                    label: "",
                                                    required: true,
                                                    className: 'customermanagement_inputbox',
                                                    placeholder: 'Number of properties'
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
                            <button type="button" disabled={invalid} className="btn-one" onClick={eventSubmitCustomer}>
                                <i className="fas fa-edit"></i>
                                Save
                    </button>
                        </div>
                    </div>
                </div>
            )}
        />
    )
}
