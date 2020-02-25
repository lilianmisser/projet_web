const bdd = require("./bdd");

const comment_model = {
    insert_comment: (comment, post_date, id_user, id_movie) => {
        bdd.query("INSERT INTO comment SET ?", { content: comment, post_date: post_date, id_user: id_user, id_movie: parseInt(id_movie) },
            (err, results, fields) => {
                if (err) throw error;
                console.log("comment added");
            })
    },

    all_comment: async (id_movie) => {
        return new Promise((reject, resolve) => {
            bdd.query("SELECT * FROM comment WHERE comment.id_movie = ?", parseInt(id_movie),
            (err, results, fields) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(results);
                }
            })
        })
    }
}

module.exports = comment_model;