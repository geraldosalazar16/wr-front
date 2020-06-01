import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import { useDispatch, useSelector } from "react-redux";
import { deleteBranch, list, listFromUser } from "../store/actions/branchActions";
import Typography from "@material-ui/core/Typography";
import BusinessIcon from '@material-ui/icons/Business';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    }
})
);

const columns = [
    { id: 'branchCode', label: 'Branch ID', minWidth: 100 },
    { id: 'branchName', label: 'Branch Name', minWidth: 170 },
    { id: 'address1', label: 'Branch Address', minWidth: 200 },
    { id: 'contactNo', label: 'Contact Number', minWidth: 120 },
];

function createData(branchId, branchCode, branchName, address1, contactNo) {
    return { branchId, branchCode, branchName, address1, contactNo };
}

export default function BranchManagement() {
    const classes = useStyles();
    const user = useSelector(state => state.auth.user);
    const branchs = useSelector(state => state.branch.branches);
    const branchUserEdit = useSelector(state => state.branch);
    const [showDialog, setShowdialog] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const dispatch = useDispatch();
    let history = useHistory();
    const [rows, setRows] = useState([]);
    const [branchToDelete, setBranchToDelete] = useState(null);

    if (!user) {
        history.push("/login");
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const loadBranchUser = (row) => {
        branchUserEdit.branchEdit = row;
        history.push('/branch-users/' + row.branchId);
    }

    const editBranch = (row) => {
        history.push('/branch-edit/' + row.branchId);
    }

    const openConfirm = (branch) => {
        setBranchToDelete(branch)
        setShowdialog(true);
    }

    const handleCloseConfirm = (action) => {
        setShowdialog(false);
        if (action === 'ok') {
            dispatch(deleteBranch(branchToDelete));
        }
    }

    const loadBranchCustomers = (row) => {
        history.push('/branch-customers/' + row.branchId);
    }

    useEffect(() => {
        if (user.roleId === 3) {
            dispatch(listFromUser());
        } else {
            dispatch(list(false));
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const mappedRows = branchs.map(branch => createData(branch.branchId, branch.branchCode, branch.branchName, branch.address1, branch.contactNo));
        setRows(mappedRows);
    }, [branchs]);

    const createButton = user.roleId !== 3 ? (
        <Button variant="contained" color="primary" size="large" startIcon={<Icon>add</Icon>}
            component={Link} className={classes.btn}
            to="/branch-create">
            &nbsp;Add New Branch
        </Button>
    ) : <div></div>

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    {user.roleId !== 3 ? (
                    <Typography variant="h5">
                        Branch Management
                    </Typography> ) :
                    <Typography variant="h5">
                        Branch List
                    </Typography>
                    }
                </Grid>
                <Grid item xs={6}
                    container
                    direction="row"
                    justify="flex-end">
                    {createButton}
                </Grid>
            </Grid>

            <hr className="spacer10px" />

            {rows.length === 0 ?
                <div className={classes.empty_array}>
                    <BusinessIcon className={classes.empty_icon} />
                    <Typography variant="h5">
                        There is no branch defined yet.
                    </Typography>
                    
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
                                                {user.roleId !== 3 ? (
                                                    <div>
                                                        <Icon className={classes.icon} title="Branch Customers" color="primary" onClick={(e) => loadBranchCustomers(row)}>wc</Icon>
                                                        <Icon className={classes.icon} title="Branch Users" color="primary" onClick={(e) => loadBranchUser(row)}>group</Icon>
                                                        <Icon className={classes.icon} title="Edit" color="primary" onClick={(e) => editBranch(row)}>edit</Icon>
                                                        <Icon className={classes.icon} title="Delete" color="error" onClick={(event) => openConfirm(row)}>delete</Icon>
                                                    </div>
                                                ) : <div>
                                                        <Icon className={classes.icon} title="Branch Customers" color="primary" onClick={(e) => loadBranchCustomers(row)}>wc</Icon>
                                                    </div>
                                                }
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
                        You are about to delete this branch. Press OK for confirmation
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