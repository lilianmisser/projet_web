const bdd = require("./bdd");
const Errors = require("./errors");

const genre_model = {
    get_all_genres : async () => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT * FROM genre",
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else{
                    resolve(results);
                }
            })
        })
    },

    get_movies_by_genre : async (genre) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT * FROM movies NATURAL JOIN genre WHERE movies.genre_name = ?",[genre],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] === undefined){
                    reject(Errors.NO_MOVIE_GENRE);
                }
                else{
                    resolve(results);
                }
            })
        })
    },

    insert_genre : async (genre,wording) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT genre_name FROM genre WHERE genre.genre_name = ?",[genre],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] !== undefined){
                    reject(Errors.GENRE_NAME_ALREADY_EXISTS);
                }
                else{
                    bdd.query("INSERT INTO genre SET ?",{genre_name : genre, wording : wording},
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

    delete_genre : async (genre) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT genre_name FROM genre WHERE genre.genre_name = ?",[genre],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] !== undefined){
                    reject(Errors.GENRE_NAME_ALREADY_EXISTS);
                }
                else{
                    bdd.query("DELETE FROM genre WHERE genre.genre_name = ?",genre,
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

    get_id_genre : async (genre) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT id_genre FROM genre WHERE genre.genre_name = ?",genre,
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] === undefined){
                    reject(Errors.WRONG_GENRE_NAME);
                }
                else{
                    resolve(results[0].id_genre);
                }
            })
        })
    }
}

module.exports = genre_model;