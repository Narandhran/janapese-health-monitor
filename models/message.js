const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const messageSchema = new mongoose.Schema({
    empId: {
        type: String,
        uppercase: true,
        required: true
    },
    title: {
        type: String,
        uppercase: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        required: true,
        default: false
    },
    isForAll: {
        type: Boolean,
        default: false
    }
}, { collection: 'messages', timestamps: true });

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Message', messageSchema);