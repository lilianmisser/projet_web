var passwordHash = require('password-hash');
const bdd = require("./bdd");
const regex_mail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const user_model = {
    hash_pass: (password) => {
        return passwordHash.generate(password);
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

    create_user: (username, firstname, lastname, email, password) => {
        bdd.query("INSERT INTO user SET ?", { username: username, firstname: firstname, lastname: lastname, mail: email, password: user_model.hash_pass(password) }, function (error, results, fields) {
            if (error) throw error;
            console.log("new user");
        });
    },

    find_user: async (username, password) => {
        return new Promise((resolve, reject) => {
            bdd.query("SELECT id_user,password,isAdmin FROM user WHERE user.username = ?", [username], function (error, results, fields) {
                if (error) {
                    reject(error);
                } else if (results == undefined) {
                    console.log("no user correspondance");
                    reject({error : "no user correspondance"});
                } else if (passwordHash.verify(password, results[0]["password"])) {
                    console.log("user found !!");
                    resolve({user : [username, results[0]["id_user"],results[0]["isAdmin"]]});
                } else {
                    console.log("user not found :(");
                    reject({error : "wrong password"});
                }
            })
        });
    }
};

module.exports = user_model;