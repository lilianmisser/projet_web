const rating_model = require("../models/rating_model");
const movies_model = require("../models/movies_model");
const Errors = require("../models/errors");
const fs = require("fs");

//Function that returns (nb_output) movies of (tab : where it is sorted by best avg notes) with at least min_nb_view
//specific function working with the result of a specific query but permits us to change the inputs values as the website grows
get_certain_movies = async (min_nb_mark,nb_output,tab) => {
    let i = 0;
    let j = 0;
    let output = [];
    let name;
    let core_path;
    let image_path;
    while(i < nb_output && j < tab.length ){
        if(tab[j]["nb_mark"] >= min_nb_mark){
            name = await movies_model.get_movie_name(tab[j]["id_movie"]);
            core_path = "/movie_images/_" + name.replace(/\s/g, '_');
            image_path = (fs.existsSync("./public" + core_path + ".jpg") ? core_path + ".jpg" : core_path + ".jpeg");
            output.push({id_movie : tab[j]["id_movie"], avg : tab[j]["avg_mark"], name: name, image_path: image_path});
            i+=1;
            j+=1;
        }
        else{
            j+=1;
        }
    }
    return output;
};

exports.get_home_page = async (req,res) =>{
    let data = await rating_model.get_movies_by_avg();
    try{
        let best_rated_movies = await get_certain_movies(2,3,data);
        res.render("accueil",{isAdmin :  req.user.isAdmin, movies: best_rated_movies,nb_output : best_rated_movies.length});
    }
    catch(error){
        console.log(error);
    }
};