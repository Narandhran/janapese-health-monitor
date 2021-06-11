/**
 * @author - itsNaren
 * @description - 
 * @date - 2021-05-31 12:19:59
**/
const MedicalReport = require('../models/medical_report');
const User = require('../models/user');
const { errorHandler, successHandler } = require('../utils/handler');

module.exports = {
    /**
     * Web edit report
     */
    editReport: async (req, res) => {
        await MedicalReport
            .findByIdAndUpdate(req.params._id, request.body, { new: true })
            .exec(async (err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    let user = await User.findOne({ empId: data.empId });
                    if (!(data.infectionRisk == user.isInfected)) {
                        user.isInfected = data.infectionRisk;
                        await user.save();
                    }
                    successHandler(req, res, 'Data updated successfully!', data);
                }
            })
    },
    addReport: async (req, res) => {
        await MedicalReport
            .create(req.body, (err, data) => {
                if (err) errorHandler(req, res, err);
                else successHandler(req, res, 'Data created successfully!', { success: true });
            });
    },
    infectedPeople: async (req, res) => {
        await MedicalReport
            .find({
                $or: [
                    { infectionRisk: true },
                    { bodyTemperature: { $gt: 37 } },
                    { antigen: 'Positive' },
                    { 'data.ques': 'Infection risk transfer', 'data.answer': 'no' }
                ]
            }).exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else successHandler(req, res, 'Data listed successfully!', data);
            });
    },
    listAllReport: async (req, res) => {
        await MedicalReport.find({}, (err, data) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'Data listed successfully!', data);
        });
    },
    /**
     * Report screen
     */
    filter: async (req, res) => {
        let { name = '', empId = '', department = '', sDate = '', tDate = '' } = req.body;
        let filterQuery = {
            $or: [
                { name }, { empId }, { department }, { date: { $gte: new Date(sDate).setHours(0, 0, 0, 0) }, date: { $lte: new Date(tDate).setHours(0, 0, 0, 0) } }
            ]
        }
        await MedicalReport.find(filterQuery, (err, data) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, 'Data listed successfully!', data);
        });
    },
    getByUser: async (req, res) => {
        await MedicalReport
            .find({ empId: req.params.empId }).sort({ createdAt: 1 })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    if (data && data.length > 0)
                        successHandler(req, res, 'Data listed successfully!', data[0]);
                    else errorHandler(req, res, new Error('You\'ve not input your data yet'));
                }
            });
    },
    getHistoryByUser: async (req, res) => {
        await MedicalReport
            .find({ empId: req.params.empId }).sort({ createdAt: 1 })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else
                    successHandler(req, res, 'Data listed successfully!', data);
            });
    }
};