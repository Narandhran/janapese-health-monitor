const CloseContact = require('../models/close_contact');
const MedicalReport = require('../models/medical_report');
const { toJapanese } = require('../utils/constant');
const moment = require('moment');
const { errorHandler, successHandler } = require('../utils/handler');

module.exports = {
    insertData: async (req, res) => {
        let { closedContacts = [] } = req.body;
        if (closedContacts.length > 0) {
            let persisted = [];
            closedContacts.forEach(e => {
                persisted.push({ empId: req.verifiedToken.empId, target: e });
            });
            await CloseContact.insertMany(persisted, (err, data) => {
                if (err) errorHandler(req, res, err);
                else successHandler(req, res, toJapanese['Data created successfully'], { success: true });
            });
        }

    },
    /*
    viewData: async (req, res) => {
        let date = moment().utcOffset(0);
        date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        try {
            let ccList = await CloseContact
                .find({
                    empId: req.params.empId,
                    createdAt: { $gt: date.subtract(14, 'days') }
                }).lean();
            let uuids = ccList.map(e => {
                return (e.target).toLowerCase();
            });
            await MedicalReport
                .find({ uuid: { $in: uuids } })
                .sort({ createdAt: -1 })
                .exec((err, data) => {
                    if (err) errorHandler(req, res, err);
                    else successHandler(req, res, toJapanese['Data listed successfully'], data);
                });

        } catch (error) {
            errorHandler(req, res, error);
        }
    }
    */

    viewData: async (req, res) => {
        await CloseContact
            .aggregate([
                {
                    '$match': {
                        'empId': req.params.empId
                    }
                }, {
                    '$group': {
                        '_id': '$target'
                    }
                }, {
                    '$lookup': {
                        'from': 'medical_report',
                        'localField': '_id',
                        'foreignField': 'uuid',
                        'as': 'report'
                    }
                }, {
                    '$match': {
                        'report': {
                            '$gt': [{ '$size': '$report' }, 0]
                        }
                    }
                }, {
                    '$project': {
                        '_id': 0,
                        'report': {
                            '$arrayElemAt': ['$report', -1]
                        }
                    }
                }
            ]).then(report => {
                successHandler(req, res, toJapanese['Data listed successfully'], report);
            }).catch(e => errorHandler(req, res, e));JSON.st
    }
}