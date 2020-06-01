import React, { Component } from 'react'
import CustomerContact from './CustomerContact'
import {
    FormBuilder,
    FieldGroup,
    FieldControl,
    Validators
} from "react-reactive-form"
import TextInput from './Form/TextInput'
import EmailInput from './Form/EmailInput'
import DateInput from './Form/DateInput'
import Select from './Form/Select'
import OnOffInput from './Form/OnOffInput'


export default class CustomerContactList extends Component {
    form1= FormBuilder.group({
        id: [''],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.compose([
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
    });

    componentDidMount() {
        const {
            update
        } = this.props;
        this.form1.get('firstName').valueChanges.subscribe((fn) => {
            update(this.form1.value);
        });
        this.form1.get('lastName').valueChanges.subscribe((ln) => {
            update(this.form1.value);
        });
        this.form1.get('email').valueChanges.subscribe((email) => {
            update(this.form1.value);
        });
        this.form1.get('contactNo').valueChanges.subscribe((cn) => {
            update(this.form1.value);
        });
        this.form1.get('dob').valueChanges.subscribe((dob) => {
            update(this.form1.value);
        });
    }

    render() {
        const {
            contacts,
            updateContacts
        } = this.props;
        return (
            <div>
                <p style={{ color: 'red' }}>* Required fields</p>
                <table className="table table-bordered" cellSpacing="0" cellPadding="0" align="left">
                    <thead>
                        <tr>
                            <th width="20%">First Name</th>
                            <th width="20%">Last Name</th>
                            <th width="20%">Email  Address</th>
                            <th width="20%">Contact Number</th>
                            <th width="20%">Date of Birth</th>
                        </tr>
                    </thead>
                    <tbody>
                        <FieldGroup control={this.form1}
                            render={({ get, invalid }) => {
                                return (
                                    <tr>
                                        <td>
                                            <FieldControl
                                                name="firstName"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "",
                                                        required: true,
                                                        className: 'customermanagement_inputbox',
                                                        placeholder: 'Contact name'
                                                    }
                                                }
                                            />
                                        </td>
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
                                        <td>
                                            <FieldControl
                                                name="email"
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
                                        <td>
                                            <FieldControl
                                                name="contactNo"
                                                render={TextInput}
                                                meta={
                                                    {
                                                        label: "",
                                                        hint: 'Use only numbers.  Min 10 and Max 12.',
                                                        required: true,
                                                        className: 'customermanagement_inputbox',
                                                        placeholder: 'Contact Number'
                                                    }
                                                }
                                            />
                                        </td>
                                        <td>
                                            <FieldControl
                                                name="dob"
                                                render={DateInput}
                                                meta={
                                                    {
                                                        label: "",
                                                        required: true,
                                                        className: 'customermanagement_inputbox',
                                                        placeholder: 'Date of Birth'
                                                    }
                                                }
                                            />
                                        </td>
                                    </tr>
                                )
                            }
                            }
                        />
                    </tbody>
                </table>
            </div>
        )
    }
}
