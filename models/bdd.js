const mysql = require("mysql");
require('dotenv').config()

const bdd = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "projet_web"    
});

module.exports = bdd;