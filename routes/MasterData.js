const masterControl = require('../controllers/MasterData');
const { authenticate, authorize } = require('../middlewares/auth');
module.exports = app => {
    /**
     * Web routes
     */
    app.get('/master/close_contact_setting/view_data', authenticate, authorize(['ADMIN']), masterControl.showClosedContactSetting);
    app.put('/master/update_contact_setting', authenticate, authorize(['ADMIN']), masterControl.updateClosedContactSetting);
    app.put('/master/reshedule_fcm_remainder', authenticate, authorize(['ADMIN']), masterControl.updateFCMRemainderValue);

    app.get('/master/get_all_department', authenticate, authorize(['ADMIN', 'USER']), masterControl.listDepartment);
}