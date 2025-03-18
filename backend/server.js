import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import { connectDB } from "./config/db.js";

dotenv.config();
const port = process.env.PORT || 1001;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Server is ready");
});

app.listen(port, () => {
	connectDB();
	console.log(`Server is running on http://localhost:${port}`);
});
