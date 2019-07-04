const fs = require('fs');
var os = require("os");
const TIMESTAMP_FILENAME = 'timestamp';
const HISTORY_FILENAME = 'history';
const ENCODING = 'utf8';

let timestamp;

module.exports.loadTimestamp = (cb) => {
    fs.readFile(TIMESTAMP_FILENAME, ENCODING, (error, stringFromFile) => {
        if (error) {
            return cb(error);
        }

        const parsedTimestamp = parseInt(stringFromFile, 10);
        if (isNaN(parsedTimestamp)) {
            return cb(new Error('Timestamp file contains NaN'));
        }

        timestamp = parsedTimestamp;
        return cb(null, timestamp);
    });
};

module.exports.get = () => timestamp;

module.exports.saveTimestamp = (newTimestamp, cb) => {
    // It's unsafe to call multiple writeFile
    // TODO Deal with multiple saves at the same time
    fs.appendFile(HISTORY_FILENAME, timestamp + os.EOL, (_cb) => {});
    timestamp = newTimestamp;
    fs.writeFile(TIMESTAMP_FILENAME, newTimestamp, cb);
};
