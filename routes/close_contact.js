const { authenticate, authorize } = require("../middlewares/auth")
const closeContactControl = require('../controllers/close_contact');

module.exports = app => {
    app.post('/close_contact/w/create', authenticate, authorize(['ADMIN', 'USER']), closeContactControl.insertData);
    app.get('/close_contact/w/view/:empId', authenticate, authorize(['ADMIN']), closeContactControl.viewData);
}