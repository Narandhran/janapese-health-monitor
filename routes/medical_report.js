const medicalReportControl = require('../controllers/medical_report');
const { authenticate, authorize } = require('../middlewares/auth');
module.exports = app => {
    app.put('/report/p/edit/:_id', authenticate, authorize(['ADMIN']), medicalReportControl.editReport);
};