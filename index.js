const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { json, urlencoded } = require('body-parser');
const app = express();

const config = require('./config/index');
const { connectivity } = require('./config/db');
const logger  = require('./utils/logger');

var normalizedPath = require('path').join(__dirname, 'routes');

app
    .use(cors())
    .use(morgan('dev'))
    .use(json({ limit: '3mb', extended: true }))
    .use(urlencoded({ limit: '3mb', extended: true }))
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, PATCH');
        next();
    })
    .listen(config.server.port, () => {
        var get_connection = connectivity();
        get_connection.on('error', (err) => {
            console.error(err);
            process.exit(1);
        });
        get_connection.once('open', () => {
            require('fs')
                .readdirSync(normalizedPath)
                .forEach(file => {
                    require('./routes/' + file)(app);
                });
                console.log('Server started successfully!')
            logger.info('Server started successfully!')
        });
    });
module.exports = app;