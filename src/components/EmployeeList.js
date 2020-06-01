import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { deleteBranchUser, listUsers } from "../store/actions/employeeActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
    },
    container: {
        maxHeight: 440,
    },
    empty_array: {
        width: '100%',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    empty_icon: {
        'font-size': '60px'
    },
    modal_content: {
        position: 'relative',
        backgroundColor: '#fff',
        '-webkit-background-clip': 'padding-box',
        'background-clip': 'padding-box',
        'border': '1px solid rgba(0, 0, 0, .2)',
        'border-radius': '0px',
        outline: '0',
        '-webkit-box-shadow': '0 3px 5px rgba(0, 0, 0, .5)',
        'box-shadow': '0 3px 5x rgba(0, 0, 0, .5)'
    },
    modal_body: {
        position: 'relative',
        padding: '15px'
    },
    icon: {
        cursor: 'pointer'
    },
    searchComponent: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        marginBottom: theme.spacing(1)
    },
    searchInput: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    sreachIcon: {
        padding: 10,
    }
})
);

const columns = [
    { id: 'user_name', label: 'User name ', minWidth: 100 },
    { id: 'first_name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 100 },
    { id: 'contact_number_1', label: 'Contact Number', minWidth: 100 },
];

function createData(userId, user_name, first_name, last_name, email, contact_number_1) {
    return { userId, user_name, first_name, last_name, email, contact_number_1 };
}

export default function EmployeeList() {
    const classes = useStyles();
    const user = useSelector(state => state.auth.user);
    const [showDialog, setShowdialog] = useState(false);
    const usersEmployess = useSelector(state => state.employee.employeelist);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const dispatch = useDispatch();
    let history = useHistory();
    const [rows, setRows] = useState([]);
    const [fullRows, setFullRows] = useState([]);
    const [employeesToDelete, setEmployeesToDelete] = useState(null);

    if (!user) {
        history.push("/login")
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const loadEmployess = () => {
        dispatch(listUsers(user.userId));
    }

    const editEmployees = (row) => {
        history.push('/employee-edit/' + row.userId);
    }

    const deleteEmployees = (row) => {
        //setBranchToDelete(branch)
        setEmployeesToDelete(row);
        setShowdialog(true);
    }

    const handleCloseConfirm = (action) => {
        setShowdialog(false);
        if (action === 'ok') {
            dispatch(deleteBranchUser(employeesToDelete));
        }
    }

    const handleSearchChange = (value) => {
        const searchValue = value.target.value.toString().toLowerCase();
        const filteredRows = fullRows.filter(row => {
            let rowToSring = '';
            const keys = Object.keys(row);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = row[key].toString();
                rowToSring = rowToSring.concat(value.toLowerCase())
            }
            return rowToSring.includes(searchValue);
        });
        setRows(filteredRows);
    }

    useEffect(() => {
        loadEmployess();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (usersEmployess) {
            const mappedRows = usersEmployess.map(userE => createData(userE.userId, userE.userName, userE.firstName, userE.lastName, userE.userEmail, userE.contactNo1));
            setRows(mappedRows);
            setFullRows(mappedRows);
        }
    }, [usersEmployess]);

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Typography variant="h5" component="h5">
                        Employee List
                    </Typography>
                </Grid>
                <Grid item xs={6}
                    container
                    direction="row"
                    justify="flex-end">
                    <Button variant="contained" color="primary" size="large" startIcon={<Icon>add</Icon>}
                        component={Link} className={classes.btn}
                        to={"/employee-create"}>
                        &nbsp;Add New Employee
                    </Button>
                </Grid>
            </Grid>

            <hr className="spacer10px" />

            <Paper className={classes.searchComponent}>
                <IconButton className={classes.searchIcon} aria-label="menu">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    onChange={handleSearchChange}
                    className={classes.searchInput}
                    placeholder="Search"
                />
            </Paper>

            {fullRows.length === 0 ? <div>
                <div className={classes.empty_array}><i className="fas fa-users empty-icon"></i>
                    <Typography variant="h5">
                        There is no employee defined yet.
                    </Typography>
                </div>
            </div> : <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.branchCode}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                <Icon className={classes.icon} color="primary" onClick={(e) => editEmployees(row)}>edit</Icon>
                                                <Icon className={classes.icon} color="error"
                                                    onClick={(event) => deleteEmployees(row)}>delete</Icon>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>}
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="xs"
                aria-labelledby="confirmation-dialog-title"
                open={showDialog}
            >
                <DialogTitle id="confirmation-dialog-title">Warning</DialogTitle>
                <DialogContent >
                    <DialogContentText>
                        You are about to delete this employee. Press OK for confirmation
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => handleCloseConfirm('cancel')} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleCloseConfirm('ok')} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
