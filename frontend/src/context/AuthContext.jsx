// context/AuthContext.js
import { createContext, useState } from "react";

// Step 1: Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	// Simulate logged-in user

	// const [user, setUser] = useState({ email: "admin@cmrit.ac.in" });
	// const [role, setRole] = useState("admin"); // Simulate admin role (uncomment to check)

	// const [user, setUser] = useState({ email: "jane.smith@example.com" });
	// const [role, setRole] = useState("teacher"); // Simulate teacher role
	// const [user, setUser] = useState({ email: "julie.mars@example.com" });
	// const [role, setRole] = useState("teacher"); // Simulate teacher role

	const [user, setUser] = useState({ email: "alice.johnson@example.com" });
	const [role, setRole] = useState("student"); // Simulate student role
	// const [user, setUser] = useState({ email: "david.lee@example.com" });
	// const [role, setRole] = useState("student"); // Simulate student role
	// const [user, setUser] = useState({ email: "isro22cs@cmrit.ac.in" });
	// const [role, setRole] = useState("student"); // Simulate student role

	const login = (userData) => {
		setUser(userData);
		setRole(userData.role);
	};

	const logout = () => {
		setUser(null);
		setRole(null);
	};

	return <AuthContext.Provider value={{ user, role, login, logout }}>{children}</AuthContext.Provider>;
};

// import { createContext, useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
// 	const [user, setUser] = useState(null);
// 	const [role, setRole] = useState(null);
// 	const [registered, setRegistered] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		const load = async () => {
// 			const token = sessionStorage.getItem("token");
// 			if (token) {
// 				const decodedToken = JSON.parse(atob(token.split(".")[1]));
// 				setUser({ email: decodedToken.email, name: decodedToken.name });
// 				setRole(decodedToken.role);
// 				setRegistered(decodedToken.registered);
// 			}
// 			setLoading(false);
// 		};
// 		load();
// 	}, []);

// 	const login = (token) => {
// 		sessionStorage.setItem("token", token);
// 		const decodedToken = JSON.parse(atob(token.split(".")[1]));

// 		setUser({ email: decodedToken.email, name: decodedToken.name });
// 		setRole(decodedToken.role);
// 		setRegistered(decodedToken.registered);

// 		setTimeout(() => {
// 			if (!decodedToken.registered) {
// 				navigate("/register");
// 			} else if (decodedToken.role === "admin") {
// 				navigate("/admin/dashboard");
// 			} else if (decodedToken.role === "evaluator") {
// 				navigate("/evaluator/dashboard");
// 			} else {
// 				navigate("/student");
// 			}
// 		}, 100);
// 	};

// 	const logout = () => {
// 		sessionStorage.removeItem("token");
// 		setUser(null);
// 		setRole(null);
// 		setRegistered(null);
// 		navigate("/");
// 	};

// 	if (loading) return <div>Loading...</div>;

// 	return <AuthContext.Provider value={{ user, role, registered, login, logout }}>{children}</AuthContext.Provider>;
// };
