const bdd = require("./bdd");
const Errors = require("./errors");

const comment_model = {
    insert_comment: async (comment, post_date, id_user, id_movie) => {
        return new Promise ((resolve,reject) => {
            bdd.query("INSERT INTO comment SET ?", { content: comment, post_date: post_date, id_user: id_user, id_movie: id_movie },
            (error, results) => {
                if (error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else{
                    resolve();
                }
            })
        })  
    },

    all_comment: async (id_movie) => {
        return new Promise((resolve, reject) => {
            bdd.query("SELECT * FROM comment WHERE comment.id_movie = ?", id_movie,
            (error, results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if (results[0] == undefined) {
                    reject();
                }
                else{
                    resolve(results);
                }
            })
        })
    },
    
    delete_comment: (id_user,id_comment) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT id_comment,user.id_user FROM comment,user WHERE (user.id_user = ? AND user.isAdmin = 1) OR (comment.id_comment = ? AND comment.id_user = ?)",[id_user,id_comment,id_user],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] == []){
                    reject(Errors.NO_ACCESS);
                }
                else{
                    bdd.query("DELETE FROM comment WHERE comment.id_comment = ?", id_comment,
                    (error,results) => {
                        if(error){
                            reject(Errors.DB_UNAVALAIBLE);
                        }
                        else{
                            resolve();
                        }
                    })
                }
            })
        })
    },

    //user can't comment the same movie until waiting a certain amount of time
    canComment : async (id_user,id_movie) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT post_date FROM comment WHERE comment.id_user = ? AND comment.id_movie = ?",
            [id_user,id_movie],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] !== undefined){
                    resolve(false);
                }
                else{
                    resolve(true);
                }
            })
        })
    }
}

module.exports = comment_model;