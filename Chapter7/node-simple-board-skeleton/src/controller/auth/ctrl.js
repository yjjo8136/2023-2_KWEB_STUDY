const { UserDAO } = require("../../DAO");
const { verifyPassword, generatePassword } = require("../../lib/authentication");


const signInForm = async (req, res, next) => {
    try {
        const {user} = req.session;
        if (user == undefined){ 
            return res.render("auth/sign-in.pug", {user});
        } else {
            return res.redirect("/");
        }
    } catch (err) {
        return next(err);
    }
};
    

const signIn = async (req, res, next) => {
    try {
        const {username, password} = req.body;

        if (!username || !password) throw new Error("BAD_REQUEST");

        const user = await UserDAO.getByUsername(username);
        if(!user) throw new Error("Unauthorized");
        const isTrue = await verifyPassword(password, user.password);
        if (!isTrue) throw new Error("Unauthorized");

        req.session.user = {
            id: user.id,
            username: username,
            displayName: user.displayName,
            isActive: user.isActive,
            isStaff: user.isStaff,
        };

        return res.redirect("/");

    } catch (err) {
        return next(err);
    }
};
    
const signUpForm = async (req, res, next) => {
    try {
        const {user} = req.session; 
        return res.render("auth/sign-up.pug", {user});
    } catch (err) {
        return next(err);
    }
};


const signUp = async (req, res, next) => {
    try {
        const {username, password, displayName} = req.body;

        if (!username || !password || !displayName) throw new Error("BAD_REQUEST");
        if (username.length > 16 || displayName > 32) throw new Error("BAD_REQUEST");

        const hashedPW = await generatePassword(password);
        await UserDAO.create(username, hashedPW, displayName);

        return res.redirect("/auth/sign_in");

    } catch (err) {
        return next(err);
    }
};

const signOut = async (req, res, next) => {
    try{
        req.session.destroy((err) => {
            if (err) throw err;
            else return res.redirect("/");
        });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    signInForm,
    signIn,
    signUpForm,
    signUp,
    signOut
}