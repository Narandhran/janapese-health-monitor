const { readFileSync } = require('fs');
const { sign, verify, decode } = require('jsonwebtoken');
const { resolve } = require('path');
const { algorithm, audience, expiration, issuer } = require('../utils/constant').jwt;

var privateKEY = readFileSync(resolve('utils/keys/private.key'), 'utf8');
var publicKEY = readFileSync(resolve('utils/keys/public.key'), 'utf8');

/*
 * Custom
 * JWT Service
 */

module.exports = {
    sign: (payload) => {
        var signOptions = {
            issuer: issuer,
            audience: audience,
            expiresIn: expiration,
            algorithm: algorithm
        };
        return sign(payload, privateKEY, signOptions);
    },
    verify: (token) => {
        var verifyOptions = {
            issuer: issuer,
            audience: audience,
            expiresIn: expiration,
            algorithm: [algorithm]
        };
        return verify(token, publicKEY, verifyOptions);

    },
    decode: (token) => {
        return decode(token, { complete: true });
    }
};