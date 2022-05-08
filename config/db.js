const mongoose = require("mongoose")

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        })
        console.log(`Mongodb Connected ${conn.connection.host}`)
    }catch(err){
        console.log(err)
        process.exit()
    }
}

module.exports = connectDB