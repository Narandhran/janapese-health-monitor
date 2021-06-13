/**
 * @author - itsNaren
 * @description - Message controller
 * @date - 2021-05-31 20:18:54
**/
const Message = require('../models/message');
const User = require('../models/user');
const { loadFcmMessage, loadFcmTopics, sendFcmMessagePromise } = require('../utils/fcm');
const { errorHandler, successHandler } = require('../utils/handler');
const { FCM_CONSTANT, topicMessage,toJapanese } = require('../utils/constant');
module.exports = {
    insertMessages: async (req, res) => {
        await Message
            .insertMany(req.body, async (err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    //FCM logic here
                    if (data.length > 0) {
                        let bodyMessage = '本日の健康状態の登録がまだ実施されておりません。'
                            + '健康状態の入力後、登録をお願いします。'
                            + '未登録日：06月11日分 ' + moment(new Date()).format("DD/MM/YYYY") +
                            + '従業員の皆様とそのご家族様を守る為、ご協力をお願いいたします';
                        if (data[0].isForAll) {
                            topicMessage = loadFcmTopics(
                                FCM_CONSTANT.alert_medical_report,
                                '通知メッセージ',
                                bodyMessage
                            );
                            sendFcmMessagePromise(topicMessage)
                                .then(() => {
                                    successHandler(req, res, toJapanese['Message(s) has been sent'], { success: true });
                                })
                                .catch(e => errorHandler(req, res, e));
                        }
                        else {
                            let userIds = data.map(e => { return e.empId });
                            await User.find({ $and: [{ empId: { $in: userIds } }, { fcmToken: { $ne: '' } }] }, 'fcmToken')
                                .exec((err, users) => {
                                    if (err) errorHandler(req, res, err);
                                    else {
                                        let tokens = users.map(e => { return e.fcmToken });
                                        let message = loadFcmMessage(
                                            tokens,
                                            '通知メッセージ',
                                            bodyMessage
                                        );
                                        sendFcmMessagePromise(message)
                                            .then(() => {
                                                successHandler(req, res, toJapanese['Message(s) has been sent'], { success: true });
                                            })
                                            .catch(e => errorHandler(req, res, e));
                                    }
                                });
                        }

                    }
                    else errorHandler(req, res, new Error(toJapanese['Something went wrong']));
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
                    successHandler(req, res, toJapanese['Viewing messages'], data);
                }
            })
    }
};