module.exports.db = {
    local: {
        username: '',
        password: '',
        host: 'localhost',
        port: '27017',
        db: 'employeeapp'
    },
    dev: {
        username: 'appacc',
        password: 'AppAceRWO',
        host: 'localhost',
        port: '27017',
        db: 'employeeapp'
    },
    prod: {
        username: '',
        password: '',
        port: '',
        db: ''
    }
}

module.exports.server = {
    port: '8084'
}
