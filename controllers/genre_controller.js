const genre_model = require("../models/genre_model");
const Errors = require("../models/errors");

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
        try{
            let movies = await genre_model.get_movies_by_genre(id_genre);
            if (movies === undefined){
                res.render("articles/articles",{ movies: undefined, isAdmin: req.user.isAdmin });
            }
            else{
                res.render("articles/articles",{ movies: movies, isAdmin: req.user.isAdmin });
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