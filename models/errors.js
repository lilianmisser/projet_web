const Errors = {
    DB_UNAVALAIBLE : new Error("Internal Server Error"),
    NO_MOVIE_CORRESPONDANCE : new Error("This movie doesnt exist"),
    MOVIE_NAME_TAKEN : new Error("The movie name was already taken"),
    USERNAME_ALREADY_EXISTS : new Error("This username already exists, please change"),
    MAIL_ALREADY_EXISTS : new Error("This mail already exists, please change"),
    NO_USER_CORRESPONDANCE : new Error("This username doesn't have an account"),
    WRONG_PASS : new Error("Wrong password"),
    NO_MOVIE_GENRE : new Error("There are no movies for this genre, we're sorry"),
    GENRE_NAME_ALREADY_EXISTS : new Error("This genre already exists !"),
    WRONG_GENRE_NAME : new Error("Please select a valid genre."),
    GENRE_NAME_UNKNOWN : new Error("This genre name is not in our database.")
}

module.exports = Errors;