'use strict';

const sqlite = require('sqlite3').verbose();

const DBSOURCE = './db/NoleggioAuto.db';

const db = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // Errore: database non accessibile
        console.error(err.message);
        throw err;
    }
});

module.exports = db;
