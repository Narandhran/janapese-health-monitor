const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const qaSchema = new mongoose.Schema({
    question: {
        type: String,
        lowercase: true,
        unique: true
    },
    jQuestion: {
        type: String
    },
    type: {
        type: String,
        enum: ['radio', 'checkbox', 'text', 'dropdown'],
        lowercase: true
    },
    options: {
        type: [String],
        default: []
    },
    jOptions: {
        type: [String],
        default: []
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
}, { collection: 'qas', timestamps: true });

qaSchema.plugin(uniqueValidator);
module.exports = mongoose.model('QaSchema', qaSchema);