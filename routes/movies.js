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
        res.status(503).render('articles/articles');
    }
})


router.get("/create", verifyToken, isAdmin, (req, res) => {
    res.render('articles/create_article');
})

router.post("/", verifyToken, isAdmin, (req, res) => {
    if (isNaN(req.body.release_year) || isNaN(req.body.running_time)) {
        res.redirect("/movies");
    }
    else {
        try{
            movies_model.insert_movie(req.body.movie_name, req.body.realisator, req.body.release_year, req.body.running_time, req.body.synopsis, req.user.user_id); 
        }
        catch(error){
            res.status(503);
        }
    }
})

router.get("/update/:id", verifyToken, isAdmin, async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/");
    }
    else {
        try {
            let data_movie = await movies_model.load_movie(req.params.id);
            res.render("articles/update_article", { data_movie });
        }
        catch (error) {
            switch(error){
                case movies_model.Errors.DB_UNAVAILABLE:   
                    res.status(503);
                case movies_model.Errors.NO_MOVIE_CORRESPONDANCE:
                    res.status(400).render("articles/articles");
            }
        }
    }
})

router.get("/delete/:id", verifyToken, isAdmin, async (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        try{
            movies_model.delete_movie(req.params.id);
            res.redirect("/movies");
        }
        catch{
            res.status(503);
        }
        
    }
})

router.post("/comments/:id", verifyToken, (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        //maybe not let an user add comment before 10min
        try{
            comment_model.insert_comment(req.body.comment, today, req.user.user_id, parseInt(req.params.id));

            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();
            today = yyyy + '/' + mm + '/' + dd;
        
            res.redirect("/movies/" + req.params.id); 
        }
        catch{
            res.status(503);
        }
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
                res.render("articles/movie_article", { data_movie: data_movie, comments: undefined });
            }
        }
        catch (error) {
            switch(error){
                case movies_model.Errors.DB_UNAVAILABLE:   
                    res.status(503);
                case movies_model.Errors.NO_MOVIE_CORRESPONDANCE:
                    res.status(400).render("articles/articles");
            }
        }
    }
})

router.post("/:id", verifyToken, isAdmin, (req, res) => {
    if (isNaN(req.params.id)) {
        res.redirect("/movies");
    }
    else {
        try{
            movies_model.update_movie(req.params.id, req.body.movie_name, req.body.realisator, req.body.release_year, req.body.running_time, req.body.synopsis);
            res.redirect("/movies");
        }
        catch{
            res.status(503);
        }
    }
})


module.exports = router;