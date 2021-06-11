const { hashSync, compareSync } = require('bcrypt');

/*
 * Custom
 * Crypto Service
 */

module.exports = {
    encrypt: (plainText) => {
        return hashSync(plainText, 10);
    },
    validate: (plainText, hashText) => {
        console.log(`${plainText} and ${hashText}`);
        if (compareSync(plainText, hashText))
            return true;
        else
            return false;
    },
    generatePassword: () => {
        var length = 12,
            charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_',
            persisted = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            persisted += charset.charAt(Math.floor(Math.random() * n));
        }
        return persisted;
    }
};