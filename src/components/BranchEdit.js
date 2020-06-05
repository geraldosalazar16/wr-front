import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { update, list } from '../store/actions/branchActions'
import {
    FormBuilder,
    FieldGroup,
    FieldControl,
    Validators
} from "react-reactive-form";

import TextInput from './Form/TextInput'
import { listStates } from '../services/stateService'
import SecondaryLoading from './SecondaryLoading';
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from "@material-ui/core/Paper";
import PhoneIcon from '@material-ui/icons/Phone';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import FlagIcon from '@material-ui/icons/Flag';
import PublicIcon from '@material-ui/icons/Public';
import MailIcon from '@material-ui/icons/Mail';

const useStyles = theme => ({
    root: {
        padding: '16px'
    },
    form: {
        width: '80%',
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

class BranchEdit extends Component {

    state = {
        states: [],
        loading: true
    }

    branchForm = FormBuilder.group({
        branchName: ['', Validators.compose([
            Validators.required
        ])],
        contactNo: ['', Validators.compose([
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(10),
            Validators.pattern('^[0-9]+$')
        ])],
        address1: ['', Validators.required],
        address2: ['', Validators.required],
        address3: [''],
        subrub: ['', Validators.required],
        stateId: [1, Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]+$')
        ])],
        countryId: [1], // 1 stands for Australia, as default
        postalCode: ['', Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]+$')
        ])]
    });

    componentDidMount() {
        const { branch } = this.props;
        listStates(1).then(result => {
            const states = result.map(o => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>);
            this.setState({
                states
            }, () => {
                if (branch) {
                    this.fillForm(branch);
                    this.setState({ loading: false })
                } else {
                    this.props.getBranchList();
                }
                this.setState({ loading: false })
            })
        })
    }

    componentDidUpdate(prevProps) {
        const { branch } = this.props;
        const prevBranch = prevProps.branch;

        if (branch && (!prevBranch || prevBranch.branchId !== branch.branchId)) {
            this.fillForm(branch);
        }
    }

    fillForm(branch) {
        this.branchForm.patchValue({
            branchName: branch.branchName,
            contactNo: branch.contactNo,
            address1: branch.address1,
            address2: branch.address2,
            address3: branch.address3,
            subrub: branch.subrub,
            stateId: branch.stateId,
            countryId: branch.countryId,
            postalCode: branch.postalCode
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

    submit = () => {
        const newBranch = Object.assign({}, this.props.branch, this.branchForm.value);
        this.props.updateBranch(newBranch);
    }

    render() {
        const { user, classes } = this.props;

        if (!user) {
            return <Redirect to='/login' />
        }
        if (this.state.loading) {
            return <SecondaryLoading></SecondaryLoading>
        }
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="h5" component="h5">
                            Edit Branch
                        </Typography>
                    </Grid>
                    <Grid item xs={6}
                        container
                        direction="row"
                        justify="flex-end">
                        <Button variant="contained" color="primary" size="large" startIcon={<ArrowBackIcon />}
                            component={Link} className={classes.btn}
                            to="/branch-management">
                            &nbsp;Back to Branch List
                    </Button>
                    </Grid>
                </Grid>

                <hr className="spacer30px" />

                <Paper className={classes.paper} elevation={8}>
                    <FieldGroup control={this.branchForm}
                        render={({ get, invalid }) => (
                            <div>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography style={{ color: 'red' }}>
                                            * Required fields
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FieldControl
                                            name="branchName"
                                            render={TextInput}
                                            meta={
                                                {
                                                    label: "Branch name",
                                                    icon: <BusinessCenterIcon />,
                                                    required: true,
                                                    placeholder: 'Enter branch name'
                                                }
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FieldControl
                                            name="contactNo"
                                            render={TextInput}
                                            meta={
                                                {
                                                    label: "Contact Number",
                                                    icon: <PhoneIcon />,
                                                    required: true,
                                                    placeholder: 'Use only numbers.  Min 10 and Max 12.'
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
                                                    icon: <LocationOnIcon />,
                                                    required: true,
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
                                                    icon: <LocationOnIcon />,
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
                                            name="postalCode"
                                            render={TextInput}
                                            meta={
                                                {
                                                    label: "Postal Code",
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
                                        startIcon={<SaveIcon />}
                                        disabled={invalid}
                                        onClick={this.submit}>
                                        &nbsp;Save
                                    </Button>
                                </Grid>
                            </div>
                        )}
                    />
                </Paper>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const branch = state.branch.branches.find(b => b.branchId === parseInt(ownProps.match.params.branch_id))
    return {
        user: state.auth.user,
        // branch: state.branch.currentBranch,
        branch
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateBranch: (branch) => dispatch(update(branch)),
        getBranchList: () => dispatch(list())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(useStyles)(BranchEdit));