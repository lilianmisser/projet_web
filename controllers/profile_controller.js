const profile_model = require("../models/profile_model");
const user_model = require("../models/user_model");
const Errors = require("../models/errors");
const data_for_autocomplete = require("../functions/data_for_autocomplete");

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
    if(isNaN(req.params.id)){
        res.redirect("/profile");
    }
    else{
        try{
            let user_data = await profile_model.get_all_data_profile(+req.params.id);
            let auto_data = await data_for_autocomplete();
            let desc = (req.user.user_id == req.params.id) ? "Update your profile" : `Update ${user_data[0]["username"]} profile`;
            res.render("profile/update_profile", {user_data : user_data, isAdmin: req.user.isAdmin, error : undefined,desc : desc,auto_data});
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

exports.get_users = async(req,res) => {
    try{
        let users = await profile_model.get_all_users();
        res.render("profile/gestion",{isAdmin: req.user.isAdmin, users_data : users});
    }
    catch{
        res.status(503);
    }    
}

exports.delete_by_id = async(req,res) => {
    if(isNaN(req.params.id)){
        res.redirect("/profile");
    }
    else{
        try{
            await profile_model.delete_profile(req.params.id);
            res.redirect("/profile/gestion");
        }
        catch{
            res.status(503);
        }
    }
}