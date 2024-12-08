// const mongoose = require("mongoose");

// async function handleMongoConnect(url){
//     return mongoose.connect(url);
// };


// module.exports = {handleMongoConnect};

const mongoose = require("mongoose");

async function handleMongoConnect(url) {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);

        throw new Error("Failed to connect to MongoDB");
    }
}

module.exports = { handleMongoConnect };
