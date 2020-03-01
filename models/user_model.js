var passwordHash = require('password-hash');
const bdd = require("./bdd");
const regex_mail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const Errors = require("./errors");


const user_model = {
    hash_pass: (password) => {
        return passwordHash.generate(password);
    },

    verify_pass : (post_pass,db_pass) => {
        return passwordHash.verify(post_pass,db_pass);
    },

    check_informations: (username, firstname, lastname, email, password) => {
        let err;
        if (username.length < 3 || username.length > 20) {
            err = "username must be between 3 and 20 characters";
        }
        else if (firstname.length < 2 || firstname.length > 25) {
            err = "firstname must be between 2 and 25 characters";
        }
        else if (lastname.length < 2 || lastname.length > 25) {
            err = "lastname must be between 2 and 25 characters";
        }
        else if (password.length < 6) {
            err = "password must be at least 6 characters";
        }
        else if (!regex_mail.test(email)) {
            err = "you must enter a valid email";
        }
        return err;
    },

    create_user: async (username, firstname, lastname, email, password) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT username FROM user WHERE user.username = ?",username,
            (error,results) =>{
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] !== undefined){
                    reject(Errors.USERNAME_ALREADY_EXISTS);
                }
                else{
                    bdd.query("SELECT mail FROM user WHERE user.mail = ?",email,
                    (err,results) =>{
                        if(error){
                            reject(Errors.DB_UNAVALAIBLE);
                        }
                        else if(results[0] !== undefined){
                            reject(Errors.MAIL_ALREADY_EXISTS);
                        }
                        else{
                            bdd.query("INSERT INTO user SET ?", { username: username, firstname: firstname, lastname: lastname, mail: email, password: user_model.hash_pass(password) },
                            (error, results) => {
                                if (error){
                                    reject(Errors.MAIL_ALREADY_EXISTS);
                                }
                                else{
                                    resolve();
                                }
                            })
                        }
                    })
                }
            })
        })
    },

    find_user: async (username, password) => {
        return new Promise((resolve, reject) => {
            bdd.query("SELECT id_user,password,isAdmin FROM user WHERE user.username = ?", [username],
            (error, results) => {
                if (error) {
                    reject(Errors.DB_UNAVALAIBLE);
                } else if (results[0] == undefined) {
                    reject(Errors.NO_USER_CORRESPONDANCE);
                } else if ( user_model.verify_pass(password, results[0]["password"])) {
                    resolve({user : [username, results[0]["id_user"],results[0]["isAdmin"]]});
                } else {
                    reject(Errors.WRONG_PASS);
                }
            })
        })
    }
};

module.exports = user_model;