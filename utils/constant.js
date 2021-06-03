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
    "schedule": ["monday", "wednesday", "friday"],
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
    server_key: 'AAAABihWQgk:APA91bGFAm6yTXG-5xwKw0j2bzPUnlG0LS4q8d6uPYmYxG3wgApSwgRLhFHfVeakWlXk9iRn-NDm5E97L0JGy27sAM0IKpXVAepKtNRk8of9qEenmoMfRtBFquvrwtoNP3pm8BIGDHD6'
}