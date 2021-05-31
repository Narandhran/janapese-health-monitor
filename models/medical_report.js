const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const medicalReportSchema = new mongoose.Schema({
    empId: {
        type: String,
        uppercase: true
    },
    name: {
        type: String
    },
    date: {
        type: String
    },
    department: {
        type: String,
        lowercase: true
    },
    infectionLevel: {
        type: String,
        enum: ['high', 'low', 'moderate']
    },
    antigen: {
        type: String,
        enum: ['Positive', 'Negative']
    },
    infectionRisk: {
        type: Boolean,
        default: false
    },
    bodyTemperature: {
        type: String
    }
}, { collection: 'medical_report', timestamps: true });

medicalReportSchema.plugin(uniqueValidator);
module.exports = mongoose.model('MedicalReport', medicalReportSchema);