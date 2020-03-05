const profile_model = require("../models/profile_model");
const user_model = require("../models/user_model");
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
};

exports.get_update_page = async(req,res) => {
    try{
        let user_data = await profile_model.get_all_data_profile(req.user.user_id);
        res.render("profile/update_profile", {user_data : user_data, isAdmin: req.user.isAdmin, error : undefined});
    }
    catch(error){
        switch(error){
            case Errors.DB_UNAVALAIBLE:
                res.status(503);
            case Errors.NO_USER_CORRESPONDANCE:
                res.redirect("/home");
        }
    }
};

exports.update = async (req,res) => {
    if(isNaN(req.params.id)){
        res.redirect("/profile");
    }
    else{
        try{
            let err = user_model.check_informations("goodusername",req.body.firstname,req.body.lastname,req.body.mail,"goodpassword");
            if(err === undefined){
                await profile_model.update_profile(+req.params.id,req.body.firstname,req.body.lastname,req.body.mail);
                res.redirect("/profile");
            }
            else{
                let user_data = await profile_model.get_all_data_profile(req.user.user_id);
                res.render("profile/update_profile", {user_data :user_data, isAdmin : req.user.isAdmin , error : err});
            }
        }
        catch(error){
            console.log(error);
            res.status(503);
        }
    }
}

exports.delete_by_id = async(req,res) => {}