// eslint-disable-next-line @typescript-eslint/no-require-imports
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
module.exports = requireAuth;