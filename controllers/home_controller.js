const rating_model = require("../models/rating_model");
const movies_model = require("../models/movies_model");
const Errors = require("../models/errors");
const get_certain_movies = require("../functions/get_certain_movies");
const get_image_path = require("../functions/get_image_path");
const data_for_autocomplete = require("../functions/data_for_autocomplete");

exports.get_home_page = async (req, res) => {
    let data = await rating_model.get_movies_by_avg();
    try {
        let best_rated_movies = await get_certain_movies(2, 3, data);
        let auto_data = await data_for_autocomplete();
        console.log(req.user);
        res.render("accueil", { isAdmin: req.user.isAdmin, movies: best_rated_movies,nb_output: best_rated_movies.length,auto_data});
    }
    catch (error) {
        console.log(error);
    }
};