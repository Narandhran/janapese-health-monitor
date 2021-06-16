/**
 * @author - itsNaren
 * @description - 
 * @date - 2021-05-31 12:19:59
**/
const MedicalReport = require('../models/medical_report');
const User = require('../models/user');
const { toJapanese } = require('../utils/constant');
const { errorHandler, successHandler } = require('../utils/handler');
const moment = require('moment');
const { loadMulterS3 } = require('../utils/multers3');

module.exports = {
    /**
     * Web edit report
     */
    editReport: async (req, res) => {
        await MedicalReport
            .findByIdAndUpdate(req.params._id, req.body, { new: true })
            .exec(async (err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    let user = await User.findOne({ empId: data.empId });
                    if (!(data.infectionRisk == user.isInfected)) {
                        user.isInfected = data.infectionRisk;
                        await user.save();
                    }
                    successHandler(req, res, toJapanese['Data updated successfully'], data);
                }
            });
    },
    /**
     * Mobile add data on every day
     */
    addReport: async (req, res) => {
        let persisted = req.body;
        persisted.uuid = req.verifiedToken.uuid;
        await MedicalReport
            .create(persisted, (err, data) => {
                if (err) errorHandler(req, res, err);
                else successHandler(req, res, toJapanese['Data created successfully'], { success: true });
            });
    },
    /**
     * Web View infected people 
     */
    infectedPeople: async (req, res) => {
        let matchQuery = {
            $or: [
                { bodyTemperature: { $gt: 37 } },
                { antigen: 'Positive' },
                { 'data.ques': 'Infection risk transfer', 'data.answer': 'no' }
            ]
        };
        let department = req.verifiedToken.access;
        if (department.length > 0 && department[0] != 'ALL')
            matchQuery.department = { $in: department };
        await MedicalReport.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { empId: -1, createdAt: -1 }
            },
            {
                $group: {
                    _id: '$empId',
                    name: { $first: '$name' },
                    date: { $last: '$date' },
                    department: { $first: '$department' },
                    antigen: { $first: '$antigen' },
                    bodyTemperature: { $first: '$bodyTemperature' },
                    qa: { $first: '$qa' }
                }
            },
            {
                $project: {
                    _id: 0,
                    empId: '$_id',
                    name: 1,
                    date: 1,
                    department: 1,
                    antigen: 1,
                    bodyTemperature: 1,
                    qa: 1
                }
            },
            {
                $sort: { date: -1 }
            }
        ]).exec((err, data) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, toJapanese['Data listed successfully'], data);
        });
    },
    /**
     * Web view all 
     */
    listAllReport: async (req, res) => {
        let matchQuery = {};
        let department = req.verifiedToken.access;
        if (department.length > 0 && department[0] != 'ALL')
            matchQuery = { department: { $in: department } }

        await MedicalReport.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { empId: -1, createdAt: -1 }
            },
            {
                $group: {
                    _id: '$empId',
                    name: { $first: '$name' },
                    date: { $last: '$date' },
                    department: { $first: '$department' },
                    antigen: { $first: '$antigen' },
                    bodyTemperature: { $first: '$bodyTemperature' },
                    qa: { $first: '$qa' }
                }
            },
            {
                $project: {
                    _id: 0,
                    empId: '$_id',
                    name: 1,
                    date: 1,
                    department: 1,
                    antigen: 1,
                    bodyTemperature: 1,
                    qa: 1
                }
            },
            {
                $sort: { date: -1 }
            }
        ]).exec((err, data) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, toJapanese['Data listed successfully'], data);
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
        await MedicalReport
            .find(filterQuery)
            .sort({ createdAt: -1 })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else successHandler(req, res, toJapanese['Data listed successfully'], data);
            });
    },
    getByUser: async (req, res) => {
        await MedicalReport
            .find({ empId: req.params.empId })
            .sort({ createdAt: -1 })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    if (data && data.length > 0)
                        successHandler(req, res, toJapanese['Data listed successfully'], data[0]);
                    else errorHandler(req, res, new Error(toJapanese['You have not input your data yet']));
                }
            });
    },
    getHistoryByUser: async (req, res) => {
        let { week = 1 } = req.params;
        week *= 7;
        let date = moment().utcOffset(0);
        date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        await MedicalReport
            .find({
                empId: req.verifiedToken.empId,
                createdAt: { $gt: date.subtract(week, 'days') }
            })
            .sort({ createdAt: -1 })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else
                    successHandler(req, res, toJapanese['Data listed successfully'], data);
            });
    },
    uploadTemperatureImg: async (req, res) => {
        let upload = loadMulterS3(10, 'temperature').single('temperature');
        await upload(req, null, (err) => {
            if (err)
                errorHandler(req, res, err);
            else {
                successHandler(req, res, toJapanese.Success, req.file.location);
            }
        });
    },
    uploadAntigenImg: async (req, res) => {
        let upload = loadMulterS3(10, 'antigen').single('antigen');
        await upload(req, null, (err) => {
            if (err)
                errorHandler(req, res, err);
            else {
                successHandler(req, res, toJapanese.Success, req.file.location);
            }
        });
    }
};