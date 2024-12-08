const mongoose = require("mongoose");
const Review = require("./review.js");
const UserData = require("./user.js");

const UserSchema = mongoose.Schema({
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        story:{
            type:String,
            required:true,
        },
        reviews:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"review",
        },
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserData"
    }
});
const listings = mongoose.model("people",UserSchema);

module.exports = listings;