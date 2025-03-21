import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link } from "react-router-dom";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const Navbar = () => {
	const [mode, setMode] = React.useState("light");
	const { user, role, logout } = useContext(AuthContext); // Get user and role from AuthContext

	const theme = createTheme({
		palette: {
			mode,
		},
	});

	const toggleColorMode = () => {
		setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
							HappyFox
						</Link>
					</Typography>
					<Box>
						{user === null && (
							<Button color="inherit" component={Link} to={"http://localhost:2222/auth/google"}>
								Login with Google
							</Button>
						)}
						<Button color="inherit" component={Link} to="/ai-chat">
							AI Chat
						</Button>
						{/* Show "Create Event" button only for admin */}
						{role === "admin" && (
							<Button color="inherit" component={Link} to="/admin/event/create">
								Create Event
							</Button>
						)}

						{role === "admin" && (
							<Button color="inherit" component={Link} to="/admin">
								Admin
							</Button>
						)}

						{/* Show "Evaluator Dashboard" button only for evaluator */}
						{role === "teacher" && (
							<Button color="inherit" component={Link} to="/">
								Teacher Dashboard
							</Button>
						)}

						{/* Show "Student Dashboard" button only for student */}
						{role === "student" && (
							<Button color="inherit" component={Link} to="/">
								Student Dashboard
							</Button>
						)}

						{role === "student" && (
							<Button color="inherit" component={Link} to="/flash-cards">
								Flash Cards
							</Button>
						)}

						{/* Login/Logout button */}
						{user !== null && (
							<Button color="inherit" onClick={logout}>
								Logout
							</Button>
						)}

						{/* Theme toggle button */}
						<IconButton color="inherit" onClick={toggleColorMode}>
							{mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
};

export default Navbar;
