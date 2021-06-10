/**
 * @author - itsNaren
 * @description - Closed contact setting master data
 * @date - 2021-06-10 18:17:55
**/
const MasterData = require('../models/MasterData');
const { errorHandler, successHandler } = require('../utils/handler');

module.exports = {
    updateClosedContactSetting: async (req, res) => {
        await MasterData
            .findByIdAndUpdate(req.params._id, { closedContactSetting: req.body })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                successHandler(req, res, 'Data updated successfully!', { success: true });
            })
    },
    showClosedContactSetting: async (req, res) => {
        await MasterData
            .find({}, 'distance timeDuration')
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                successHandler(req, res, 'Data listed successfully!', { success: true });
            })
    }
}