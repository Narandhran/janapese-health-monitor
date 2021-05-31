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
                    successHandler(req, res, 'Message send successfully!', {});
                }
            });
    }
};