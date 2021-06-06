const _ = require('lodash');
var onlyNumber = '123456789';
var onlySmallCase = 'abcdefghijklmnopqrstuvwxyz';
var onlyBigCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var alphaNumericBig = `${onlyNumber}${onlyBigCase}`;
var alphaNumericSmall = `${onlyNumber}${onlySmallCase}`;
var alphaNumericMixed = `${onlyNumber}${onlySmallCase}${onlyBigCase}`;
var specialString = `${alphaNumericMixed}_@-#`;

var generate = (genLength, getChar) => {
    var length = genLength;
    var charset = getChar;
    persisted = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        persisted += charset.charAt(Math.floor(Math.random() * n));
    }
    return persisted;
};

module.exports.generateUUID = (empId, countryCode = '81') => {
    let uuid = `${empId}${countryCode}${generate(10, alphaNumericBig)}`;
    while (uuid.length < 32) {
        uuid += '0';
    }
    return uuid;
};

module.exports.generateOTP = () => {
    return _.random(1000, 9999);
}