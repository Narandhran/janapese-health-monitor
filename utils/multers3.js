const { cloud } = require('../utils/constant');
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');


aws.config.update({
    secretAccessKey: cloud.secretAccessKey,
    accessKeyId: cloud.accessKeyId,
    region: cloud.region
});

var s3 = new aws.S3();

var loadMulterS3 = (fileSize, filePath) => {
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: `beehealth/${filePath}`,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            key: function (req, file, cb) {
                cb(null, `${Date.now()}${path.extname(file.originalname)}`);
            }
        }),
        fileFilter: function (req, file, cb) {
            if (file.fieldname == 'temperature' || file.fieldname == 'antigen') {
                let fext = path.extname(file.originalname);
                if (fext == '.jpg' || fext == '.jpeg' || fext == '.png') {
                    cb(null, true);
                } else cb(new Error('Unsupported file type'), false);
            }
            else cb(new Error('Unsupported field type', false));
        },
        limits: { fileSize: (fileSize * 1024 * 1024) }
    });
};

module.exports = { loadMulterS3 };