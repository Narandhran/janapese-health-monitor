const mongoose = require('mongoose');
const { hashSync, genSaltSync } = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    empId: {
        type: String,
        index: true,
        required: true,
        unique: true,
        uppercase: true
    },
    role: {
        type: String,
        default: 'USER',
        uppercase: true
    },
    access: {
        type: [String],
        default: ['ALL']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'others']
    },
    dp: {
        type: String,
        required: false,
        default: null
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return pattern.test(value);
            },
            message: '{VALUE} is not a valid email'
        },
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        set: encrypt
    },
    fcmToken: { type: String },
    countryCode: { type: String, minlength: 2, maxlength: 3 },
    mobile: { type: String, unique: true },
    verify: {
        otp: { type: Number },
        expire: { type: Date }
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    },
    department: {
        type: String,
        uppercase: true
    },
    uuid: {
        type: String,
        index: true,
        unique: true
    },
    isInfected: {
        type: Boolean,
        default: false
    },
    schedule: {
        type: [String]
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
}, { collection: 'users', timestamps: true });

function encrypt(password) {
    return hashSync(password, genSaltSync(10));
}

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);