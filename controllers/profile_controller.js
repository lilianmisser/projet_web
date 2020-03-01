const profile_model = require("../models/profile_model");
const Errors = require("../models/errors");

exports.get_profile_page = async (req,res) => {
    try{
        let user_data = await profile_model.get_all_data_profile(req.user.user_id);
        res.render("profile/view_profile", {user_data : user_data, isAdmin: req.user.isAdmin});
    }
    catch(error){
        switch(error){
            case Errors.DB_UNAVALAIBLE:
                res.status(503);
            case Errors.NO_USER_CORRESPONDANCE:
                res.redirect("/home");
        }
    }
}