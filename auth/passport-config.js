const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Passport Local Strategy
passport.use(
    new LocalStrategy(async(username, password, done) => {
        try {
            const user = await User.findOne({username: username});
            if(!user) {
                return done(null, false, {message: "Incorrect username"});
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                return done(null, false, {message: "Incorrect password"})
            }
            return done(null, user);
        } catch(error) {
            return done(error)
        };
    })
);

// Serialise user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialise user
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
});

module.exports = passport;