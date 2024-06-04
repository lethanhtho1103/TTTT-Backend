const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const googleAuth = require("../../../services/authDal");

const configLoginWithGoogle = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_REDIRECT_LOGIN,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Checking google: ", profile);
        const { failure, success } = await googleAuth.registerWithGoogle(
          profile
        );

        if (failure) {
          console.log("Google user already exists in DB..", failure);
          return done(failure, null);
        } else {
          const user = success;
          const token = jwt.sign(
            { userInfo: success.data },
            process.env.JWT_ACCESS_TOKEN,
            {
              expiresIn: "1h",
            }
          );

          user.token = token; // Attach token to the user object
          return done(null, user);
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
