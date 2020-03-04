const bdd = require("./bdd");
const Errors = require("./errors");

const rating_model = {
    get_movies_by_avg : async () => {
        return new Promise((resolve,reject) => {
            bdd.query("SELECT id_movie,COUNT(mark) as nb_mark,AVG(mark) as avg_mark FROM movie_mark GROUP BY id_movie ORDER BY avg_mark DESC",
            (error,results) =>{
                if(error){
                    reject(Errors.DB_UNAVALAIBLE);
                }
                else{
                    resolve(results);
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

module.exports = rating_model