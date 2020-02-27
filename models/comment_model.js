const bdd = require("./bdd");

const Errors = {
    DB_UNAVALAIBLE : new Error("Internal Server Error")
}

const comment_model = {
    insert_comment: (comment, post_date, id_user, id_movie) => {
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
    }
}

module.exports = comment_model;