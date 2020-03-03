const mysql = require("mysql");
require('dotenv').config()

const bdd = mysql.createConnection({
    host : "mysql-lilianmisser.alwaysdata.net",
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : "lilianmisser_streamhelper"    
});

module.exports = bdd;