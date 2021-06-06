const { authenticate, authorize } = require("../middlewares/auth")
const customControl = require('../controllers/custom');
module.exports = app => {
    app.get('/dashboard/m/view/:empId', authenticate, authorize(['USER', 'ADMIN']), customControl.mHealthManagement);
}