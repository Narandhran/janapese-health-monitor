const _ = require('lodash');
var onlyNumber = '123456789';
var onlySmallCase = 'abcdefghijklmnopqrstuvwxyz';
var onlyBigCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var alphaNumericBig = `${onlyNumber}${onlyBigCase}`;
var alphaNumericSmall = `${onlyNumber}${onlySmallCase}`;
var alphaNumericMixed = `${onlyNumber}${onlySmallCase}${onlyBigCase}`;
var specialString = `${alphaNumericMixed}_@-#`;
const { v4: uuidv4 } = require('uuid');
var generate = (genLength, getChar) => {
    var length = genLength;
    var charset = getChar;
    persisted = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        persisted += charset.charAt(Math.floor(Math.random() * n));
    }
    return persisted;
};

module.exports.generateUUID = () => {
    return uuidv4();
};

module.exports.generateOTP = () => {
    return _.random(1000, 9999);
}