const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const closeContactSchema = new mongoose.Schema({
    empId: {
        type: String,
        uppercase: true,
        index: true
    },
    target: {
        type: String,
        lowercase: true
    }
}, { collection: 'close_contacts', timestamps: true });

closeContactSchema.plugin(uniqueValidator);
module.exports = mongoose.model('CloseContact', closeContactSchema);