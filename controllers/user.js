/**
 * @author - itsNaren
 * @description - User controller file
 * @date - 2021-05-30 21:25:45
**/
const User = require('../models/user');
const { validate } = require('../utils/crypto');
const { sign } = require('../utils/jwt');
const { initAdmin, verifyOTP } = require('../utils/constant');
const XL2JSON = require('../utils/excel2json');
const { loadMulter } = require('../utils/multer');
const GENERATOR = require('../utils/string_generator');
const { sendMail } = require('../utils/mailer');
const { errorHandler, successHandler } = require('../utils/handler');



module.exports = {
    /**
     * For initialization purpose only
     */
    initUser: async () => {
        let isAdmin = await User.findOne({ name: initAdmin.name }).lean();
        if (!isAdmin) {
            User.create({ ...initAdmin, uuid: GENERATOR.generateUUID('OW001') }, (err, data) => {
                if (err) console.log('error');
            });
        }
    },
    /**
     * Web import users
     */
    importUsers: async (req, res) => {
        let upload = loadMulter(20).single('users-file');
        await upload(req, null, async (err) => {
            if (err) {
                errorHandler(req, res, err);
            }
            else {
                let persisted = await XL2JSON.convert(req.file.filename);
                let users = persisted.Sheet1;
                let dataError = false;
                if (users && users.length > 0) {
                    users.map((e, i) => {
                        if (e.email == '' || e.email == undefined || e.email == null
                            || e.empId == '' || e.empId == undefined || e.empId == null)
                            dataError = true;
                        if (e.access)
                            e.access = ((e.access).toUpperCase()).split(',');
                        e.role = e.role ? (e.role).toUpperCase() : 'USER';
                        e.email = (e.email).toLowerCase();
                    });
                    if (dataError) errorHandler(req, res, new Error('Employee number and Email should\'t be empty, check the excel sheet properly.'));
                    else {
                        await User.insertMany(users, (err, data) => {
                            if (err) errorHandler(req, res, err);
                            successHandler(req, res, 'Users imported successfully!', {});
                        });
                    }
                }
                else errorHandler(req, res, new Error('Data is either empty or not valid'));
            }
        });
    },
    /**
     * Web Registration
     */
    register: async (req, res) => {
        let userObj = req.body;
        userObj.uuid = GENERATOR.generateUUID((userObj.empId).toUpperCase());
        await User.create(userObj, (err, data) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'Success', data);
        });
    },
    /**
     * Web Login
     */
    login: async (req, res) => {
        let { email, password } = req.body;
        let isUser = await User.findOne({ email }).lean();
        if (isUser) {
            if (validate(password, isUser.password)) {
                let payload = {
                    empId: isUser.empId,
                    _id: isUser._id,
                    role: isUser.role,
                    access: isUser.role.toLowerCase() == 'admin' ? isUser.access : ['none']
                };
                successHandler(req, res, 'Login success', {
                    token: sign(payload),
                    name: isUser.name,
                    email: isUser.email,
                    uuid: isUser.uuid,
                    department: isUser.department,
                    registrationDate: isUser.registrationDate,
                    schedule: isUser.schedule,
                    gender: isUser.gender,
                    role: isUser.role
                });
            }
            else errorHandler(req, res, new Error('Incorrect password, try again!'))
        } else errorHandler(req, res, new Error('User not exist!!'));
    },
    /**
     * Web dashboard
     */
    dashboard: async (req, res) => {
        let total = 0, registered = 0, infected = 0, unregistered = 0;
        let access = req.verifiedToken.access;
        let subQuery = { 'department': { $ne: 'ALL' } };
        if (access.length > 0 && access[0] != 'ALL') {
            subQuery = { 'department': { $in: access } };
        }
        await User.find(subQuery, (err, data) => {
            if (err) errorHandler(req, res, err);
            else {
                data.forEach((user, index) => {
                    total += 1;
                    if (user.status) registered += 1;
                    else unregistered += 1;
                    if (user.isInfected) infected += 1;
                });
            }
            successHandler(req, res, 'Success', { total, registered, infected, unregistered });
        });
    },
    /**
     * Web add employee
     */
    addEmployee: async (req, res) => {
        let userObj = req.body;
        userObj.uuid = GENERATOR.generateUUID(userObj.empId);
        await User.create(userObj, (err, data) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'User added successfully!!', { success: true });
        })
    },
    /**
     * Mobile register
     */
    mRegister: async (req, res) => {
        let { email, otp } = req.body;
        let user = await User.findOne({ email: email });
        let isVerified = verifyOTP(otp, user.verify);
        if (isVerified) {
            user.status = true;
            await user.save();
            successHandler(req, res, 'Success', { verified: true });
        }
        else errorHandler(req, res, new Error('Invalid OTP, try again!'));
    },
    /**
     * Mobile login
     */
    mLogin: async (req, res) => {
        let { fcmToken = null, email, password } = req.body;
        let isUser = await User.findOne({ email }).lean();
        if (isUser) {
            if (!isUser.status) errorHandler(req, res, new Error('Email not verified yet!!'));
            else if (validate(password, isUser.password)) {
                if (fcmToken) {
                    isUser.fcmToken = fcmToken;
                    await isUser.save();
                }
                let payload = {
                    empId: isUser.empId,
                    _id: isUser._id,
                    role: isUser.role,
                    access: isUser.role.toLowerCase() == 'admin' ? isUser.access : ['none']
                };
                successHandler(req, res, 'Login success', {
                    token: sign(payload),
                    name: isUser.name,
                    email: isUser.email,
                    uuid: isUser.uuid,
                    department: isUser.department,
                    registrationDate: isUser.registrationDate,
                    schedule: isUser.schedule,
                    gender: isUser.gender,
                    role: isUser.role
                });
            } else errorHandler(req, res, new Error('Incorrect password, try again!'));
        } else errorHandler(req, res, new Error('User not exist!!'));
    },
    /**
     * Request OTP
     */
    requestOTP: async (req, res) => {
        let isUser = await User.findOne({ email: req.body.email });
        if (!isUser) errorHandler(req, res, new Error('User is not exist, kindly ask admin!!'));
        else {
            let otp = GENERATOR.generateOTP();
            sendMail(req, res,
                {
                    to: isUser.email,
                    subject: 'Request to verify your account',
                },
                {
                    fullname: isUser.name,
                    otp: otp,
                    message: 'verify your account'
                }
                , 'otp-template.html'
            ).then(async () => {
                isUser.verify = { otp: otp };
                await isUser.save();
                successHandler(req, res, 'OTP sent successfully', { success: true })
            }).catch(e => errorHandler(req, res, e));
        }
    },
    /**
     * Reset password
     */
    resetPassword: async (req, res) => {
        let { email, otp, password } = req.body;
        let isUser = await User.findOne({ email });
        if (!isUser) errorHandler(req, res, new Error('Something went wrong!!'));
        else if (verifyOTP(otp, isUser.verify)) {
            isUser.password = password;
            await isUser.save();
            successHandler(req, res, 'Password updated successfully!', { success: true });
        }
        else errorHandler(req, res, new Error('Invalid OTP, try again!'));
    },
    /**
     * Verify account
     */
    verifyAccount: async (req, res) => {
        let { email, otp } = req.body;
        let isUser = await User.findOne({ email });
        if (!isUser) errorHandler(req, res, new Error('Something went wrong!!'));
        else {
            if (isUser.verify.otp == otp) {
                isUser.status = true;
                await isUser.save();
                successHandler(req, res, 'OTP verified successfully', { success: true });
            }
            else errorHandler(req, res, new Error('Invalid OTP, try again!'));
        }
    }
}