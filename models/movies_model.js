const bdd = require("./bdd");
const Errors = require("./errors");

const movies_model = {
    insert_movie: async (movie_name, realisator, release_year, running_time, synopsis, creator) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT name FROM movies WHERE movies.name = ?",movie_name,
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if (results[0] !== undefined){
                    reject(Errors.MOVIE_NAME_TAKEN);
                }
                else{
                    bdd.query("INSERT INTO movies SET ?",
                    { name: movie_name, realisator: realisator, release_year: release_year, running_time: running_time, synopsis: synopsis, id_user: creator },
                    (error, results) => {
                        if (error){
                            reject(Errors.DB_UNAVAILABLE);
                        }
                        else{
                            resolve();
                        }
                    })
                }
            })
        })
    },
    load_all_movies: async () => {
        return new Promise((resolve, reject) => {
            bdd.query("SELECT * FROM movies",
            (error, results) => {
                if (error) {
                    reject(Errors.DB_UNAVAILABLE);
                }
                else {
                    resolve({results: results});
                }
            })
        })
    },
    load_movie: async (id_movie) => {
        return new Promise((resolve, reject) => {
            bdd.query("SELECT * FROM movies WHERE movies.id_movie = ?", id_movie,
            (error, results) => {
                if (error) {
                    reject(Errors.DB_UNAVAILABLE);
                }
                else if(results[0] !== undefined){
                    resolve(results);
                }
                else{
                    reject(Errors.NO_MOVIE_CORRESPONDANCE);
                }
            })
        })
    },
    delete_movie: async (id_movie) => {
        return new Promise((resolve,reject) => {
            bdd.query("DELETE FROM movies WHERE movies.id_movie = ?", id_movie, 
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
    update_movie: (id_movie, movie_name, realisator, release_year, running_time, synopsis) => {
        return new Promise((resolve,reject) => {
            bdd.query("UPDATE movies SET ? WHERE movies.id_movie = ?",
            [{ name: movie_name, realisator: realisator, release_year: parseInt(release_year), running_time: parseInt(running_time), synopsis: synopsis},parseInt(id_movie)],
            (error, results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else{
                    resolve();
                }
        })
        })
    },

    already_rated : async (id_movie,id_user)=>{
        return new Promise((resolve,reject) =>{
            bdd.query("SELECT mark FROM movie_mark WHERE movie_mark.id_movie = ? AND movie_mark.id_user = ?",[id_movie,id_user],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] == undefined){
                    resolve(false);
                }
                else{
                    resolve(true);
                }
            })
        })
    },

    rate_movie: (id_user,id_movie,mark) => {
        return new Promise((resolve,reject) => {
            bdd.query("INSERT INTO movie_mark SET ?", {mark: mark , id_user: id_user,id_movie: id_movie},
            (error,results) =>{
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else{
                    resolve();
                }
            })
        })
    },

    update_rate_movie : (id_user,id_movie,mark) =>{
        return new Promise((resolve,reject) => {
            bdd.query("UPDATE movie_mark SET ? WHERE movie_mark.id_user = ? AND movie_mark.id_movie = ?",[{mark:mark},id_user,id_movie],
            (error,results) =>{
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else{
                    resolve();
                }
            })
        })
    },

    get_movie_name : async (id_movie) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT name FROM movies WHERE movies.id_movie = ?",[id_movie],
            (error,results) => {
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] !== undefined){
                    resolve(results[0]["name"]);
                }
                else{
                    resolve();
                }
            })
        })
    },

    get_movie_rate : async (id_movie) => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT SUM(mark) as sum,COUNT(mark) as count FROM `movie_mark` WHERE id_movie = ?",[id_movie],
            (error,results) =>{
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else if(results[0] == undefined){
                    resolve(undefined);
                }
                else{
                    //This calcul permits us to have a round the float to the first decimal
                    resolve( (Math.round((results[0]["sum"] / results[0]["count"])*10)) / 10 );
                }
            })
        })
    }
}

module.exports = movies_model;