const mysql = require('mysql');
const assert = require('assert');
let _db;

module.exports = {
    get_db_connection,
    init_db
};

function init_db(callback) {
    if (_db) {
        console.warn('trying to init db again');
        return callback(null, _db);
    }
    _db = mysql.createConnection({
        host: 'localhost',
        user: 'springuser',
        password: 'spring',
        database: 'db_example'
    });
    _db.connect((err) => {
        if (err) {
            return callback(err);
        }
        console.info('connected as id ' + _db.threadId);
        return callback(null, _db);
    });
}
function get_db_connection() {
    assert.ok(_db, 'db has not been initialized. Please call init first.');
    if (_db) return _db; // use mysql db
}