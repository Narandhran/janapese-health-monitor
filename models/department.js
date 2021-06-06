const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const departmentSchema = new mongoose.Schema({
    department: {
        type: String,
        lowercase: true
    },
    status: {
        type: Boolean
    }
}, { collection: 'departments', timestamps: true });

departmentSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Department', departmentSchema);