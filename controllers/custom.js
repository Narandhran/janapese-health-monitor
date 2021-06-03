/**
 * @author - itsNaren
 * @description - Custom controller
 * @date - 2021-05-31 21:50:35
**/
const { errorHandler, successHandler } = require('../utils/handler');
const Message = require('../models/message');
const User = require('../models/user');
const MedicalReport = require('../models/medical_report');
module.exports = {
    mHealthManagement: async (req, res) => {
        let { empId } = req.params;
        // let messageCount = 0, profileInfo = {}, registrationInfo = {}, medicalInfo = {};
        Promise.all([
            await Message.find({ '$and': [{ '$or': [{ empId: empId }, { isForAll: true }] }, { isRead: false }] }).lean(),
            await User.findOne({ empId }, 'name empId email').lean(),
            await MedicalReport.findOne({ empId }, 'date bodyTemperature antigen').lean()
        ]).then((data) => {
            let persisted = {
                messageCount: data[0] || 0,
                profileInfo: data[1] || {},
                medicalInfo: data[2] || {}
            }
            if (data && data.lenght > 0) successHandler(req, res, 'Success', persisted);
            else errorHandler(req, res, new Error('Data not found'));
        })
    },
}