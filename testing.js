const { loadFcmMessage, sendFcmMessagePromise } = require('./utils/fcm');
const moment = require('moment');

let bodyMessage = '本日の健康状態の登録がまだ実施されておりません。'
+ '健康状態の入力後、登録をお願いします。'
+ '未登録日：06月11日分 ' + moment(new Date()).format("DD/MM/YYYY") +
+ '従業員の皆様とそのご家族様を守る為、ご協力をお願いいたします';

let message = loadFcmMessage(
    ['fJOj1qDISQivoS-_W9zNmW:APA91bEwR1_XSLHST6WXVHGWbHirAm_VjEc4iGLCr8iq8ruT_-_answ1eZlq5TYZj2Y9sOuDM_JKipXjW8IVrTQeJR-CSLwqoHgyuC2v2SEWLz4cIFUSj2xOOshXQkbYE5NhljijFXVp'],
    '通知メッセージ',
    bodyMessage
);

sendFcmMessagePromise(message).then(() => console.log('success')).catch(e => console.log((e)));
