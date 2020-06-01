import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import { Link, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { useDispatch, useSelector } from "react-redux";
import { branchUserDelete, listUsers } from "../store/actions/branchActions";
import TablePagination from "@material-ui/core/TablePagination";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import BusinessIcon from "@material-ui/icons/Business";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
    },
    container: {
        maxHeight: 440,
        marginTop: theme.spacing(1)
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
    },
})
);

const columns = [
    { id: 'firstName', label: 'First Name', minWidth: 100, width: 120 },
    { id: 'lastName', label: 'Last Name', minWidth: 130, width: 150 },
    { id: 'userEmail', label: 'Email Address', minWidth: 100, width: 120 },
    { id: 'contactNo1', label: 'Contact Number', minWidth: 80, width: 100 },
];

function createData(userId, firstName, lastName, userEmail, contactNo1, idDelete) {
    return { userId, firstName, lastName, userEmail, contactNo1, idDelete };
}

export default function BranchUsers(props) {
    const branchId = parseInt(props.match.params.branch_id);
    const classes = useStyles();
    const user = useSelector(state => state.auth.user);
    const usersBranch = useSelector(state => state.branch.users);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [showDialog, setShowdialog] = useState(false);
    const dispatch = useDispatch();
    let history = useHistory();
    const [rows, setRows] = useState([]);
    const [fullRows, setFullRows] = useState([]);
    const [branchUsersToDelete, setBranchUsersToDelete] = useState(null);

    if (!user) {
        history.push("/login");
    }

    const openConfirm = (row) => {
        setBranchUsersToDelete(row);
        setShowdialog(true);
    }

    const handleCloseConfirm = (action) => {
        setShowdialog(false);
        if (action === 'ok') {
            dispatch(branchUserDelete(branchUsersToDelete.idDelete[0].id));
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
        dispatch(listUsers(branchId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branchId]);

    useEffect(() => {
        if (usersBranch) {
            const mapped = usersBranch.map(userBranch => createData(userBranch.userId, userBranch.firstName, userBranch.lastName, userBranch.userEmail, userBranch.contactNo1, userBranch.branchUsers));
            setRows(mapped);
            setFullRows(mapped);
        }
    }, [usersBranch]);

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={4} container justify="flex-start">
                    <Button variant="contained" color="primary" size="large"
                        startIcon={<i className="fas fa-long-arrow-alt-left"></i>}
                        component={Link} className={classes.btn}
                        to={"/branch-management"}>
                        &nbsp;Back to Branch List
                    </Button>
                </Grid>
                <Grid item xs={4} container justify="center">
                    <Typography variant="h5">
                        Branch Users
                    </Typography>
                </Grid>
               
                <Grid item xs={4}
                    container
                    direction="row"
                    justify="flex-end">
                    <Button variant="contained" color="primary" size="large" startIcon={<Icon>add</Icon>}
                        component={Link} className={classes.btn}
                        to={"/branch-user-create/" + user.userId}>
                        &nbsp;Add New User
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
            {fullRows.length === 0  ? <div>
                <div className={classes.empty_array}>
                    <BusinessIcon className={classes.empty_icon} />
                    <Typography variant="h5">
                        This branch has no users yet.
                    </Typography>
                     {/*
                    <Button variant="contained" color="primary" size="large" startIcon={<Icon>add</Icon>}
                        component={Link} className={classes.btn}
                        to={"/branch-user-create/" + user.userId}>
                        &nbsp;Add new user
                     </Button> */}
                </div>
            </div>
                : <Paper className={classes.root}>
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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.userId}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                <Icon color="error" className={classes.icon}
                                                    onClick={(event) => openConfirm(row)}>delete</Icon>
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
                <DialogContent>
                    <DialogContentText>
                        You are about to delete this users. Press OK for confirmation
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
    );
}