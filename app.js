const express = require("express");
const app = express();
const users = require("./routes/users");
const movies = require("./routes/movies");
const profile = require("./routes/profile");
const home = require("./routes/home")
const verifyToken = require("./middleware/verifyToken");
const path = require("path");
var cookieParser = require("cookie-parser");
require('dotenv').config()

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));

app.use("/users",users);
app.use("/movies",movies);
app.use("/profile",profile);
app.use("",home);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port : ${port}`));