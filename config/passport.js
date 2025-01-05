const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://oauthtodo.onrender.com/auth/google/page",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          console.log("yes it is getting executed");
          // Check if user exists in the database
          let user = await User.findOne({ email: profile.emails[0].value });
          console.log(user);

          if (!user) {
            // If not, create a new user
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              photoUrl: profile.photos[0].value,
              tasks: [],
            });
          }

          // Ensure the session is created

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("user in serialize function ", user);
    done(null, user.email);
  });

  passport.deserializeUser(async (email, done) => {
    try {
      const user = await User.findOne({ email });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
