const passport = require('passport');

export default passport.authenticate('basic', { session: false });
