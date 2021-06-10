const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const masterDataSchema = new mongoose.Schema({
    closedContactSetting: {
        distance: {
            type: Number
        },
        timeDuration: {
            type: Number
        }
    }
}, { collection: 'master_data', timestamps: true });

masterDataSchema.plugin(uniqueValidator);
module.exports = mongoose.model('MasterData', masterDataSchema);