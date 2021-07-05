const QA = require("../models/qa")
const { errorHandler, successHandler } = require('../utils/handler');
const { toJapanese } = require('../utils/constant');
const logger = require('../utils/logger');

module.exports = {
    create: async (req, res) => {
        await QA.create(req.body, (err, data) => {
            if (err) errorHandler(req, res, err);
            else {
                successHandler(req, res, toJapanese['Data created successfully'], { success: true });
            }
        });
    },
    update: async (req, res) => {
        await QA
            .findByIdAndUpdate(req.params._id, req.body)
            .exec((err, data) => {
                if (err) errorHandler(req, res, err);
                else {
                    successHandler(req, res, toJapanese['Data updated successfully'], { success: true });
                }
            });

    },
    list: async (req, res) => {
        await QA.find({}, (err, data) => {
            if (err) errorHandler(req, res, err);
            else {
                successHandler(req, res, toJapanese['Data listed successfully'], data);
            }
        });
    }
}