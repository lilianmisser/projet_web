const genre_model = require("../models/genre_model");
const Errors = require("../models/errors");

exports.get_all_genres = async (req,res) => {
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

exports.add_genre = async (req,res) => {
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