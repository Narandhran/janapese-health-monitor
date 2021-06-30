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
module.exports.cloud = {
    secretAccessKey: 'icmaRcoX1e89S5mPQPzxH8UsT10rIUillJoCtBUN',
    accessKeyId: 'AKIAVD2QJDWG7OYJVJ4L',
    region: 'ap-south-1',
    basePath: 'https://projectorg.s3.ap-south-1.amazonaws.com/'
}
module.exports.toJapanese = {
    "Success": "完了",
    "Data not found": "データが見つかりませんでした",
    "Data updated successfully": "データが更新されました",
    "Data listed successfully": "データが一覧済みでした",
    "Some error occured, contact Admin": "エラーが発生されました。管理者に連絡してください",
    "Data created successfully": "データが作成されました",
    "You have not input your data yet": "まだデータを入力していません",
    "Message(s) has been sent": "メッセージを送りました",
    "Something went wrong": "エラーが発生されました",
    "Viewing messages": "メッセージをみています",
    "Employee number and Email should not be empty, check the excel sheet properly": "従業員番号とメールアドレスを入力する必要があります。Excelシートを適切に確認してください",
    "Data imported successfully": "データを読み込みました",
    "Data is either empty or not valid": "データが空いているか無効である",
    "Login success": "ログイン完了",
    "Incorrect password, try again": "パスワードが正しくありません。もう一度お試し願います",
    "User does not exist": "ユーザーは存在しません",
    "Invalid OTP, try again": "無効なOTP、もう一度お試し願います",
    "Email not verified yet": "メールはまだ確認されていません",
    "User is not exist, kindly ask admin": "ユーザーが存在しません。管理者にご連絡ください",
    "OTP sent successfully": "OTP を送信しました",
    "Password updated successfully": "パスワードが更新されました",
    "OTP verified successfully": "OTP が確認されました",
    "No data": "データがありません"
}