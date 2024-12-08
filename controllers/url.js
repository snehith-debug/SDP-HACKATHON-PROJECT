const listings = require("../models/url");
const Review = require("../models/review");
async function handleHome(req,res){
    // res.send("hello");
    // const allListing = await listings.find({});
    // console.dir(req.cookies);
    // res.render("../views/listings/index.ejs",{allListing});
    res.render('listings/landing');
};
async function handleIndex(req,res){
    const allListing = await listings.find({});
    console.dir(req.cookies);
    res.render("../views/listings/index.ejs",{allListing});
    // res.render('listings/landing');
};
async function handleNewPage(req,res){
    res.render("../views/listings/new.ejs");
};
async function handleGetSeparateDetails(req,res){
        const UserList= await listings.findById(req.params.id).populate("reviews");
        console.log(UserList);
    res.render("../views/listings/get.ejs",{UserList});
};
async function handleLoginPage(req,res){
    req.flash("success","Welcome to wanderLust, you are logged in");
    res.redirect("/");
};
async function handleNewPost(req,res){
    res.render("../views/listings/new.ejs");
};
async function handlePost(req,res,next){
    try{
        const {title,description,story} = req.body;
        const owner = req.user._id;
    await listings.create({
        title,description,story,owner,
    });
    
    const allListing = await listings.find({});
    req.flash("success","New Listing created!");
    return res.render("../views/listings/index.ejs",{allListing});
    } catch(err) {
        next(err);
    }
};
async function handleEditGetPage(req,res){
    const UserList= await listings.findById(req.params.id);
    res.render("../views/listings/edit.ejs",{UserList});
};
async function handleEditPutPage(req,res){
    // const url = req.file.path;
    //     const filename = req.file.filename;
    const {id }= req.params;
    const {title,description,story} = req.body;
    await listings.findByIdAndUpdate(id,
        {
            title:title,
            description:description,
            story:story,
        },
        );

    const allListing = await listings.find({});
    return res.render("../views/listings/index.ejs",{allListing});
    //res.redirect(`/get/${id}`);
};
async function handleDeleteRoute(req,res){
    await listings.findByIdAndDelete(req.params.id);
    res.redirect("/");
};
async function handleLogout(req,res,next){
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Successfully LoggedOut");
        res.redirect("/");
    });
};
async function handleReviewPost(req,res){
        let user =  await listings.findById(req.params.id);
    let {rating,comment} = req.body;
    const newReview = new Review({ rating,comment });
    newReview.author = req.user._id;
    console.log(newReview);
    user.reviews.push(newReview);
    await newReview.save();
    await user.save();
    res.redirect(`/get/${user._id}`); 
};
module.exports = {
    handleHome,handleLoginPage,
    handleNewPage,handleLogout,
    handleGetSeparateDetails,
    handleNewPost,handlePost,
    handleEditGetPage,handleEditPutPage,
    handleDeleteRoute,handleReviewPost,
    handleIndex,
};



















// async function handleProject(req,res){
//     await User.create({
//         title:"myVilla",
//         description:"i am strong",
//         image:"",
//         price:100000,
//         location:"vijayawada",
//         country:"india",
//     });
//     console.log("sample was saved");
//     res.send("Successful testing");
// };



