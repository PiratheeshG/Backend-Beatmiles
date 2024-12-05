// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user');

module.exports = function(passport) {
    // Serialize and Deserialize User
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
  
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });

    // Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
                return done(null, existingUser);
            }
            const newUser = new User({
                googleId: profile.id,
                email: profile.emails[0].value
            });
            await newUser.save();
            done(null, newUser);
        } catch (err) {
            done(err, null);
        }
    }));

    // Facebook Strategy
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'emails', 'name']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await User.findOne({ facebookId: profile.id });
            if (existingUser) {
                return done(null, existingUser);
            }
            const email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;
            const newUser = new User({
                facebookId: profile.id,
                email: email
            });
            await newUser.save();
            done(null, newUser);
        } catch (err) {
            done(err, null);
        }
    }));

    // GitHub Strategy
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await User.findOne({ githubId: profile.id });
            if (existingUser) {
                return done(null, existingUser);
            }
            const email = profile.emails ? profile.emails[0].value : `${profile.username}@github.com`;
            const newUser = new User({
                githubId: profile.id,
                email: email
            });
            await newUser.save();
            done(null, newUser);
        } catch (err) {
            done(err, null);
        }
    }));
};
