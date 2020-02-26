const bdd = require("./bdd");

const comment_model = {
    insert_comment: (comment, post_date, id_user, id_movie) => {
        bdd.query("INSERT INTO comment SET ?", { content: comment, post_date: post_date, id_user: id_user, id_movie: id_movie },
            (err, results, fields) => {
                if (err){
                    console.log(err);
                }
                else{
                    console.log("comment added");
                }
            })
    },

    all_comment: async (id_movie) => {
        return new Promise((resolve, reject) => {
            bdd.query("SELECT * FROM comment WHERE comment.id_movie = ?", id_movie,
            (err, results, fields) => {
                if(err){
                    reject(error);
                }
                else if (results){
                    console.log("comments");
                    resolve(results);
                }
                else{
                    reject("no comments");
                }
            })
        })
    }
}

module.exports = comment_model;