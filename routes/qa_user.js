const qaUserControl = require("../controllers/qa_user")
const { authenticate, authorize } = require("../middlewares/auth")

module.exports = app => {
    /**
     * Mobile routes
     */
    app.post('/qa_user/m/create_update', authenticate, authorize(['ADMIN', 'USER']), qaUserControl.createOrUpdate);
    app.get('/qa_user/m/view_data/:empId', authenticate, authorize(['ADMIN', 'USER']), qaUserControl.viewData);
}