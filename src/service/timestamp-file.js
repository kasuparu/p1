const fs = require('fs');
const FILENAME = 'timestamp';
const ENCODING = 'utf8';

let timestamp;

export const loadTimestamp = (cb) => {
  fs.readFile(FILENAME, 'utf8', (err, stringFromFile) => {
    if (error) {
      return cb(error);
    }

    const parsedTimestamp = parseInt(stringFromFile, 10);
    if (isNan(parsedTimestamp)) {
      return cb(new Error('timestamp file contains NaN'));
    }

    timestamp = parsedTimestamp;
    return cb(null, timestamp);
  });
};

export const get = () => timestamp;

export const saveTimestamp = (newTimestamp, cb) => {
  timestamp = newTimestamp;
  // TODO Deal with multiple saves at the same time
  // It's unsafe to call multiple writeFile
  fs.writeFile(FILENAME, newTimestamp, cb);
};
