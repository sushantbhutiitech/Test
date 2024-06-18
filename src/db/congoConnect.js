const mongoose = require("mongoose");
const ENV = require("../config/index");
console.log("env",ENV)

const connectDB = async () => {
  mongoose.set("strictQuery", false);

  const conn = await mongoose.connect(ENV.dbUrl, {
    useNewUrlParser: true,
  });
  console.log("mongodb Connected")
};

module.exports = connectDB;
