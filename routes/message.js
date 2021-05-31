const messageControl = require('../controllers/message');
const { authenticate, authorize } = require('../middlewares/auth');
module.exports = app => {
    app.put('/message/p/create', authenticate, authorize(['ADMIN']), messageControl.insertMessages);
};