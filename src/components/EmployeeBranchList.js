import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";

import { listFromUser } from "../store/actions/branchActions";


const useStyles = makeStyles((theme) => (
    {
        root: {
            padding: theme.spacing(2)
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
            fontSize: '60px'
        },
        paper: {
            padding: '16px'
        }
    })
);
const columns = [
    { id: 'branchCode', label: 'Branch ID', minWidth: 170 },
    { id: 'branchName', label: 'Branch Name', minWidth: 100 },
    { id: 'address1', label: 'Branch Address', minWidth: 170 },
    { id: 'contactNo', label: 'Contact Number', minWidth: 170, align: 'right' },
];

export default function EmployeeBranchList() {
    const classes = useStyles();
    const user = useSelector(state => state.auth.user);
    const branchs = useSelector(state => state.branch.branches);
    const [rows, setRows] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user.roleId === 3) {
            dispatch(listFromUser());
        } else {
            
        }
    }, []);

    useEffect(() => {
        const mappedRows = branchs.map(branch => createData(branch.branchId, branch.branchCode, branch.branchName, branch.address1, branch.contactNo));
        setRows(mappedRows);
    }, [branchs]);

    const loadBranchCustomers = () => {

    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
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
                                            <AccountBoxIcon onClick={(e) => loadBranchCustomers(row)} />
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
            </Paper>
        </div>
    )
}
