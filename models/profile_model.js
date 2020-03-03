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
            bdd.query("SELECT username,firstname,lastname,mail FROM user WHERE user.id_user = ?", [id_user],
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

    delete_profile : async (username) => {
        return new Promise((resolve,reject) => {
            bdd.query("DELETE FROM users WHERE user.username = ?",[username],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else{
                    resolve();
                }                
            })
        })
    }
};

module.exports = profile_model;