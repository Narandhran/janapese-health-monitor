const qaControl = require("../controllers/qa")
const { authorize, authenticate } = require("../middlewares/auth")

module.exports = app => {
    /**
     * Common routes
     */
    app.post('/qa/c/create', authenticate, authorize(['ADMIN']), qaControl.create);
    app.put('/qa/c/update', authenticate, authorize(['ADMIN']), qaControl.update);
    app.get('/qa/c/view', authenticate, authorize(['ADMIN', 'USER']), qaControl.list);
}