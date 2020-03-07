const movies_model = require("../models/movies_model");
const get_genre = require("./get_genre");
const get_image_path = require("./get_image_path");
const rating_model = require("../models/rating_model")

const get_all_movie_data = async (all_movies) => {
    let genres = await get_genre(all_movies);
    //I was not able to get multi dimensional array in the front side so i fetch my data in simple arrays;
    let images_path = [];
    let release_year = [];
    let movies_name = [];
    let realisators = [];
    let running_time = [];
    let movies_id = [];
    let average_rate = [];
    let nb_mark = [];
    for (i = 0; i < all_movies.length; i++) {
        images_path.push(get_image_path(all_movies[i]["name"]));
        release_year.push(all_movies[i]["release_year"]);
        movies_name.push(all_movies[i]["name"]);
        realisators.push(all_movies[i]["realisator"]);
        running_time.push(all_movies[i]["running_time"]);
        movies_id.push(all_movies[i]["id_movie"]);
        let average_mark = await rating_model.get_movie_rate(all_movies[i]["id_movie"]);
        nb_mark.push(average_mark.nb_mark)
        if(isNaN(average_mark.avg)){
            average_rate.push(-1);
        }
        else{
            average_rate.push(average_mark.avg);
        }
    }
    return({images_path, release_year, movies_name, realisators, running_time, movies_id, genres,average_rate,nb_mark});
}

module.exports = get_all_movie_data;