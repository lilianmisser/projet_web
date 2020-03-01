//models
const movies_model = require("../models/movies_model");
const comment_model = require("../models/comment_model");
const user_model = require("../models/user_model");
const genre_model = require("../models/genre_model");
const profile_model = require("../models/profile_model");
const Errors = require("../models/errors");
//modules
const moment = require("moment");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
//Image gestion
const image_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/movie_images/");
    },
    filename: function (req, file, cb) {
        cb(null, req.body.movie_name.replace(/\s/g, '_') + (path.extname(file.originalname)).toLowerCase());
    }
});
const upload = multer({
    storage: image_storage,
    limits: { fileSize: 1000000000 },
    fileFilter: async (req, file, cb) => {
        allowToUpload(req, file, cb);
    }
}).single("movie_image");

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
                        let id_genre = await genre_model.get_id_genre(req.body.genre);
                        try {
                            await movies_model.insert_movie(req.body.movie_name, req.body.realisator, +req.body.release_year, +req.body.running_time, req.body.synopsis, id_genre);
                            cb(null, true);
                        }
                        catch (error) {
                            cb(error.message);
                        }
                    }
                    catch (error) {
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

//Controller functions

exports.show_all = async (req, res) => {
    try {
        let all_movies = await movies_model.load_all_movies();
        res.render('articles/articles', { movies: all_movies.results, isAdmin: req.user.isAdmin });
    }
    catch (error) {
        res.status(503).render('articles/articles', { isAdmin: req.user.isAdmin });
    }
};

exports.get_creation_page = async (req, res) => {
    try {
        let genres = await genre_model.get_all_genres();
        res.render('articles/create_article', { error: undefined, isAdmin: req.user.isAdmin, genres: genres });
    }
    catch (error) {
        res.status(503);
    }
};

exports.create = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            try {
                let genres = await genre_model.get_all_genres();
                res.render("articles/create_article", { error: err, isAdmin: req.user.isAdmin, genres: genres });
            }
            catch (error) {
                res.status(503);
            }
        }
        else {
            next();
        }
    });

};

exports.resize_image = async (req, res) => {
    await sharp("./public/movie_images/" + req.file.filename).resize(200, 200).toFile("./public/movie_images/_" + req.file.filename);
    fs.unlink("./public/movie_images/" + req.file.filename, (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/movies");
}

exports.get_update_page = async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/");
    }
    else {
        try {
            let genres = await genre_model.get_all_genres();
            try {
                let data_movie = await movies_model.load_movie(req.params.id);
                res.render("articles/update_article", { data_movie: data_movie, isAdmin: req.user.isAdmin, genres: genres, error:undefined });
            }
            catch (error) {
                switch (error) {
                    case Errors.DB_UNAVAILABLE:
                        res.status(503);
                    case Errors.NO_MOVIE_CORRESPONDANCE:
                        res.status(400).render("articles/articles", { isAdmin: req.user.isAdmin });
                }
            }
        }
        catch (error) {
            res.status(503);
        }
    }
};

exports.delete_by_id = async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        try {
            let movie_name = await movies_model.get_movie_name(+req.params.id);
            if (movie_name !== undefined) {
                try {
                    await movies_model.delete_movie(+req.params.id);
                    let core_path = './public/movie_images/_' + movie_name.replace(/\s/g, '_');
                    let existing_path = ((fs.existsSync(core_path + ".jpg")) || (fs.existsSync(core_path + ".jpeg")));
                    if (existing_path !== false) {
                        let path_to_delete = (fs.existsSync(core_path + ".jpg") ? core_path + ".jpg" : core_path + ".jpeg");
                        fs.unlink(path_to_delete, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                    res.redirect("/movies");
                }
                catch (error) {
                    console.log(error);
                    res.status(503);
                }
            }
            else {
                res.redirect("/movies");
            }
        } catch{
            res.status(503)
        }
    }
};

exports.add_comment = async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        try {
            //pad start used to have 02 and not 2 for february
            let today = new Date();
            let ss = String(today.getSeconds()).padStart(2, '0');
            let mi = String(today.getMinutes()).padStart(2, '0');
            let hh = String(today.getHours()).padStart(2, '0');
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd + " " + hh + ":" + mi + ":" + ss;

            await comment_model.insert_comment(req.body.comment, today, req.user.user_id, +req.params.id);
            res.redirect("/movies/" + req.params.id);
        }
        catch{
            res.status(503);
        }
    }
};

exports.delete_comment = async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        try {
            await comment_model.delete_comment(+req.params.id);
            res.redirect("/movies");
        }
        catch{
            res.status(503);
        }
    }
}

exports.rate = async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        if (req.body.mark == "0" || req.body.mark == "1" || req.body.mark == "2" || req.body.mark == "3" || req.body.mark == "4" || req.body.mark == "5") {
            try {
                let already_rated = await movies_model.already_rated(+req.params.id, req.user.user_id);
                if (already_rated) {
                    movies_model.update_rate_movie(req.user.user_id, +req.params.id, +req.body.mark);
                    res.redirect("/movies/" + req.params.id);
                } else {
                    movies_model.rate_movie(req.user.user_id, +req.params.id, +req.body.mark);
                    res.redirect("/movies/" + req.params.id);
                }
            }
            catch{
                res.status(503);
            }
        }
        else {
            res.redirect("/movies/" + req.params.id)
        }
    }
};

