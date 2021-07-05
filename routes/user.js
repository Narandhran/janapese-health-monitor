const userControl = require('../controllers/user');
const { authenticate, authorize } = require('../middlewares/auth');
module.exports = app => {
    /**
     * Web routes
     */
    app.post('/user/p/login', userControl.login);
    app.post('/user/p/register', authenticate, authorize(['ADMIN']), userControl.register);
    app.get('/user/p/dashboard', authenticate, authorize(['ADMIN']), userControl.dashboard);
    app.post('/user/p/add_employee', authenticate, authorize(['ADMIN']), userControl.addEmployee);
    app.post('/user/p/import_user', authenticate, authorize(['ADMIN']), userControl.importUsers);
    app.get('/user/p/list_employee', authenticate, authorize(['ADMIN']), userControl.listEmployee);


    /**
     * Mobiler routes
     */
    app.post('/user/m/register', userControl.mRegister);
    app.post('/user/m/verify', userControl.verifyAccount);
    app.post('/user/m/login', userControl.mLogin);

    /**
     * Common routes
     */
    app.post('/user/c/request_otp', userControl.requestOTP);
    app.post('/user/c/reset_password', userControl.resetPassword);

}