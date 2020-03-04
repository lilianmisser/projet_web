const genre_model = require("../models/genre_model");
const Errors = require("../models/errors");

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
                string_genre += genres_movie[j]["genre_name"] + ",";
            }
        }
    }
    return genres;
}

exports.get_all = async (req,res) => {
    try{
        let genres = await genre_model.get_all_genres();
        if(genres === undefined){
            res.render("genres/view_genres",{isAdmin : req.user.isAdmin, genres : undefined});
        }
        else{
            res.render("genres/view_genres",{isAdmin : req.user.isAdmin, genres : genres});
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
            if (movies === undefined){
                res.render("articles/articles",{ movies: undefined, isAdmin: req.user.isAdmin , genres : undefined , desc : desc});
            }
            else{
                res.render("articles/articles",{ movies: movies, isAdmin: req.user.isAdmin , genres : genres, desc : desc});
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
        await genre_model.update_genre_wording(req.body.wording);
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