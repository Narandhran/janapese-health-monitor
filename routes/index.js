const logger = require('../utils/logger');
const User = require('../models/user');
const moment = require('moment');
const { loadFcmMessage, sendFcmMessagePromise } = require('../utils/fcm');
const MedicalReport = require('../models/medical_report');
const sheduler = require('../controllers/sheduler');
module.exports = app => {
    app.get('/', (req, res) => {
        // logger.info('Welcome page');
        res.send('Hi, Welcome')
    });
    app.post('/sendFCM', async (req, res) => {
        let date = moment(new Date()).format("YYYY-MM-DD")
        await MedicalReport.find({ createdAt: { $gt: date } }, async (err, data) => {
            if (err) logger.error(`${err.status || 400} - ${e.message}`);
            else {
                let uuids = data.map(e => {
                    return e.empId;
                });
                let senderData = await User.find({ empId: { $nin: uuids }, fcmToken: { $ne: '' } }, 'fcmToken').lean();
                let senderIds = senderData.map(e => {
                    return e.fcmToken;
                });
                console.log((senderIds));
                //FCM logic
                let bodyMessage = '本日の健康状態の登録がまだ実施されておりません。'
                    + '健康状態の入力後、登録をお願いします。'
                    + '未登録日：' + moment(new Date()).format("DD/MM/YYYY").toString()
                    + ' 従業員の皆様とそのご家族様を守る為、ご協力をお願いいたします';
                let options = loadFcmMessage(senderIds, '通知メッセージ', bodyMessage);
                sendFcmMessagePromise(options)
                    .then(() => {
                        console.log('Data send successfully');
                        logger.info(`---------SUCCESS--------- || ${senderIds}`);
                    }).catch(e => logger.error(`${e.status || 400} - ${e.message}`));
            }
        });
    })
}