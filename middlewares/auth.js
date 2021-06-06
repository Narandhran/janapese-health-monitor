const { verify } = require('../utils/jwt');
const { successHandler, errorHandler } = require('../utils/handler');
const User = require('../models/user');
module.exports = {
    authenticate: (req, res, next) => {
        if (!req.headers.authorization)
        errorHandler(req, res, new Error('No token found'));
        else {
            try {
                req.verifiedToken = verify(req.headers.authorization);
                next();
            } catch (err) {
                errorHandler(req, res, err);
            }
        }
    },

    authorize: (roles = []) => {
        if (typeof roles === 'string')
            roles = [roles];
        return [
            async (req, res, next) => {
                let token = req.verifiedToken;
                let isUserBlocked = await User.findById(token._id).lean();
                if (!isUserBlocked.status) {
                    errorHandler(req, res, new Error('Your account is blocked, contact admin!.'));
                }
                else if (!roles.some(r => token.role.indexOf(r) >= 0))
                errorHandler(req, res, new Error('Unauthorized, Access denied.'));
                else
                    next();
            }
        ];
    }
};