const { createTransport } = require('nodemailer');
const { google } = require('googleapis');
const { mail } = require('./constant');
const fs = require('fs');
const path = require('path');
var inlineCss = require('nodemailer-juice');
const Handlebars = require('handlebars');
const OAuth2 = google.auth.OAuth2;
const { errorHandler, successHandler } = require('./handler');

/**
 * Mail option 
 * {
 from: '"Japanese Health Monitor" <virtualacc2021@gmail.com>',
 to: 'narandhran@gmail.com,narandhran@ymail.com',
 subject: 'welcome ✔',
 text: 'Hello world',
 * }
 */
const templateUtil = {
    companyName: '#companyName',
    supportMail: 'customerservice@orgware.com',
    adminMail: 'admin@orgware.com',
};

const myOAuth2Client = new OAuth2(mail.clientId, mail.clientSecret)

myOAuth2Client.setCredentials({
    refresh_token: mail.refreshToken
});

const myAccessToken = myOAuth2Client.getAccessToken()

var transporter = createTransport({
    host: mail.host,
    port: mail.port,
    secure: mail.secure,
    service: mail.service,
    auth: {
        type: mail.type,
        user: mail.user,
        clientId: mail.clientId,
        clientSecret: mail.clientSecret,
        refreshToken: mail.refreshToken,
        accessToken: myAccessToken
    }
});
transporter.use('compile', inlineCss());

module.exports.sendMail = async (req, res, option, data = {}, fileName) => {
    try {
        let isVerified = await transporter.verify();
        if (isVerified) {
            console.log('Server is able to send the message...');
            let source = await fs.readFileSync(path.resolve('utils/templates/' + fileName), 'utf8');
            let template = await Handlebars.compile(source);
            return await transporter.sendMail({
                from: '"Japanese Health Monitor" <virtualacc2021@gmail.com>',
                ...option,
                html: template({ ...data, ...templateUtil })
            });
        }
    } catch (e) {
        errorHandler(req, res, e);
    }
};