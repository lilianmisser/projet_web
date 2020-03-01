const express = require("express");
const app = express();
const users = require("./routes/users");
const movies = require("./routes/movies");
const profile = require("./routes/profile");
const verifyToken = require("./middleware/verifyToken");
const path = require("path");

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));

app.use("/users",users);
app.use("/movies",movies);
app.use("/profile",profile)


app.get("/", (req,res) =>{
    res.redirect("/home");
});

app.get("/home",verifyToken, (req,res) =>{
    res.render("accueil",{isAdmin :  req.user.isAdmin});
});

const port = 8080;
app.listen(port, () => console.log(`Listening on port : ${port}`));