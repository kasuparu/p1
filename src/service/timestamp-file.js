const fs = require('fs');
const FILENAME = 'timestamp';
const ENCODING = 'utf8';

let timestamp;

module.exports.loadTimestamp = (cb) => {
    fs.readFile(FILENAME, ENCODING, (error, stringFromFile) => {
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
    timestamp = newTimestamp;
    // TODO Deal with multiple saves at the same time
    // It's unsafe to call multiple writeFile
    fs.writeFile(FILENAME, newTimestamp, cb);
};
