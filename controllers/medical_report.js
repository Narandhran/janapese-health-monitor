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
        persisted.date = Date.now();
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
        let access = req.verifiedToken.access;
        let matchQuery = {
            $or: [
                { bodyTemperature: { $gt: 37.4 } },
                { antigen: { $in: ['陽性', '擬陽性'] } },
                {
                    'qa.question': '1 状態（必須）',
                    'qa.answer': {
                        '$in': [
                            '病状らしき事象あり', '体調不良（自宅療養）', '体調不良（病院通院）'
                        ]
                    }
                }
            ]
        };

        matchQuery.department = { $ne: 'ALL' };
        if (access.length > 0 && access[0] != 'ALL')
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
                    uuid: { $first: '$uuid' },
                    date: { $first: '$createdAt' },
                    department: { $first: '$department' },
                    antigen: { $first: '$antigen' },
                    bodyTemperature: { $first: '$bodyTemperature' },
                    qa: { $first: '$qa' },
                    antigenImg: { $first: '$antigenImg' },
                    bodyTemperatureImg: { $first: '$bodyTemperatureImg' }
                }
            },
            {
                $project: {
                    _id: 0,
                    empId: '$_id',
                    name: 1,
                    uuid: 1,
                    date: 1,
                    department: 1,
                    antigen: 1,
                    bodyTemperature: 1,
                    qa: 1,
                    bodyTemperatureImg: 1,
                    antigenImg: 1
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
        let { filter = 'register' } = req.params;
        let matchQuery = {};
        let department = req.verifiedToken.access;
        if (department.length > 0 && department[0] != 'ALL')
            matchQuery = { department: { $in: department }, createdAt: { $gt: new Date(moment().format('YYYY-MM-DD').toString() + 'T00: 00: 00Z') } };
        if (filter == 'unregister')
            matchQuery.createdAt = { $lt: new Date(moment().format('YYYY-MM-DD').toString() + 'T00: 00: 00Z') };

        await MedicalReport.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { empId: 1, createdAt: -1 }
            },
            {
                $group: {
                    _id: '$empId',
                    name: { $first: '$name' },
                    uuid: { $first: '$uuid' },
                    date: { $first: '$createdAt' },
                    department: { $first: '$department' },
                    antigen: { $first: '$antigen' },
                    bodyTemperature: { $first: '$bodyTemperature' },
                    qa: { $first: '$qa' },
                    antigenImg: { $first: '$antigenImg' },
                    bodyTemperatureImg: { $first: '$bodyTemperatureImg' }
                }
            },
            {
                $project: {
                    _id: 0,
                    empId: '$_id',
                    name: 1,
                    uuid: 1,
                    date: 1,
                    department: 1,
                    antigen: 1,
                    bodyTemperature: 1,
                    qa: 1,
                    bodyTemperatureImg: 1,
                    antigenImg: 1
                }
            },
            {
                $sort: { empId: 1 }
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
        let { name, empId, department, sDate, tDate } = req.body;
        let filterQuery = {};
        if (!name && !empId && !department && (sDate == tDate))
            filterQuery.createdAt = { $gte: new Date(sDate + 'T00:00:00Z'), $lt: new Date(tDate + 'T23:59:00Z') };
        else {
            if (name) filterQuery.name = name.toLowerCase();
            if (empId) filterQuery.empId = empId.toUpperCase();
            if (department) filterQuery.department = department.toUpperCase();
            if (sDate != tDate) filterQuery.createdAt = { $gte: new Date(sDate), $lte: new Date(tDate).setDate(new Date(tDate).getDate() + 1) };
            else filterQuery.createdAt = { $gte: new Date(sDate + 'T00:00:00Z'), $lte: new Date(tDate + 'T23:59:00Z') };
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
        let days = week * 7;
        let sDate = moment().utcOffset(0);
        sDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        let sQuery = {
            $gt: sDate.subtract(days, 'days'),
            $lte: new Date(moment().format('YYYY-MM-DD').toString() + 'T23:59:00Z')
        };

        if (week > 1) {
            sQuery$gt: sDate.subtract(days, 'days');
            sQuery.$lte = sDate.subtract(((days / 7) - 1) * 7, 'days')
        }
        await MedicalReport
            .find({
                empId: req.verifiedToken.empId,
                createdAt: { $gt: sQuery.$gt, $lte: sQuery.$lte }
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