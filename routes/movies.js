const express = require("express");
const router = express.Router();
const movies_model = require("../models/movies_model");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

router.get("/", verifyToken, async (req, res) => {
    let all_movies = await movies_model.load_all_movies();
    if (typeof all_movies == undefined) {
        res.render('articles');
    }
    else {
        res.render('articles', { movies: all_movies, isAdmin: req.user.isAdmin });
    }
})


router.get("/create", verifyToken, isAdmin, (req, res) => {
    res.render('create_article');
})

router.post("/", verifyToken, isAdmin, (req, res) => {
    movies_model.insert_movie(req.body.movie_name, req.body.realisator, req.body.release_year, req.body.running_time, req.body.synopsis, req.user.user_id);
    res.redirect("/movies");
})

router.get("/update/:id", verifyToken, isAdmin, async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/");
    }
    else {
        let data_movie = await movies_model.load_movie(req.params.id);
        if (typeof data_movie !== undefined) {
            res.render("update_article", { data_movie });
        }
        else {
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


router.get("/:id", verifyToken, async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        let data_movie = await movies_model.load_movie(req.params.id);
        if (typeof data_movie !== undefined) {
            res.render("movie_article", { data_movie: data_movie });
        }
        else {
            res.redirect("/home");
        }
    }
})

router.post("/:id", verifyToken, isAdmin, (req,res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else{
        console.log(req.body);
        movies_model.update_movie(req.params.id,req.body.movie_name, req.body.realisator, req.body.release_year, req.body.running_time, req.body.synopsis);
        res.redirect("/movies");
    }
})


module.exports = router;