import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import Checkbox from "@material-ui/core/Checkbox";
import {branchUserAssign} from "../store/actions/branchActions";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import BusinessIcon from "@material-ui/icons/Business";
import TablePagination from "@material-ui/core/TablePagination";
import {listUsers} from "../store/actions/employeeActions";

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
    {id: 'code', label: 'User name', minWidth: 100},
    {id: 'name', label: 'Name', minWidth: 170},
    {id: 'address_1', label: 'Address', minWidth: 100},
    {id: 'contact_number', label: 'Contact Number', minWidth: 100},
];

function createData(userId, code, name, address_1, contact_number) {
    return {userId, code, name, address_1, contact_number};
}

export default function BranchUserCreate() {
    const classes = useStyles();
    const user = useSelector(state => state.auth.user);
    const branchUserEdit = useSelector(state => state.branch.branchEdit);
    const usersEmployees = useSelector(state => state.employee.employeelist);
    const usersBranch = useSelector(state => state.branch.users);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedState, setSelectedState] = React.useState([]);
    const dispatch = useDispatch();
    let history = useHistory();
    const [rows, setRows] = useState([]);
    const [fullRows, setFullRows] = useState([]);

    if (!user) {
        useHistory.push("/login")
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (!branchUserEdit) {
        history.push("/branch-management")
    }

    const backCreateUser = () => {
        history.push("/branch-users/" + branchUserEdit.branchId);
    }

    const addUserBranch = () => {
        if (selectedState.length > 0) {
            const users = selectedState.map((valueSelect) => {
                return {
                    branch_id: branchUserEdit.branchId,
                    user_id: valueSelect.userId
                };
            });
            dispatch(branchUserAssign(users));
            history.push("/branch-users/" + branchUserEdit.branchId);
        }
    }

    const selectRow = (row, select) => {
        const s = [...selectedState];
        if (select) {
            s.push(row);
            setSelectedState(s);
        } else {
            const index = s.indexOf(row);
            if (index > -1)
                s.splice(index, 1);
                setSelectedState(s);
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
        dispatch(listUsers(user.userId));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (usersEmployees) {
            let employeesFilter = [];

            usersEmployees.forEach(userb => {
                let agregar = true;

                usersBranch.forEach(userbranch => {
                    if (userbranch.userId === userb.userId) {
                        agregar = false;
                    }
                });

                if (agregar === true)
                    employeesFilter.push(userb);
            });

            console.log('employees', employeesFilter);
            const mappedRows = employeesFilter.map(userb => createData(userb.userId, userb.userName, userb.firstName, userb.address1, userb.contactNo1));
            setRows(mappedRows);
            setFullRows(mappedRows);
        }
        // eslint-disable-next-line
    }, [usersEmployees]);

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid container item xs={4} justify="center">
                    <Button variant="contained" color="primary" size="large"
                            startIcon={<i className="fas fa-long-arrow-alt-left"></i>}
                            className={classes.btn} onClick={(e) => backCreateUser()}>
                        &nbsp;Back to Branch Users
                    </Button>
                </Grid>
                <Grid container item xs={4} justify="center">
                    <Typography variant="h5">
                        Add Users to Branch
                    </Typography>
                </Grid>
                <Grid item xs={4}
                      container
                      direction="row"
                      justify="flex-end">
                    <Button variant="contained" color="secondary" size="medium"
                        disabled={selectedState.length === 0}
                        startIcon={<Icon>add</Icon>}
                        className={classes.btn} onClick={(e) => addUserBranch()}>
                        &nbsp;Add selected users
                    </Button>
                </Grid>
            </Grid>

            <hr className="spacer10px"/>

            {fullRows.length !== 0 ? 
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
            : <div></div>
            }
            

            {fullRows.length === 0 ?
                <div className={classes.empty_array}>
                    <BusinessIcon className={classes.empty_icon}/>
                    <Typography variant="h5">
                        This branch has all the existing users.
                    </Typography>
                </div> : <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{minWidth: column.minWidth}}
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
                                                <Checkbox onChange={(e, select) => selectRow(row, select)}/>
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
        </div>
    )
}