exports.get_by_id = async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        try {
            let data_movie = await movies_model.load_movie(+(req.params.id));
            let core_path = '/movie_images/_' + data_movie[0]["name"].replace(/\s/g, '_');
            let existing_path = ((fs.existsSync("./public" + core_path + ".jpg")) || (fs.existsSync("./public" + core_path + ".jpeg")));
            if (existing_path === false) {
                res.redirect("/movies");
            }
            else {
                let image_path = (fs.existsSync("./public" + core_path + ".jpg") ? core_path + ".jpg" : core_path + ".jpeg");
                try {
                    let average_mark = await movies_model.get_movie_rate(+(req.params.id));
                    try {
                        let canComment = await comment_model.canComment(req.user.user_id, +req.params.id);
                        try {
                            let comments = await comment_model.all_comment(+(req.params.id));
                            let usernames = [];
                            let username;
                            for (let i = 0; i < comments.length; i++) {
                                comments[i]["post_date"] = moment(comments[i]["post_date"]).fromNow();
                                username = await profile_model.get_username(comments[i]["id_user"]);
                                usernames.push(username[0].username);
                            }
                            if (canComment == true) {
                                res.render("articles/movie_article", { data_movie: data_movie, comments: comments, usernames: usernames, average_mark: average_mark, canComment: canComment, username: req.user.username, isAdmin: req.user.isAdmin, image_path: image_path });
                            }
                            else {
                                let now = new Date(Date.now());
                                let last_comment = new Date(canComment);
                                let minutes_to_comment = last_comment.getMinutes() + 10 - now.getMinutes();
                                let seconds_to_comment = last_comment.getSeconds() - now.getSeconds();
                                if (seconds_to_comment < 0) {
                                    seconds_to_comment += 60;
                                    minutes_to_comment -= 1;
                                }
                                res.render("articles/movie_article", { data_movie: data_movie, comments: comments, usernames: usernames, average_mark: average_mark, canComment: { minutes_left: minutes_to_comment, seconds_left: seconds_to_comment }, username: req.user.username, isAdmin: req.user.isAdmin, image_path: image_path });
                            }

                        } catch (error) {
                            if (canComment == true) {
                                res.render("articles/movie_article", { data_movie: data_movie, comments: undefined, usernames: undefined, average_mark: average_mark, canComment: canComment, username: req.user.username, isAdmin: req.user.isAdmin, image_path: image_path });
                            }
                            else {
                                let now = new Date(Date.now());
                                let last_comment = new Date(canComment);
                                let minutes_to_comment = last_comment.getMinutes() + 10 - now.getMinutes();
                                let seconds_to_comment = last_comment.getSeconds() - now.getSeconds();
                                if (seconds_to_comment < 0) {
                                    seconds_to_comment += 60;
                                    minutes_to_comment -= 1;
                                }
                                res.render("articles/movie_article", { data_movie: data_movie, comments: undefined, usernames: undefined, average_mark: average_mark, canComment: { minutes_left: minutes_to_comment, seconds_left: seconds_to_comment }, username: req.user.username, isAdmin: req.user.isAdmin, image_path: image_path });
                            }
                        }
                    }
                    catch{
                        res.status(503);
                    }
                }
                catch{
                    res.status(503);
                }
            }
        }
        catch (error) {
            switch (error) {
                case Errors.DB_UNAVAILABLE:
                    res.status(503);
                case Errors.NO_MOVIE_CORRESPONDANCE:
                    res.status(400).render("articles/articles");
            }
        }
    }
};

exports.update_by_id = async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        if (isNaN(req.body.release_year) || isNaN(req.body.running_time)) {
            res.status(400).send("Release year and running time have to be numbers");
        }
        else {
            if (req.body.movie_name.search("_") === -1) {
                try {
                    let movie_name = await movies_model.get_movie_name(+req.params.id);
                    if (movie_name !== undefined) {
                        try {
                            let id_genre = await genre_model.get_id_genre(req.body.genre);
                            try {
                                movies_model.update_movie(req.params.id, req.body.movie_name, req.body.realisator, req.body.release_year, req.body.running_time, req.body.synopsis, id_genre);
                                let core_path = './public/movie_images/_' + movie_name.replace(/\s/g, '_');
                                let core_new_path = './public/movie_images/_' + req.body.movie_name.replace(/\s/g, '_');
                                let existing_path = ((fs.existsSync(core_path + ".jpg")) || (fs.existsSync(core_path + ".jpeg")));
                                if (existing_path !== false) {
                                    let path_to_update = (fs.existsSync(core_path + ".jpg") ? core_path + ".jpg" : core_path + ".jpeg");
                                    let new_path = (fs.existsSync(core_path + ".jpg") ? core_new_path + ".jpg" : core_new_path + ".jpeg");
                                    fs.rename(path_to_update, new_path, (err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                                }
                                res.redirect("/movies");
                            }
                            catch (error) {
                                switch(error){
                                    case Errors.DB_UNAVALAIBLE:
                                        res.status(503);
                                }
                            }
                        }
                        catch (error) {
                            switch (error) {
                                case Errors.DB_UNAVALAIBLE:
                                    res.status(503);
                                case Errors.WRONG_GENRE_NAME:
                                    res.status(400).send(error.message);
                            }
                        }
                    }
                    else {
                        res.redirect("/movies");
                    }
                } catch{
                    res.status(503);
                }
            }
            else {
                res.status(400).send("No underscores in movie name");
            }
        }
    }
};