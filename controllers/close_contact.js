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
                persisted.push({ source: req.verifiedToken.uuid, target: e });
                persisted.push({ source: e, target: req.verifiedToken.uuid });
            });
            await CloseContact.insertMany(persisted, (err, data) => {
                if (err) errorHandler(req, res, err);
                else successHandler(req, res, toJapanese['Data created successfully'], { success: true });
            });
        }

    },
    viewData: async (req, res) => {
        let { uuid } = req.params;
        await CloseContact.aggregate([
            {
                $match: {
                    createdAt: { $gt: moment(new Date).subtract(7, 'days').format('YYYY-MM-DD') },
                    source: uuid,
                    target: { $ne: '' }
                }
            },
            {
                $sort: {
                    target: 1,
                    createdAt: -1
                }
            },
            {
                $group: {
                    _id: { source: '$source', target: '$target' },
                    recentDate: {
                        $first: '$createdAt'
                    }
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id.target',
                    foreignField: 'uuid',
                    as: 'users'
                }
            },
            {
                $match: {
                    users: {
                        $gt: [{ $size: '$users' }, 0]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    source: '$_id.source',
                    target: '$_id.target',
                    recentDate: 1,
                    user: { $arrayElemAt: ["$users", 0] }
                }
            },
            {
                $project: {
                    source: 1,
                    target: 1,
                    recentDate: 1,
                    empId: '$user.empId',
                    department: '$user.department',
                    name: '$user.name'
                }
            }
        ]).then(ccList => {
            successHandler(req, res, toJapanese['Data listed successfully'], ccList);
        }).catch(e => errorHandler(req, res, e));

    },
    viewReport: async (req, res) => {
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
                }, {
                    '$replaceRoot': {
                        'newRoot': '$report'
                    }
                }
            ]).then(report => {
                successHandler(req, res, toJapanese['Data listed successfully'], report);
            }).catch(e => errorHandler(req, res, e));
    }
}