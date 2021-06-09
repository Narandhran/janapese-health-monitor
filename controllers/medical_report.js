/**
 * @author - itsNaren
 * @description - 
 * @date - 2021-05-31 12:19:59
**/
const MedicalReport = require('../models/medical_report');
const User = require('../models/user');
const { errorHandler, successHandler } = require('../utils/handler');

module.exports = {
    /**
     * Web edit report
     */
    editReport: async (req, res) => {
        await MedicalReport
            .findByIdAndUpdate(req.params._id, request.body, { new: true })
            .exec(async (err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    let user = await User.findOne({ empId: data.empId });
                    if (!(data.infectionRisk == user.isInfected)) {
                        user.isInfected = data.infectionRisk;
                        await user.save();
                    }
                    successHandler(req, res, 'Data updated successfully!', data);
                }
            })
    },
    addReport: async (req, res) => {
        await MedicalReport
            .create(req.body, (err, data) => {
                if (err) errorHandler(req, res, err);
                successHandler(req, res, 'Data created successfully!', { success: true });
            });
    },
    infectedPeople: async (req, res) => {
        await MedicalReport
            .find({ qa: { $elemMatch: { 'Infection risk transfer': { $in: [] } } } })
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                successHandler(req, res, 'Data listed successfully!', data);
            })
    }
};