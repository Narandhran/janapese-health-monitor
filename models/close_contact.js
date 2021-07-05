const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const closeContactSchema = new mongoose.Schema({
    source: {
        type: String,
        lowercase: true
    },
    target: {
        type: String,
        lowercase: true
    }
}, { collection: 'close_contacts', timestamps: true });

closeContactSchema.plugin(uniqueValidator);
module.exports = mongoose.model('CloseContact', closeContactSchema);