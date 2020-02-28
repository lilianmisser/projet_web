const movies_model = require("../models/movies_model");
const comment_model = require("../models/comment_model");
const user_model = require("../models/user_model");
const Errors = require("../models/errors");
const moment = require("moment");
const jwt = require("jsonwebtoken");


exports.show_all = async (req, res) => {
    try {
        let all_movies = await movies_model.load_all_movies();
        res.render('articles/articles', { movies: all_movies.results, isAdmin: req.user.isAdmin });
    }
    catch (error) {
        res.status(503).render('articles/articles');
    }
};

exports.get_creation_page = (req, res) => {
    res.render('articles/create_article', { error: undefined });
};

exports.create = async (req, res) => {
    if (isNaN(req.body.release_year) || isNaN(req.body.running_time)) {
        res.render("articles/create_article", { error: "Release year and running time have to be numbers" });
    }
    else {
        try {
            await movies_model.insert_movie(req.body.movie_name, req.body.realisator, +req.body.release_year, +req.body.running_time, req.body.synopsis, req.user.user_id);
            res.redirect("/movies");
        }
        catch (error) {
            switch (error) {
                case Errors.DB_UNAVAILABLE:
                    res.status(503);
                case Errors.MOVIE_NAME_TAKEN:
                    res.render("articles/create_article", { error: error.message });
            }
        }
    }
};

exports.get_update_page = async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/");
    }
    else {
        try {
            let data_movie = await movies_model.load_movie(req.params.id);
            res.render("articles/update_article", { data_movie });
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

exports.delete_by_id = async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        try {
            movies_model.delete_movie(req.params.id);
            res.redirect("/movies");
        }
        catch{
            res.status(503);
        }

    }
};

exports.add_comment = async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        //maybe not let an user add comment before 10min
        try {
            let today = new Date();
            let ss = String(today.getSeconds()).padStart(2, '0');
            let mi = String(today.getMinutes()).padStart(2, '0');
            let hh = String(today.getHours()).padStart(2, '0');
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd + " " + hh + ":" + mi + ":" + ss;

            await comment_model.insert_comment(req.body.comment, today, req.user.user_id, +req.params.id);
            res.redirect("/movies/" + req.params.id );
        }
        catch{
            res.status(503);
        }
    }
};

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
            console.log("test");
            let data_movie = await movies_model.load_movie(+(req.params.id));
            let average_mark = await movies_model.get_movie_rate(+(req.params.id));
            try {
                let canComment = await comment_model.canComment(req.user.user_id, +req.params.id);
                console.log(canComment);
                try {
                    console.log("test2");
                    let comments = await comment_model.all_comment(+(req.params.id));
                    let usernames = [];
                    let username;
                    for (let i = 0; i < comments.length; i++) {
                        comments[i]["post_date"] = moment(comments[i]["post_date"]).fromNow();
                        username = await user_model.get_username(comments[i]["id_user"]);
                        usernames.push(username[0].username);
                    }
                    if (canComment) {
                        console.log("test3");
                        res.render("articles/movie_article", { data_movie: data_movie, comments: comments, usernames: usernames, average_mark: average_mark, canComment: canComment });
                    }
                    else {
                        console.log("test4");
                        res.render("articles/movie_article", { data_movie: data_movie, comments: comments, usernames: usernames, average_mark: average_mark, canComment: canComment });
                    }

                } catch (error) {
                    console.log("test5");
                    res.render("articles/movie_article", { data_movie: data_movie, comments: undefined, usernames : undefined, average_mark: average_mark, canComment: canComment });
                }

            }
            catch{
                console.log("test6");
                res.status(503);
            }
        }
        catch (error) {
            console.log("test");
            switch (error) {
                case Errors.DB_UNAVAILABLE:
                    res.status(503);
                case Errors.NO_MOVIE_CORRESPONDANCE:
                    res.status(400).render("articles/articles");
            }
        }
    }
};

exports.update_by_id = (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        try {
            movies_model.update_movie(req.params.id, req.body.movie_name, req.body.realisator, req.body.release_year, req.body.running_time, req.body.synopsis);
            res.redirect("/movies");
        }
        catch{
            res.status(503);
        }
    }
};