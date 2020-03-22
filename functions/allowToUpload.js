const path = require("path");
const fs = require("fs");
const genre_model = require("../models/genre_model");
const movies_model = require("../models/movies_model");
const Errors = require('../models/errors');

//We only have access to req.body and req.file when i use upload function with multer (multidata post) 
//so i need to treat all the data here with a callback function retrieving errors or success
const allowToUpload = async (req, file, cb) => {
    if (file !== undefined) {
        const allowed_types = /jpeg|jpg/;
        //We need to check both extension type and mimetype
        const extension = allowed_types.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed_types.test(file.mimetype);
        if (extension === true && mime === true) {
            if (isNaN(req.body.release_year) || isNaN(req.body.running_time)) {
                cb("Release year and running time have to be numbers");
            }
            else {
                if (req.body.movie_name.search("_") === -1) {
                    try {
                        let id_genres = [];
                        let length = (req.body.genre === undefined) ? 0 : req.body.genre.length;
                        if(length == 0){
                            // do nothing
                        }
                        else if(! Array.isArray(req.body.genre)){
                            let id_genre = await genre_model.get_id_genre(req.body.genre);
                            id_genres.push(id_genre);
                        }
                        else{
                            for (i = 0; i < length; i++) {
                                let id_genre = await genre_model.get_id_genre(req.body.genre[i]);
                                id_genres.push(id_genre);
                            }
                        }
                        try {
                            await movies_model.insert_movie(req.body.movie_name, req.body.realisator, +req.body.release_year, +req.body.running_time, req.body.synopsis);
                            for (i = 0; i < id_genres.length; i++) {
                                await genre_model.add_genre_for_movie(req.body.movie_name, id_genres[i]);
                            }
                            cb(null, true);
                        }
                        catch (error) {
                            console.log(error);
                            cb(error.message);
                        }
                    }
                    catch (error) {
                        console.log(error);
                        switch (error) {
                            case Errors.DB_UNAVALAIBLE:
                                cb(error.message);
                            case Errors.WRONG_GENRE_NAME:
                                cb(error.message);
                        }
                    }
                }
                else {
                    cb("The name of the movie can't have underscores inside");
                }
            }
        }
        else {
            cb("Only jpeg/jpg images");
        }
    }
    else {
        cb("Please upload an image");
    }
};

module.exports = allowToUpload;