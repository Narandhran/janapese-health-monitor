const userControl = require('../controllers/user');
const { authenticate, authorize } = require('../middlewares/auth');
module.exports = app => {
    app.post('/user/register', authenticate, authorize(['ADMIN']), userControl.register)
    app.post('/user/login', userControl.login)
}