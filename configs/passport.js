const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('~/models/user');
const secret = process.env.SECRET;

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(async (id, done) => {
        User.findUserById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(
        new Strategy({ 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
            secretOrKey: secret 
        }, (payload, done) => {
            User.findById(payload._id).then((user) => {
                if (user && !user.deleted_at) {
                    return done(null, user);
                }
                return done(null, false);
            }).catch(() => done(null, false));
        })
    );
};

