const config=require("dotenv").config()


module.exports.productionEnv={
    port:5000,
    dbUrl:process.env.MONGO_URL_PRODUCTION
}