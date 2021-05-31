const medicalReportControl = require('../controllers/medical_report');
const { authenticate, authorize } = require('../middlewares/auth');
module.exports = app => {
    app.put('/m_report/p/edit', authenticate, authorize(['ADMIN']), medicalReportControl.editReport);
};