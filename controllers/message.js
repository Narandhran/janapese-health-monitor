/**
 * @author - itsNaren
 * @description - Message controller
 * @date - 2021-05-31 20:18:54
**/
const Message = require('../models/message');
const { errorHandler, successHandler } = require('../utils/handler');

module.exports = {
    insertMessages: async (req, res) => {
        await Message
            .insertMany(req.body, (err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    //FCM logic here
                    successHandler(req, res, 'Message send successfully!', { success: true });
                }
            });
    },
    viewMessages: async (req, res) => {
        await Message
            .find({ empId: req.params.empId }, 'title message createdAt')
            .sort({ createdAt: -1 })
            .exec(async (err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    await Message.updateMany({ empId: req.params.empId }, { isRead: true });
                    successHandler(req, res, 'Viewing messages', data);
                }
            })
    }
};