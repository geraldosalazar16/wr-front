import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import { Link, useHistory } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import { del, statuschange, listByBranch, startCustomerEdit, upload } from "../store/actions/customerActions";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
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
    btn: {
        margin: theme.spacing(1)
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
    { id: 'index', label: '#', minWidth: 50 },
    { id: 'code', label: 'Promo Code', minWidth: 100 },
    { id: 'name', label: 'Customer Name', minWidth: 170 },
    { id: 'email', label: 'Email Address', minWidth: 170 },
    { id: 'contactNo', label: 'Contact Number', minWidth: 170 },
];

function createData(index, id, code, name, email, contactNo) {
    return { index, id, code, name, email, contactNo };
}

export function CustomerManagement(props) {
    const branchId = parseInt(props.match.params.branch_id);
    const classes = useStyles();
    const user = useSelector(state => state.auth.user);
    const customers = useSelector(state => state.customer.customers);
    const dispatch = useDispatch();
    const inputFile = React.createRef();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    let history = useHistory();
    const [rows, setRows] = useState([]);
    const [fullRows, setFullRows] = useState([]);
    
    if (!user) {
        useHistory.push("/login");
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

    const uploadFileCSV = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsText(file);

        reader.onloadend = () => {
            const csv = require('csvtojson')

            csv({
                //noheader: true,
                output: "csv"
            })
                .fromString(reader.result)
                .then((csvRow) => {
                    dispatch(upload(csvRow, branchId));
                })
        }
    }

    const handleClicUpload = (e) => {
        e.preventDefault();
        inputFile.current.click();
    }

    const editCustomer = (row) => {
        dispatch(startCustomerEdit(row.id))
        history.push(`/customer-edit/${row.id}/${branchId}`);
    }

    const detailsCustomer = (row) => {
        dispatch(startCustomerEdit(row.id))
        history.push(`/customer-details/${row.id}/${branchId}`);
    }

    const deleteCustomer = async (row) => {
        await dispatch(del(row));
    }

    const customerStatusChange = async (row) => {
        await dispatch(statuschange(row));
        
    }

    useEffect(() => {
        dispatch(listByBranch(branchId))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const mapped = customers.map(customer => createData(customer.index + 1, customer.id, customer.customerId, customer.name, customer.email, customer.contactNo));
        setRows(mapped);
        setFullRows(mapped);
    }, [customers]);

    return (
        <div className={classes.root}>
            <input type="file" ref={inputFile} accept=".csv" onChange={(e) => uploadFileCSV(e)} style={{ display: 'none' }} />
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Typography variant="h5">
                        Customers List
                    </Typography>
                </Grid>
                <Grid item xs={6}
                    container
                    direction="row"
                    justify="flex-end">
                    {user.roleId === 3 ? (
                        <div>
                            <Button variant="contained" color="primary" size="small" startIcon={<Icon>add</Icon>}
                                component={Link} className={classes.btn}
                                to={`/customer-create/${branchId}`} >
                                &nbsp;Add New Customer
                                </Button>
                            <Button variant="contained" color="primary" size="small" startIcon={<CloudUploadIcon />}
                                className={classes.btn} onClick={(e) => handleClicUpload(e)}
                            >
                                &nbsp;Upload CSV file
                                </Button>
                        </div>
                    ) : <div></div>}
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

            {fullRows.length === 0 ?
                <div className={classes.empty_array}>
                    <ReceiptIcon className={classes.empty_icon} />
                    <Typography variant="h5">
                        There is no customers created yet.
                    </Typography>
                    {user.roleId === 13 ? (
                        <Button variant="contained" color="primary" size="small" startIcon={<Icon>add</Icon>}
                            component={Link} className={classes.btn}
                            to={`/customer-create/${branchId}`}
                        >
                            &nbsp;Add New Customer
                        </Button>
                    ) : <div></div>}
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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {8} 
                                                         {/* {value}  */}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                {user.roleId === 3 && (
                                                    <div>
                                                    <Icon id="btnedit" className={classes.icon} color="primary"  onClick={(e) => editCustomer(row)}>edit</Icon>
                                                    <Icon id="btndelete" className={classes.icon} color="error" onClick={(event) => deleteCustomer(row)}>delete</Icon>
                                                    <Icon id="btntoggle" className={classes.icon} color="disabled" 
                                                            onClick={(event) => customerStatusChange(row) }>delete</Icon>
                                                             
                                                    </div>
                                                )}
                                                {user.roleId !== 3 && (
                                                    <Icon title="Details" className={classes.icon} color="primary" onClick={(e) => detailsCustomer(row)}>pageview</Icon>
                                                )}
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
            }
        </div>
    )
}