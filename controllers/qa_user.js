/**
 * @author - itsNaren
 * @description - QA with user mapping
 * @date - 2021-06-03 09:17:23
**/

const QAuser = require('../models/qa_user');
const { errorHandler, successHandler } = require('../utils/handler');

module.exports = {
    createOrUpdate: async (req, res) => {
        await QAuser.findOneAndUpdate({ empId: req.body.empId }, req.body, { upsert: true })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    successHandler(req, res, 'Data created successfully!', {});
                }
            });
    },
    viewData: async (req, res) => {
        await QAuser.findOne({ empId: req.params.empId })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    successHandler(req, res, 'Data listed successfully!', {});
                }
            });
    }
}