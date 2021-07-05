const messageControl = require('../controllers/message');
const { authenticate, authorize } = require('../middlewares/auth');
module.exports = app => {
    /**
     * Web routes
     */
    app.post('/message/p/create', authenticate, authorize(['ADMIN']), messageControl.insertMessages);
    /**
     * Mobile routes
     */
    app.get('/message/m/view_messages/:empId', authenticate, authorize(['ADMIN', 'USER']), messageControl.viewMessages);
};