const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const departmentSchema = new mongoose.Schema({
    jDepartment: {
        type: String,
        lowercase: true
    },
    eDepartment: {
        type: String,
        lowercase: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, { collection: 'departments', timestamps: true });

departmentSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Department', departmentSchema);
