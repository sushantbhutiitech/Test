const config=require("dotenv").config()
let env = process.env.NODE_ENV;
let ENV = null;
const { developmentEnv } = require("./env/development");
const { productionEnv } = require("./env/production");

if (env == "development") {
  ENV = developmentEnv;
} else if (env == "production") {
  ENV = productionEnv;
} else {
}

module.exports = ENV;