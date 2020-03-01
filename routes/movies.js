const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const movies = require("../controllers/movies_controller");


router.get("/", verifyToken, movies.show_all);

router.get("/create", verifyToken, isAdmin, movies.get_creation_page);

router.post("/", verifyToken, isAdmin, movies.create, movies.resize_image);

router.get("/update/:id", verifyToken, isAdmin, movies.get_update_page);

router.get("/delete/:id", verifyToken, isAdmin, movies.delete_by_id);

router.get("/comments/delete/:id" , verifyToken , movies.delete_comment);

router.post("/comments/:id", verifyToken, movies.add_comment);

router.post("/rate/:id", verifyToken, movies.rate);

router.get("/:id", verifyToken, movies.get_by_id);

router.post("/:id", verifyToken, isAdmin, movies.update_by_id);


module.exports = router;