const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const qaSchema = new mongoose.Schema({
    question: {
        type: String,
        lowercase: true,
        required: true
    },
    type: {
        type: String,
        enum: ['radio','checkbox','text','dropdown'],
        lowercase: true
    },
    options: {
        type: [String],
        default: [],
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
}, { collection: 'qas', timestamps: true });

qaSchema.plugin(uniqueValidator);
module.exports = mongoose.model('QaSchema', qaSchema);