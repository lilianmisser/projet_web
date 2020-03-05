const fs = require("fs");

//Function that returns the path of the movie image, if it doesnt finds it showing an undefined image as replacement
get_image_path = (movie_name) => {
    let core_path = '/movie_images/_' + movie_name.replace(/\s/g, '_');
    let existing_path = ((fs.existsSync("./public" + core_path + ".jpg")) || (fs.existsSync("./public" + core_path + ".jpeg")));
    if (existing_path === false) {
        return "/undefined.jpeg";
    }
    else {
        return (fs.existsSync("./public" + core_path + ".jpg") ? core_path + ".jpg" : core_path + ".jpeg");
    }
}

module.exports = get_image_path;