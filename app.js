const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const configFile = require("./config.js");
const userModel = require("./models/user.model.js");
const app = express();
const path = require("path");
const ejs = require("ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// app.get('/', (req, res) => {

// })

app.get("/login", (req, res) => {
	res.render("login");
});

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/signup", (req, res) => {
	res.render("signup");
});

app.post("/signup", async (req, res) => {
	let { username, email, password, phone } = req.body;

	let xUser = await userModel.findOne({ username });

	if (xUser) {
		res.send('User Aleardy Exits  <a href="/signup">Try again</a>');
	} else {
		let genSalt = 10;
		let hashPassword = await bcrypt.hash(password, genSalt);
		password = hashPassword;

		let user = await userModel.create({
			username,
			email,
			password,
			phone,
		});
		await user.save();
		return res.redirect("login");
	}
});

app.post("/login", async (req, res) => {
	let { email, password } = req.body;

	let checkUser = await userModel.findOne({ email });

	if (!checkUser) {
		res.send("User Not find");
	} else {
		let checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
		if (checkPasswordMatch) {
			res.render("profile", { checkUser });
		} else {
			res.send('Wrong password.  <a href="/login">Try again</a>');
		}
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
