const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const movies = require("../controllers/movies_controller");
const genre = require("../controllers/genre_controller");


router.get("/", verifyToken, movies.show_all);

router.get("/create", verifyToken, isAdmin, movies.get_creation_page);

router.post("/", verifyToken, isAdmin, movies.create, movies.resize_image);

router.get("/genres", verifyToken, genre.get_all);

router.post("/genres", verifyToken, isAdmin, genre.create);

router.get("/genres/delete/:name", verifyToken, isAdmin, genre.delete);

router.get("/genres/:name", verifyToken, genre.get_movies)

router.get("/update/:id", verifyToken, isAdmin, movies.get_update_page);

router.get("/delete/:id", verifyToken, isAdmin, movies.delete_by_id);

router.get("/comments/delete/:id" , verifyToken , movies.delete_comment);

router.post("/comments/:id", verifyToken, movies.add_comment);

router.post("/rate/:id", verifyToken, movies.rate);

router.get("/:id", verifyToken, movies.get_by_id);

router.post("/:id", verifyToken, isAdmin, movies.update_by_id);


module.exports = router;