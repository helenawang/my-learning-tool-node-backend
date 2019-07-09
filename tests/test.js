const fs = require('fs');
fs.readFile('./data_backup.json', (err, data) => {
    if (err) console.error(err);
    console.log(JSON.parse(data).questions);
});