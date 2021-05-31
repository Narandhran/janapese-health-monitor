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