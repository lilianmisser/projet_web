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
    }
}

module.exports = rating_model