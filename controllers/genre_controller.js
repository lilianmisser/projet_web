const genre_model = require("../models/genre_model");
const Errors = require("../models/errors");
const get_image_path = require("../functions/get_image_path");
const get_genre = require("../functions/get_genre");
const data_for_autocomplete = require("../functions/data_for_autocomplete");
const get_all_movie_data = require("../functions/get_all_movie_data");

exports.get_all = async (req,res) => {
    try{
        let genres = await genre_model.get_all_genres();
        let auto_data = await data_for_autocomplete();
        if(genres === undefined){
            res.render("genres/view_genres",{isAdmin : req.user.isAdmin, genres : undefined, auto_data});
        }
        else{
            res.render("genres/view_genres",{isAdmin : req.user.isAdmin, genres : genres, auto_data});
        }
    }
    catch(error){
        console.log(error);
        res.status(503);
    }
}

exports.create = async (req,res) => {
    try{
        await genre_model.insert_genre(req.body.genre_name,req.body.description);
        res.redirect("/movies/genres");
    }
    catch(error){
        switch(error){
            case Errors.DB_UNAVALAIBLE:
                res.status(503);
            case Errors.GENRE_NAME_ALREADY_EXISTS:
                res.status(400);
        }
    }
}

exports.get_movies = async (req,res) => {
    try{
        let id_genre = await genre_model.get_id_genre(req.params.name);
        let desc_genre = await genre_model.get_desc(id_genre);
        let desc = req.params.name + " movies," + desc_genre[0]["wording"];
        try{
            let movies = await genre_model.get_movies_by_genre(id_genre);
            let genres = await get_genre(movies);
            let data = await get_all_movie_data(movies);
            let auto_data = await data_for_autocomplete();
            let images_path = [];
            for(i=0;i<movies.length;i++){
                images_path.push(get_image_path(movies[i]["name"]));
            };

            if (movies === undefined){
                res.render("articles/articles",{ movies: [], isAdmin: req.user.isAdmin , genres : [] , desc : desc, image_path : images_path,data, auto_data});
            }
            else{
                res.render("articles/articles",{ movies: movies, isAdmin: req.user.isAdmin , genres : genres, desc : desc, image_path : images_path, data, auto_data});
            }

        }
        catch(error){
            console.log(error);
            res.status(503);
        }
    }
    catch(error){
        switch(error){
            case Errors.DB_UNAVALAIBLE :
                res.status(503);
            case Errors.WRONG_GENRE_NAME :
                res.redirect("/movies/genres");
        }
    }
}

exports.delete = async (req,res) => {
    try{
        await genre_model.delete_genre(req.params.name)
        res.redirect("/movies/genres");
    }
    catch(error){
        switch(error){
            case Errors.DB_UNAVALAIBLE:
                res.status(503);
            case Errors.GENRE_NAME_UNKNOWN:
                res.redirect("/movies/genres");
        }
    }
}

exports.update_wording = async (req,res) => {
    try{
        await genre_model.update_genre_wording(req.body.genre,req.body.description);
        res.redirect("/movies/genres");
    }
    catch(error){
        switch(error){
            case Errors.DB_UNAVALAIBLE:
                res.status(503);
            case Errors.GENRE_NAME_UNKNOWN:
                res.redirect("/movies/genres");
        }
    }
}