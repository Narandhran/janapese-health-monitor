const CloseContact = require('../models/close_contact');
const { toJapanese } = require('../utils/constant');
const { errorHandler, successHandler } = require('../utils/handler');

module.exports = {
    insertData: async (req, res) => {
        let { closedContacts = [] } = req.body;
        if (closedContacts.length > 0) {
            let persisted = closedContacts.map(e => {
                return { empId: req.verifiedToken.uuid, target: e };
            });
            await CloseContact.insertMany(persisted, (err, data) => {
                if (err) errorHandler(req, res, err);
                else successHandler(req, res, toJapanese['Data created successfully'], { success: true });
            });
        }

    },
    viewData: async (req, res) => {
        await CloseContact.find({ empId: req.params.empId})
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else successHandler(req, res, toJapanese['Data listed successfully'], data);
            })
    }
}