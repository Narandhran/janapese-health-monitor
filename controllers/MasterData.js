/**
 * @author - itsNaren
 * @description - Closed contact setting master data
 * @date - 2021-06-10 18:17:55
**/
const ClosedContactSetting = require('../models/colsed_contact_setting');
const Department = require('../models/department');
const { errorHandler, successHandler } = require('../utils/handler');
const { sendFCMremainder } = require('./sheduler');
const { toJapanese } = require('../utils/constant');

module.exports = {
    updateClosedContactSetting: async (req, res) => {
        console.log(JSON.stringify(req.body));
        await ClosedContactSetting
            .findOneAndUpdate(req.body.current, req.body.update, { upsert: true })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else
                    successHandler(req, res, toJapanese['Data updated successfully'], { success: true });
            });
    },
    showClosedContactSetting: async (req, res) => {
        await ClosedContactSetting
            .find({},'timeDuration distance')
            .sort({ updatedAt: -1 })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else if (data.length > 0)
                    successHandler(req, res, toJapanese['Data listed successfully'], data[0]);
                else successHandler(req, res, toJapanese['Data listed successfully'], { timeDuration: 15, distance: 10 });
            });
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
        });
    }
}