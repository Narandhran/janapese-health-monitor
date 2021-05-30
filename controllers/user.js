const User = require('../models/user');
const { validate } = require('../utils/crypto');
const { sign } = require('../utils/jwt');
const { countryCode } = require('../utils/constant');
const { errorHandler, successHandler } = require('../utils/handler');
module.exports = {
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
    login: async (req, res) => {
        console.log('helllo')
        let { email, password } = req.body;
        let isUser = await User.findOne({ email }).lean();
        if (isUser && validate(password, isUser.password)) {
            successHandler(req, res, 'Login success', sign({ empId: isUser.empId, emai: isUser.email, _id: isUser._id, role: isUser.role }));
        } else errorHandler(req, res, new Error('User not exist!!'));
    }
}