const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const qaUserSchema = new mongoose.Schema({
    empId: {
        type: String,
        uppercase: true,
        required: true
    },
    data: [{
        question: {
            type: String,
            lowercase: true,
            required: true
        },
        type: {
            type: String,
            enum: ['radio', 'checkbox', 'text', 'dropdown'],
            lowercase: true
        },
        options: {
            type: [String],
            default: [],
            required: true
        },
        answer: {
            type: String
        }
    }],

}, { collection: 'qa_users', timestamps: true });

qaUserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('QaUserSchema', qaUserSchema);