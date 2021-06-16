/**
 * @author - itsNaren
 * @description - Message controller
 * @date - 2021-05-31 20:18:54
**/
const Message = require('../models/message');
const User = require('../models/user');
const { loadFcmMessage, loadFcmTopics, sendFcmMessagePromise } = require('../utils/fcm');
const { errorHandler, successHandler } = require('../utils/handler');
const { FCM_CONSTANT, topicMessage, toJapanese } = require('../utils/constant');
const user = require('../models/user');
module.exports = {
    insertMessages: async (req, res) => {
        var { isForAll, userIds, message } = req.body;
        if (isForAll) {
            try {
                let bodyMessage = '本日の健康状態の登録がまだ実施されておりません。'
                    + '健康状態の入力後、登録をお願いします。'
                    + '未登録日：06月11日分 ' + moment(new Date()).format("DD/MM/YYYY") +
                    + '従業員の皆様とそのご家族様を守る為、ご協力をお願いいたします';
                let messages = new Message({ empId: 'FORALL', title: '通知メッセージ', message: message || bodyMessage, isForAll: true });
                await messages.save();
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
            } catch (error) {
                errorHandler(req, res, error);
            }
        } else {
            await User.find({ $and: [{ empId: { $in: userIds } }, { fcmToken: { $ne: '' } }] }, 'fcmToken')
                .exec(async (err, users) => {
                    if (err) errorHandler(req, res, err);
                    else {
                        try {
                            let tokens = [], messages = [];
                            for (user in users) {
                                tokens.push(user.fcmToken);
                                messages.push({ empId: user.empId, title: '通知メッセージ', message: message || bodyMessage, isForAll: false });
                            }
                            await Message.insertMany(messages);
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
                        } catch (error) {
                            errorHandler(req, res, error);
                        }
                    }
                });
        }
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