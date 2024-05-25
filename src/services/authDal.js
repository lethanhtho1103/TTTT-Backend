const User = require("../app/models/User");

const googleAuthDal = {
  registerWithGoogle: async (oauthUser) => {
    const isUserExists = await User.findOne({
      email: oauthUser.emails[0].value,
      type: "GOOGLE",
    });
    if (isUserExists) {
      const failure = {
        status: 400,
        message: "User already Registered.",
      };
      return { failure };
    }
    const user = new User({
      username: oauthUser.displayName,
      email:
        oauthUser.emails && oauthUser.emails.length > 0
          ? oauthUser.emails[0].value
          : oauthUser.id,
      avatar:
        oauthUser.photos && oauthUser.emails.length > 0
          ? oauthUser.photos[0].value
          : "",
      type: "GOOGLE",
    });
    const newUser = await user.save();
    const success = {
      status: 200,
      message: "User Registered.",
      data: newUser,
    };
    return { success };
  },

  registerWithFacebook: async (oauthUser) => {
    const isUserExists = await User.findOne({
      email: oauthUser.emails[0].value,
      type: "FACEBOOK",
    });
    if (isUserExists) {
      const failure = {
        status: 400,
        message: "User already Registered.",
      };
      return { failure };
    }
    const user = new User({
      username: oauthUser.displayName,
      email:
        oauthUser?.emails && oauthUser.emails.length > 0
          ? oauthUser.emails[0].value
          : oauthUser.id,
      avatar:
        oauthUser.photos && oauthUser.emails.length > 0
          ? oauthUser.photos[0].value
          : "",
      type: "FACEBOOK",
    });
    const newUser = await user.save();
    const success = {
      status: 200,
      message: "User Registered.",
      data: newUser,
    };
    return { success };
  },

  // loginUser: async (oauthUser) => {
  //   const userExists = await User.findOne({ email: oauthUser.emails[0].value });
  //   if (userExists) {
  //     const success = {
  //       message: 'User successfully logged In.',
  //     };
  //     return { success };
  //   }
  //   const failure = {
  //     message: 'Email not Registered. You need to sign up first',
  //   };
  //   return { failure };
  // },
};

module.exports = googleAuthDal;
