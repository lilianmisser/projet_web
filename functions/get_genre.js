const genre_model = require("../models/genre_model");

//Post conditions : A tab containing movies informations (Used with a specifical query)
//Function that returns an array containing the genres for each movie
get_genre = async (tab) => {
    let genres = [];
    let genres_movie;
    let string_genre = "";
    for (i = 0; i < tab.length; i++) {
        genres_movie = await genre_model.get_genres_movie(+tab[i]["id_movie"]);
        for (j = 0; j < genres_movie.length; j++) {
            if (j == (genres_movie.length - 1)) {
                string_genre += genres_movie[j]["genre_name"];
                genres.push(string_genre);
                string_genre = "";
            }
            else {
                string_genre += genres_movie[j]["genre_name"] + "/";
            }
        }
    }
    return genres;
}

module.exports = get_genre;