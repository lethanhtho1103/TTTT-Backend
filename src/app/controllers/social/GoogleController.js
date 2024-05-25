const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const googleAuth = require("../../../services/authDal");
let userProfile;
const configLoginWithGoogle = async () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_REDIRECT_LOGIN,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Checking google: ", profile);
        userProfile = profile;
        const { failure, success } = await googleAuth.registerWithGoogle(
          userProfile
        );
        if (failure) {
          console.log("Google user already exist in DB..", failure);
          return failure;
        } else {
          console.log("Registering new Google user..", success);
          return success;
        }
      }
    )
  );
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
};

module.exports = configLoginWithGoogle;
