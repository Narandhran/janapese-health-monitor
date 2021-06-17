/**
 * @author - itsNaren
 * @description - Closed contact setting master data
 * @date - 2021-06-10 18:17:55
**/
const MasterData = require('../models/MasterData');
const Department = require('../models/department');
const { errorHandler, successHandler } = require('../utils/handler');
const { sendFCMremainder } = require('./sheduler');
const { toJapanese } = require('../utils/constant');

module.exports = {
    updateClosedContactSetting: async (req, res) => {
        await MasterData
            .findByIdAndUpdate(req.params._id, { closedContactSetting: req.body })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else
                    successHandler(req, res, toJapanese['Data updated successfully'], { success: true });
            })
    },
    showClosedContactSetting: async (req, res) => {
        await MasterData
            .find({})
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else {

                    let result = data.length > 0 ? data[0].closedContactSetting : { distance: 2, timeDuration: 15 };
                    successHandler(req, res, toJapanese['Data listed successfully'], result);
                }
            })
    },
    updateFCMRemainderValue: async (req, res) => {
        let { minute = 30, hour = 6, dayOfWeek = '1,3,5' } = req.body;
        let spec = `${minute} ${hour} * * ${dayOfWeek}`
        let response = await sendFCMremainder.reschedule(spec);
        if (response) successHandler(req, res, toJapanese['Data updated successfully'], { success: true });
        else errorHandler(req, res, new Error(toJapanese['Some error occured, contact Admin']));
    },
    listDepartment: async (req, res) => {
        await Department.find({}, (err, data) => {
            if (err) errorHandler(req, res, err);
            else successHandler(req, res, toJapanese['Data updated successfully'], data);
        })
    }
}