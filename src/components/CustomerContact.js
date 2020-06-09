import React, { Component } from 'react'
import {
    FormBuilder,
    FieldGroup,
    FieldControl,
    Validators
} from "react-reactive-form"
import TextInput from './Form/TextInput'
import EmailInput from './Form/EmailInput'
import DateInput from './Form/DateInput'

export default class CustomerContact extends Component {

    state = {
        formFilled: false
    }

    form = FormBuilder.group({
        id: [''],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.compose([
            Validators.required,
            Validators.email
        ])],
        contactNo: ['', Validators.compose([
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern('^[0-9]+$')
        ])],
        dob: [null, Validators.required],
    });

    componentDidMount() {
        const {
            update
        } = this.props;
        this.form.get('firstName').valueChanges.subscribe((fn) => {
            update(this.form.value);
        });
        this.form.get('lastName').valueChanges.subscribe((ln) => {
            update(this.form.value);
        });
        this.form.get('email').valueChanges.subscribe((email) => {
            update(this.form.value);
        });
        this.form.get('contactNo').valueChanges.subscribe((cn) => {
            update(this.form.value);
        });
       this.form.get('dob').valueChanges.subscribe((dob) => {
            update(this.form.value);
        });
    }

    compareContacts = (c1, c2) => {
        return c1.firstName !== c2.firstName;
    }

    render() {
        const {
            contact
        } = this.props;
        this.form.patchValue({
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            contactNo: contact.contactNo,
            dob: contact.dob
        }, 
        {
            onlySelf: true,
            emitEvent: false
        });
        return (
            <FieldGroup control={this.form}
                render={({ get, invalid }) => {
                    return (
                        <tr>
                            <td>
                                <FieldControl
                                    name="firstName"
                                    render={TextInput}
                                    meta={
                                        {
                                            value: contact.firstName,
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
        )
    }
}
