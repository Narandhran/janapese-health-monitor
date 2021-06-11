const medicalReportControl = require('../controllers/medical_report');
const { authenticate, authorize } = require('../middlewares/auth');
module.exports = app => {
    /**
     * Web routes
     */
    app.put('/report/p/edit/:_id', authenticate, authorize(['ADMIN']), medicalReportControl.editReport);
    app.get('/report/p/get_infected', authenticate, authorize(['ADMIN']), medicalReportControl.infectedPeople);
    app.get('/report/p/list_all', authenticate, authorize(['ADMIN']), medicalReportControl.listAllReport);
    app.post('/report/p/search_filter', medicalReportControl.filter);
    /**
     * Mobile routes
     */
    app.post('/report/m/create', authenticate, authorize(['ADMIN', 'USER']), medicalReportControl.addReport);
    app.get('/report/m/view_data/:empId', authenticate, authorize(['ADMIN', 'USER']), medicalReportControl.getByUser);
};