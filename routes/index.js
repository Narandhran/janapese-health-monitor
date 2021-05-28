const logger = require('../utils/logger');
module.exports = app => {
    app.get('/', (req, res) => {
        logger.info('Welcome page');
        res.send('Hi, Welcome')
    })
}