import React from 'react'
import { useSelector } from "react-redux";
import { Redirect } from 'react-router-dom'
import { Chart } from "react-google-charts";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
		height: '100%',
	},
	table: {
		minWidth: 400,
	},
	chartContainer: {
		maxWidth: 450,
	},
}));

function createData(firstName, lastName, email) {
	return { firstName, lastName, email };
}

const rows = [
	createData('John', 'Doe', 'john@example.com'),
	createData('Mary', 'Moe', 'mary@example.com'),
	createData('Mario', 'Moe', 'mario@example.com')
];

export default function Dashboard() {
	const classes = useStyles();
	const user = useSelector(state => state.auth.user);
	const noUserContent = <Redirect to='/login' />;
	return (
		!user ?
			noUserContent :
			<div className={classes.root}>
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<Paper className={classes.paper}>
							<Typography variant="h5" gutterBottom>
								Title
							</Typography>
							<div className={classes.chartContainer}>
								<Chart
									chartType="BarChart"
									data={[
										['City', '2010 Population', '2000 Population'],
										['New York City, NY', 8175000, 8008000],
										['Los Angeles, CA', 3792000, 3694000],
										['Chicago, IL', 2695000, 2896000],
										['Houston, TX', 2099000, 1953000],
										['Philadelphia, PA', 1526000, 1517000]
									]}
									width="100%"
									height="400px"
									max-width="100%"
									legendToggle
								/>
							</div>
						</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper className={classes.paper}>
							<Typography variant="h5" gutterBottom>
								Account Watchlist
							</Typography>
							<TableContainer component={Paper}>
								<Table className={classes.table} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>First Name</TableCell>
											<TableCell align="right">Last Name</TableCell>
											<TableCell align="right">Email</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((row) => (
											<TableRow key={row.email}>
												<TableCell component="th" scope="row">
													{row.firstName}
												</TableCell>
												<TableCell align="right">{row.lastName}</TableCell>
												<TableCell align="right">{row.email}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper className={classes.paper}>
							<Typography variant="h5" gutterBottom>
								Title
							</Typography>
							<Chart
								chartType="PieChart"
								data={[
									['Task', 'Hours per Day'],
									['Work', 11],
									['Eat', 2],
									['Commute', 2],
									['Watch TV', 2],
									['Sleep', 7]
								]}
								width="100%"
								height="400px"
								legendToggle
							/>
						</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper className={classes.paper}>
							<Typography variant="h5" gutterBottom>
								Account Watchlist
							</Typography>
							<TableContainer component={Paper}>
								<Table className={classes.table} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>First Name</TableCell>
											<TableCell align="right">Last Name</TableCell>
											<TableCell align="right">Email</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((row) => (
											<TableRow key={row.email}>
												<TableCell component="th" scope="row">
													{row.firstName}
												</TableCell>
												<TableCell align="right">{row.lastName}</TableCell>
												<TableCell align="right">{row.email}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Grid>
				</Grid>
			</div>
	)
}
