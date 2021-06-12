const SCHEDULE = require('node-schedule');
const User = require('../models/user');
const moment = require('moment');
const { loadFcmMessage, sendFcmMessagePromise } = require('../utils/fcm');
const logger = require('../utils/logger');
/**
 * Send Push notification on every monday, wednesday and friday
 */

module.exports.sendFCMremainder = SCHEDULE.scheduleJob('30 6 * * 1,3,5', async function () {
    await User.find({ isReportSubmitted: false }, 'fcmToken').exec((err, data) => {
        if (err) logger.error(`${err.status || 400} - ${e.message}`);
        else {
            let bodyMessage = '本日の健康状態の登録がまだ実施されておりません。'
                + '健康状態の入力後、登録をお願いします。'
                + '未登録日：06月11日分 ' + moment(new Date()).format("DD/MM/YYYY") +
                + '従業員の皆様とそのご家族様を守る為、ご協力をお願いいたします';
            let tokens = data.map(e => e['fcmToken']);
            loadFcmMessage(tokens, '通知メッセージ', bodyMessage);
            sendFcmMessagePromise(loadFcmMessage)
                .then(() => {
                    console.log('Data send successfully');
                }).catch(e => logger.error(`${e.status || 400} - ${e.message}`));
        }
    });
});