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

    get_movies_by_genre : async (id_genre) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT * FROM movies NATURAL JOIN movie_genre WHERE id_genre = ?",[id_genre],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] === undefined){
                    resolve();
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
                else if(results[0] == undefined){
                    reject(Errors.GENRE_NAME_UNKNOWN);
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
    },

    update_genre_wording : async (genre,wording) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT genre_name FROM genre WHERE genre.genre_name = ?",[genre],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] == undefined){
                    reject(Errors.GENRE_NAME_UNKNOWN);
                }
                else{
                    bdd.query("UPDATE genre SET ? WHERE genre.genre_name = ?",{wording : wording},
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

    get_genres_movie: async (id_movie) => {
        return new Promise( async (resolve,reject) => {
            bdd.query("SELECT genre_name FROM genre,movie_genre WHERE movie_genre.id_movie = ? AND genre.id_genre = movie_genre.id_genre",[id_movie],
            (error,results) => {
                console.log(results);
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else{
                    resolve(results);
                }
            })
        })
    },

    add_genre_for_movie : async (movie_name,id_genre) => {
        return new Promise((resolve,reject) => {
            bdd.query("INSERT INTO movie_genre (id_movie,id_genre) SELECT id_movie,id_genre FROM movies,genre WHERE movies.name = ? AND genre.id_genre = ?",
            [movie_name,id_genre],
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

    get_desc : async (id_genre) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT wording FROM genre WHERE genre.id_genre = ?",[id_genre],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] === undefined){
                    reject(Errors.GENRE_ID_UNKNOWN);
                }
                else{
                    resolve(results);
                }
            })
        })
    },

    delete_genre_for_movie : async (id_movie) => {
        return new Promise((resolve,reject) => {
            bdd.query("DELETE FROM movie_genre WHERE movie_genre.id_movie = ?",[id_movie],
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
}

module.exports = genre_model;