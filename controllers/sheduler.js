const SCHEDULE = require('node-schedule');
const User = require('../models/user');
const { loadFcmMessage, sendFcmMessageCb, sendFcmMessagePromise } = require('../utils/fcm');
/**
 * Send Push notification on everday
 */

SCHEDULE.scheduleJob('30 6 * * *', async function () {
    await User.find({ isReportSubmitted: false }, 'fcmToken').exec((err, data) => {
        if (err) console.log('Error occured on fcm push');
        else {
            let tokens = data.map(e => e['fcmToken']);
            loadFcmMessage(tokens, '通知メッセージ', '社内でのコロナウイルス感染予防の為、従業員の皆様の 本日の健康状態を出勤前に御回答をお願いいたします。従業員の皆様とそのご家族を守る為、御協力をお願い 致します');
            sendFcmMessagePromise(loadFcmMessage)
                .then(() => {
                    console.log('Data send successfully');
                }).catch(e => console.log('FCM error'));
        }
    });
});