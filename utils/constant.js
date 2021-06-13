module.exports.jwt = {
    issuer: 'orgware',
    audience: 'japnese-health-monitor',
    salt: 10,
    expiration: '90d',
    algorithm: 'RS256'
};
module.exports.countryCode = '81';
module.exports.initAdmin = {
    "name": "Admin",
    "empId": "J000",
    "role": "Admin",
    "gender": "male",
    "email": "admin@gmail.com",
    "schedule": '1,3,5',
    "mobile": "0000000000",
    "password": "password",
    "status": true
}
module.exports.verifyOTP = (inputOTP, verifyObject) => {
    let { otp, expire } = verifyObject;
    if (otp == inputOTP) return true;
    else return false;
}
module.exports.FCM_CONSTANT = {
    server_key: 'AAAABihWQgk:APA91bGFAm6yTXG-5xwKw0j2bzPUnlG0LS4q8d6uPYmYxG3wgApSwgRLhFHfVeakWlXk9iRn-NDm5E97L0JGy27sAM0IKpXVAepKtNRk8of9qEenmoMfRtBFquvrwtoNP3pm8BIGDHD6',
    alert_medical_report: '/topics/alert_medical_report'
}
module.exports.mail = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'Gmail',
    type: 'OAuth2',
    redirectUrl: 'https://developers.google.com/oauthplayground',
    user: 'virtualacc2021@gmail.com',
    clientId: '232047250421-1dnki2s8hjdumk2lnrhoj216e3u8m9ii.apps.googleusercontent.com',
    clientSecret: 'xQ7ONFdUR54E_QgKcpTt4yzn',
    refreshToken: '1//0424IqSkGIQB3CgYIARAAGAQSNwF-L9Irh2cPZp7VdOu31dAJA5UD3d9Nb8_2NpP-8xVJbyU4h6EgeovJrbGi9i2rSo-woqvYFLY',
    accessToken: 'ya29.a0AfH6SMByuIhKYZqinP3cXJ3l-U5DVoM_8KL8G-h5ukLSTN09xNmuBiRvOZlchsgCVbRrl-Q9r1MPYV9yKt8KIb1Y0TfaY4mpUv1swJOz27P4zfZ70l3Q1SvJiGew1shIdxqZRKGQrunMscacB0LsFTF9cpFd',
}