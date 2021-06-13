/**
 * @author - itsNaren
 * @description - Custom controller
 * @date - 2021-05-31 21:50:35
**/
const { errorHandler, successHandler } = require('../utils/handler');
const Message = require('../models/message');
const User = require('../models/user');
const { toJapanese } = require('../utils/constant');
const MedicalReport = require('../models/medical_report');
const json2xls = require('json2xls');
const fs = require('fs');
const path = require('path');

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
            if (data && data.lenght > 0) successHandler(req, res, toJapanese['Success'], persisted);
            else errorHandler(req, res, new Error(toJapanese['Data not found']));
        })
    },
    exportToExcel: async (req, res) => {
        let { data } = req.body;
        try {
            let xls = json2xls(data);
            filePath = path.resolve('public/others');
            fileName = 'data.xlsx';
            fs.writeFileSync(filePath + '/' + fileName, xls, 'binary');
            res.sendFile(fileName, { root: filePath });
        } catch (error) {
            errorHandler(req, res, error);
        }
    }
}