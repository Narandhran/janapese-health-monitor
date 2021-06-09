const medicalReportControl = require('../controllers/medical_report');
const { authenticate, authorize } = require('../middlewares/auth');
module.exports = app => {
    /**
     * Web routes
     */
    app.put('/report/p/edit/:_id', authenticate, authorize(['ADMIN']), medicalReportControl.editReport);

    /**
     * Mobile routes
     */
    app.post('/report/m/create', authenticate, authorize(['ADMIN', 'USER']), medicalReportControl.addReport);
};