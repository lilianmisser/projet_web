const movies_model = require("../models/movies_model");
const get_image_path = require("./get_image_path");

const data_for_autocomplete = async () => {
    let all_names = await movies_model.get_all_names_and_id();
    let _movies_name = [];
    let _movies_id = [];
    let _movies_path = [];
    for (i = 0; i < all_names.length; i++) {
        _movies_name.push(all_names[i].name);
        _movies_id.push(all_names[i].id_movie);
        _movies_path.push(get_image_path(all_names[i].name));
    };
    return({_movies_name,_movies_path,_movies_id});
};

module.exports = data_for_autocomplete;