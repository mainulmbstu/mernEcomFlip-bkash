const mongoose = require("mongoose");


// const URI = process.env.MONGO_LOCAL
const URI = process.env.MONGO_ATLAS

const dbcon = async () => {
    try {
       let conn= await mongoose.connect(URI)
        console.log(`MongoDB connected to ${conn.connection.host}`);
    } catch (error) {
        console.log(({ msg: "db, mongo error", error }))
    }
}


module.exports = dbcon