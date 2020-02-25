const express = require("express");
const app = express();
const users = require("./routes/users");
const movies = require("./routes/movies");
const verifyToken = require("./middleware/verifyToken");

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use("/users",users);
app.use("/movies",movies);


app.get("/home",verifyToken, (req,res) =>{
    res.render("accueil");
});

const port = 8080;
app.listen(port, () => console.log(`Listening on port : ${port}`));