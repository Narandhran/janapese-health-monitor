const masterControl = require('../controllers/MasterData');
const { authenticate, authorize } = require('../middlewares/auth');
module.exports = app => {
    /**
     * Web routes
     */
    app.get('/master/close_contact_setting/view_data', authenticate, authorize(['ADMIN']), masterControl.showClosedContactSetting);
    app.put('/master/update_contact_setting/:_id', authenticate, authorize(['ADMIN']), masterControl.updateClosedContactSetting);
    app.put('/master/reshedule_fcm_remainder', authenticate, authorize(['ADMIN']), masterControl.updateFCMRemainderValue);
}