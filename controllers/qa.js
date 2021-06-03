const QA = require("../models/qa")

module.exports = {
    create: async (req, res) => {
        await QA.create(req.body, (err, data) => {
            if (err) errorHandler(req, res, err);
            else {
                successHandler(req, res, 'Question created successfully!', {});
            }
        });
    },
    update: async (req, res) => {
        await QA
            .findByIdAndUpdate(req.params._id, req.body)
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    successHandler(req, res, 'Question updated successfully!', {});
                }
            });

    },
    list: async (req, res) => {
        await QA.find({}, (err, data) => {
            if (err) errorHandler(req, res, err);
            else {
                successHandler(req, res, 'Question listed successfully!', {});
            }
        });
    }
}