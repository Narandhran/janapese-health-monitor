const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const medicalReportSchema = new mongoose.Schema({
    empId: {
        type: String,
        uppercase: true,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        lowercase: true,
        required: true

    },
    // infectionLevel: {
    //     type: String,
    //     enum: ['High', 'Low', 'Moderate'],
    //     required:  true
    // },
    antigen: {
        type: String,
        enum: ['Positive', 'Negative', 'Not detected'],
        required: true
    },
    // infectionRisk: {
    //     type: Boolean,
    //     default: false,
    //     required:  true
    // },
    bodyTemperature: {
        type: Number,
        required: true
    },
    antigenImg: {
        type: String
    },
    bodyTemperatureImg: {
        type: String
    },
    qa: {
        type: [{}],
        default: []
    }
}, { collection: 'medical_report', timestamps: true });

medicalReportSchema.plugin(uniqueValidator);
module.exports = mongoose.model('MedicalReport', medicalReportSchema);