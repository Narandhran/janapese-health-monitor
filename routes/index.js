const logger = require('../utils/logger');
const sheduler = require('../controllers/sheduler');
module.exports = app => {
    app.get('/', (req, res) => {
        // logger.info('Welcome page');
        res.send('Hi, Welcome')
    })
}