/**
 * @author - itsNaren
 * @description - Closed contact setting master data
 * @date - 2021-06-10 18:17:55
**/
const MasterData = require('../models/MasterData');
const { errorHandler, successHandler } = require('../utils/handler');
const { sendFCMremainder } = require('./sheduler');
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
    },
    updateFCMRemainderValue: async (req, res) => {
        let { minute = 30, hour = 6, dayOfWeek = '1,3,5' } = req.body;
        let spec = `${minute} ${hour} * * ${dayOfWeek}`
        let response = await sendFCMremainder.reschedule(spec);
        if (response) successHandler(req, res, 'Data updated successfully', { success: true });
        else errorHandler(req, res, new Error('Some error occured, contact Admin'));
    }
}