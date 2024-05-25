const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const facebookAuth = require("../../../services/authDal");

let userProfile;
const configLoginWithFacebook = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_APP_REDIRECT_LOGIN,
        profileFields: ["id", "emails", "name", "displayName"], // Các trường profile bạn muốn lấy từ Facebook
      },
      async (accessToken, refreshToken, profile, cb) => {
        console.log("Checking Facebook: ", profile);
        userProfile = profile;
        const { failure, success } = await facebookAuth.registerWithFacebook(
          userProfile
        );
        if (failure) {
          console.log("Facebook user already exist in DB..", failure);
          return failure;
        } else {
          console.log("Registering new Facebook user..", success);
          return success;
        }
      }
    )
  );

  // Serialize user to store in session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
};

module.exports = configLoginWithFacebook;
