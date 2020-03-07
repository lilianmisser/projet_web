const bdd = require("./bdd");
const Errors = require("./errors");

const profile_model = {
    get_username : async (id_user) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT username FROM user WHERE user.id_user = ?", [id_user],
            (error,results) =>{
                if(error) {
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if (results[0] !== undefined) {
                    resolve(results);
                }
                else{
                    reject(Errors.NO_USER_CORRESPONDANCE);
                }
            })
        })
    },

    get_all_data_profile : async (id_user) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT id_user,username,firstname,lastname,mail FROM user WHERE user.id_user = ?", [id_user],
            (error,results) =>{
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if (results[0] !== undefined) {
                    resolve(results);
                }
                else{
                    reject(Errors.NO_USER_CORRESPONDANCE);
                }
            })
        })
    },

    delete_profile : async (id_user) => {
        return new Promise((resolve,reject) => {
            bdd.query("DELETE FROM user WHERE user.id_user = ?",[id_user],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else{
                    resolve();
                }                
            })
        })
    },

    update_profile : async (id_user,firstname,lastname,mail) => {
        return new Promise((resolve,reject) => {
            bdd.query("UPDATE user SET ? WHERE user.id_user = ?",[{firstname:firstname,lastname:lastname,mail:mail},id_user],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else{
                    resolve();
                }
            })
        })
    },

    get_all_users : async () => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT id_user,username,firstname,lastname,mail FROM user ORDER BY username",
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else{
                    resolve(results);
                }
            })
        })
    }
};

module.exports = profile_model;