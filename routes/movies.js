const express = require("express");
const router = express.Router();
const movies_model = require("../models/movies_model");
const comment_model = require("../models/comment_model");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

router.get("/", verifyToken, async (req, res) => {
    let all_movies = await movies_model.load_all_movies();
    if (typeof all_movies == undefined) {
        res.render('articles/articles');
    }
    else {
        res.render('articles/articles', { movies: all_movies, isAdmin: req.user.isAdmin });
    }
})


router.get("/create", verifyToken, isAdmin, (req, res) => {
    res.render('articles/create_article');
})

router.post("/", verifyToken, isAdmin, (req, res) => {
    if (isNaN(req.body.release_year) || isNaN(req.body.running_time)){
        //Release Year And Running time must be numers
        res.redirect("/movies");
    }
    else{
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
        let data_movie = await movies_model.load_movie(req.params.id);
        if (typeof data_movie !== undefined) {
            res.render("articles/update_article", { data_movie });
        }
        else {
            //This movie doesnt exist
            res.redirect("/home");
        }
    }
})

router.get("/delete/:id", verifyToken, isAdmin, async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
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
        today = mm + '/' + dd + '/' + yyyy;
        
        comment_model.insert_comment(req.body.content, today, req.user.user_id, req.params.id);
        res.redirect("/movies/" + req.params.id);
    }
})

router.get("/:id", verifyToken, async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        let data_movie = await movies_model.load_movie(parseInt(req.params.id));
        if (typeof data_movie !== undefined) {
            let comments = await comment_model.all_comment(req.params.id);
            res.render("articles/movie_article", { data_movie: data_movie, comments: comments });
        }
        else {
            res.redirect("/home");
        }
    }
})

router.post("/:id", verifyToken, isAdmin, (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        console.log(req.body);
        movies_model.update_movie(req.params.id, req.body.movie_name, req.body.realisator, req.body.release_year, req.body.running_time, req.body.synopsis);
        res.redirect("/movies");
    }
})


module.exports = router;