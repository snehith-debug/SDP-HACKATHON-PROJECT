const User = require("./models/url");

function loggedIn(req,res,next){
    console.log(req.user);
    req.session.redirectUrl = req.originalUrl;
    if (!req.isAuthenticated()) {
        
        req.flash("error", "You must be logged in to access this page.");
        return res.redirect("/login");   
    }
    next();
};
    async function isOwner(req,res,next){
    const {id }= req.params;
        let listing = await User.findById(req.params.id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not permitted to access it ");
        return res.redirect(`/get/${id}`);
    }
    next();
    };

    async function isReviewAuthor(req,res,next){
        const {id }= req.params;
            let listing = await User.findById(req.params.id);
        if(!listing.owner.equals(res.locals.currUser._id)){
            const allListing = await User.find({});
            req.flash("error","you are not permitted to delete it ");
            return res.redirect(`/get/${id}`);
        }
        next();
        };
module.exports = {loggedIn,isOwner};

