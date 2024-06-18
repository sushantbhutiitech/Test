const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../models/user");

let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "bhumi_community",
};

passport.use(
  new JWTStrategy(opts, async function (jwtPayload, done) {
    try {
      const user = await User.findById(jwtPayload.sub);
      if (user) {
        return done(null, user);
      } 
    } catch (err) {
      console.error("Error in finding user from JWT:", err);
      return done(err, false);
    }
  })
);



module.exports = passport;
