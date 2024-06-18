const config=require("dotenv").config()

module.exports.developmentEnv={
    port:5000,
    dbUrl:process.env.MONGO_URL_DEVELOPMENT
}