const bdd = require("./bdd");

const movies_model = {
    insert_movie: (movie_name, realisator, release_year, running_time, synopsis, creator) => {
        bdd.query("INSERT INTO movies SET ?",
            { name: movie_name, realisator: realisator, release_year: parseInt(release_year), running_time: parseInt(running_time), synopsis: synopsis, id_user: creator },
            (error, results, fields) => {
                if (error) throw error;
                console.log("Movie inserted into db");
            })
    },
    load_all_movies: async () => {
        return new Promise((resolve, reject) => {
            bdd.query("SELECT * FROM movies", function (error, results, fields) {
                if (error) {
                    reject({error:"query failed"});
                }
                else {
                    resolve({results: results});
                }
            })
        })
    },
    load_movie: async (id_movie) => {
        return new Promise((resolve, reject) => {
            bdd.query("SELECT * FROM movies WHERE movies.id_movie = ?", id_movie, (error, results, fields) => {
                if (error) {
                    reject({error : "query failed"});
                }
                else if(results !== []){
                    resolve(results);
                }
                else{
                    reject({error: "no correspondance"});
                }
            })
        })
    },
    delete_movie: (id_movie) => {
        bdd.query("DELETE FROM movies WHERE movies.id_movie = ?", id_movie, (error, results, fields) => {
            if (error) throw error;
            console.log("user_deleted");
        })
    },
    update_movie: (id_movie, movie_name, realisator, release_year, running_time, synopsis) => {
        bdd.query("UPDATE movies SET ? WHERE movies.id_movie = ?",
        [{ name: movie_name, realisator: realisator, release_year: parseInt(release_year), running_time: parseInt(running_time), synopsis: synopsis},
        parseInt(id_movie)],
        (error, results, fields) => {
            if (error) throw error;
            console.log("Movie updated");
        })
    },

    already_rated : async (id_movie,id_user)=>{
        return new Promise((resolve,reject) =>{
            bdd.query("SELECT mark FROM movie_mark WHERE movie_mark.id_movie = ? AND movie_mark.id_user = ?",[id_movie,id_user],
            (error,results) => {
                if(error){
                    reject(error);
                }
                else if(results == []){
                    resolve(false);
                }
                else{
                    resolve(true);
                }
            })
        })
    },

    rate_movie: (id_user,id_movie,mark) => {
        bdd.query("INSERT INTO movie_mark SET ?", {mark:mark,id_user:id_user,id_movie:id_movie},
        (error,results) =>{
            if (error) throw error;
            console.log("mark added to db");
        })
    },

    update_rate_movie : (id_user,id_movie,mark) =>{
        bdd.query("UPDATE movie_mark SET ? WHERE movie_mark.id_user = ? AND movie_mark.id_movie = ?",[{mark:mark},id_user,id_movie],
        (error,results) =>{
            if(error) throw error;
            console.log("mark has been updated");
        })
    }
}

module.exports = movies_model;