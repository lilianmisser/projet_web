const rating_model = require("../models/rating_model");
const movies_model = require("../models/movies_model");
const Errors = require("../models/errors");
const get_certain_movies = require("../functions/get_certain_movies");
const get_image_path = require("../functions/get_image_path");

exports.get_home_page = async (req,res) =>{
    let data = await rating_model.get_movies_by_avg();
    try{
        let best_rated_movies = await get_certain_movies(2,3,data);
        let all_names = await movies_model.get_all_names_and_id();
        let movies_name = [];
        let movies_id = [];
        let movies_path = [];
        for(i=0 ; i< all_names.length ; i++){
            movies_name.push(all_names[i].name);
            movies_id.push(all_names[i].id_movie);
            movies_path.push(get_image_path(all_names[i].name));
        };
        res.render("accueil",{isAdmin :  req.user.isAdmin, movies: best_rated_movies, movies_name : [movies_name] ,nb_output : best_rated_movies.length, movies_id : movies_id, movies_path : movies_path});
    }
    catch(error){
        console.log(error);
    }
};