/**
 * @author - itsNaren
 * @description - User controller file
 * @date - 2021-05-30 21:25:45
**/
const User = require('../models/user');
const { validate } = require('../utils/crypto');
const { sign } = require('../utils/jwt');
const { countryCode, initAdmin } = require('../utils/constant');
const { errorHandler, successHandler } = require('../utils/handler');
module.exports = {
    /**
     * For initialization purpose only
     */
    initUser: async () => {
        let isAdmin = await User.findOne({ name: initAdmin.name }).lean();
        if (!isAdmin) {
            User.create(initAdmin, (err, data) => {
                if (err) console.log('error');
            });
        }
    },
    /**
     * Web Registration
     */
    register: async (req, res) => {
        let userObj = req.body;
        let uuid = `${userObj.mobile}${userObj.countryCode || countryCode}`;
        while (uuid.length < 32) {
            uuid += '0';
        }
        await User.create({ ...userObj, uuid }, (err, data) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'Success', data);
        });
    },
    /**
     * Web Login
     */
    login: async (req, res) => {
        console.log('helllo')
        let { email, password } = req.body;
        let isUser = await User.findOne({ email }).lean();
        if (isUser && validate(password, isUser.password)) {
            successHandler(req, res, 'Login success', sign({ empId: isUser.empId, emai: isUser.email, _id: isUser._id, role: isUser.role }));
        } else errorHandler(req, res, new Error('User not exist!!'));
    }
}