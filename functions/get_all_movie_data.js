const movies_model = require("../models/movies_model");
const get_genre = require("./get_genre");
const get_image_path = require("./get_image_path");

const get_all_movie_data = async () => {
    let all_movies = await movies_model.load_all_movies();
    let genres = await get_genre(all_movies);
    //I was not able to get multi dimensional array in the front side so i fetch my data in simple arrays;
    let images_path = [];
    let release_year = [];
    let movies_name = [];
    let realisators = [];
    let running_time = [];
    let movies_id = [];
    for (i = 0; i < all_movies.length; i++) {
        images_path.push(get_image_path(all_movies[i]["name"]));
        release_year.push(all_movies[i]["release_year"]);
        movies_name.push(all_movies[i]["name"]);
        realisators.push(all_movies[i]["realisator"]);
        running_time.push(all_movies[i]["running_time"]);
        movies_id.push(all_movies[i]["id_movie"]);
    }
    return({images_path, release_year, movies_name, realisators, running_time, movies_id, genres});
}

module.exports = get_all_movie_data;