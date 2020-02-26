const express = require("express");
const router = express.Router();
const movies_model = require("../models/movies_model");
const comment_model = require("../models/comment_model");
const user_model = require("../models/user_model");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

router.get("/", verifyToken, async (req, res) => {
    try {
        let all_movies = await movies_model.load_all_movies();
        res.render('articles/articles', { movies: all_movies.results, isAdmin: req.user.isAdmin });
    }
    catch (error) {
        //TO DO : handle crash db
        res.render('articles/articles');
    }
})


router.get("/create", verifyToken, isAdmin, (req, res) => {
    //TO DO handle crash db
    res.render('articles/create_article');
})

router.post("/", verifyToken, isAdmin, (req, res) => {
    if (isNaN(req.body.release_year) || isNaN(req.body.running_time)) {
        //Release Year And Running time must be numers
        res.redirect("/movies");
    }
    else {
        movies_model.insert_movie(req.body.movie_name, req.body.realisator, req.body.release_year, req.body.running_time, req.body.synopsis, req.user.user_id);
        res.redirect("/movies");
    }
})

router.get("/update/:id", verifyToken, isAdmin, async (req, res) => {
    if (isNaN(req.params.id)) {
        //id not a number
        res.redirect("/");
    }
    else {
        try {
            let data_movie = await movies_model.load_movie(req.params.id);
            res.render("articles/update_article", { data_movie });
        }
        catch (error) {
            res.redirect("/home");
        }
    }
})

router.get("/delete/:id", verifyToken, isAdmin, async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        //TO DO handle crash db
        movies_model.delete_movie(req.params.id);
        res.redirect("/movies");
    }
})

router.post("/comments/:id", verifyToken, (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        //maybe not let an user add comment before 10min
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '/' + mm + '/' + dd;
        //TO DO handle crash db
        comment_model.insert_comment(req.body.comment, today, req.user.user_id, parseInt(req.params.id));
        res.redirect("/movies/" + req.params.id);
    }
})

router.get("/:id", verifyToken, async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        try {
            let data_movie = await movies_model.load_movie(req.params.id);
            try {
                let comments = await comment_model.all_comment(+(req.params.id));
                let usernames = [];
                let username;
                for (let i = 0; i < comments.length; i++) {
                    username = await user_model.get_username(comments[i]["id_user"]);
                    usernames.push(username[0].username);
                }
                res.render("articles/movie_article", { data_movie: data_movie, comments: comments, usernames: usernames });
            } catch (error) {
                console.log(error);
                
                res.render("articles/movie_article", { data_movie: data_movie, comments: undefined });
            }

        }
        catch (error) {
            res.redirect("/home")
        }
    }
})

router.post("/:id", verifyToken, isAdmin, (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        movies_model.update_movie(req.params.id, req.body.movie_name, req.body.realisator, req.body.release_year, req.body.running_time, req.body.synopsis);
        res.redirect("/movies");
    }
})


module.exports = router;