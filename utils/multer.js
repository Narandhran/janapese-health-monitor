/**
 * @author - itsNaren
 * @description - Customized Multer service (Multipart files)
 * @date - 2021-06-01 14:41:30
**/
var path = require('path');
var multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        switch (file.fieldname) {
            case 'dp':
                cb(null, `${path.resolve('public/dp')}`);
                break;
            case 'users-file':
                cb(null, `${path.resolve('public/registration')}`);
                break;
            default:
                cb(null, `${path.resolve('public/others')}`);
                break;
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

var loadMulter = (fileSize) => {
    return multer({
        storage: fileStorage,
        fileFilter: function (req, file, cb) {
            if (file.fieldname == 'dp') {
                let fext = path.extname(file.originalname);
                if (fext == '.jpg' || fext == '.jpeg' || fext == '.png') cb(null, true);
                else cb(new Error('Unsupported file type, must be an image file'), false);
            }
            else if (file.fieldname == 'users-file') {
                let isXLext = path.extname(file.originalname);
                if (isXLext == '.xls' || isXLext == '.xlsx') cb(null, true);
                else cb(new Error('Unsupported file type, must be an EXCEL file'), false);
            }
            else cb(new Error('Invalid File field name', false));
        },
        limits: { fileSize: (fileSize * 1024 * 1024) }
    });
};

module.exports = { loadMulter };