const { createTransport } = require('nodemailer');
const { google } = require('googleapis');
const { mail } = require('./constant');
const fs = require('fs');
const path = require('path');
var inlineCss = require('nodemailer-juice');
const Handlebars = require('handlebars');
const OAuth2 = google.auth.OAuth2;
const { errorHandler, successHandler } = require('./handler');

const templateUtil = {
    companyName: '#companyName',
    supportMail: 'customerservice@orgware.com',
    adminMail: 'admin@orgware.com',
};

/*

const oauth2Client = new OAuth2(
    mail.clientId,
    mail.clientSecret,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: "1//04ITAIug675juCgYIARAAGAQSNwF-L9Irn61SD8lv_r9PoA_LhMxfsoGXmQNkWadp1xRHyIRZnwWCviXhy8S5HvAdSxY-fVR5cIQ"
});
const accessToken = oauth2Client.getAccessToken()
*/

var transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'noreply.beehealth@gmail.com',
        pass: 'bee$%2021H'
    }
});
/*
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
        accessToken: accessToken,
        tls: {
            rejectUnauthorized: false
        }
    }
});
*/
transporter.use('compile', inlineCss());

module.exports.sendMail = async (req, res, option, data = {}, fileName) => {
    try {
        // let isVerified = await transporter.verify();
        // if (isVerified) {
        console.log('Server is able to send the message...');
        let source = await fs.readFileSync(path.resolve('utils/templates/' + fileName), 'utf8');
        let template = await Handlebars.compile(source);
        return await transporter.sendMail({
            from: '"BeeHealth" <noreply.beehealth@gmail.com>',
            ...option,
            html: template({ ...data, ...templateUtil })
        });
        // }
    } catch (e) {
        errorHandler(req, res, e);
    }
};