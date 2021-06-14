const { FCM_CONSTANT } = require('../utils/constant');
var FCM = require('fcm-push');

var FCM = new FCM(FCM_CONSTANT.server_key);
module.exports = {
    loadFcmMessage: (target, title, body, data) => {
        return {
            registration_ids: target,
            // collapse_key: 'your_collapse_key',
            data: {
                object: data
            },
            notification: {
                title: title,
                body: body,
                sound: 'default'
            }
        };
    },

    loadFcmTopics: (target, title, body, rrData) => {
        return {
            to: target,
            // collapse_key: 'your_collapse_key',
            data: {
                title: title,
                body: rrData
            },
            notification: {
                title: title,
                body: body,
                sound: 'custom_sound',
                android_channel_id: 'fcm_default_channel'
            }
        };
    },

    sendFcmMessagePromise: (message) => {
        // console.log(JSON.stringify(message));
        return FCM.send(message);
    },

    sendFcmMessageCb: async (message, cb) => {
        await FCM.send(message, function (err, result) {
            cb(err, result);
        });
    }
};
