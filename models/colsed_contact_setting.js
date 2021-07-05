const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const closedContactSettingSchema = new mongoose.Schema({
    distance: {
        type: Number
    },
    timeDuration: {
        type: Number
    }
}, { collection: 'closed_contact_setting', timestamps: true });

closedContactSettingSchema.plugin(uniqueValidator);
module.exports = mongoose.model('ClosedContactSetting', closedContactSettingSchema);