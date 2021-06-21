const MedicalReport = require('./models/medical_report');
const moment = require('moment');
const user = require('./models/user');
const { loadFcmMessage, sendFcmMessagePromise } = require('./utils/fcm');


let date = moment(new Date()).format("YYYY-MM-DD")
let fn = async () => {
    await MedicalReport.find({ createdAt: { $gt: date } }, async (err, data) => {
        if (err) console.log(err);
        else {
            let uuids = data.map(e => {
                return e.empId;
            });
            let senderData = await user.find({ empId: { $nin: uuids }, fcmToken: { $ne: '' } }, 'fcmToken').lean();
            let senderIds = senderData.map(e => {
                return e.fcmToken;
            });
            let bodyMessage = '本日の健康状態の登録がまだ実施されておりません。'
                + '健康状態の入力後、登録をお願いします。'
                + '未登録日：06月11日分 ' + moment(new Date()).format("DD/MM/YYYY")
                + ' 従業員の皆様とそのご家族様を守る為、ご協力をお願いいたします';
            let options = loadFcmMessage(senderIds, '通知メッセージ', bodyMessage);
            sendFcmMessagePromise(options)
                .then(() => {
                    console.log('Data send successfully');
                }).catch(e => console.log(`${e.status || 400} - ${e.message}`));
        }
    })
}