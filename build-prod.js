var clean = require('./build-prod/clean');
var build = require('./build-prod/build');

clean().then(() => {
    console.info('clean success!\nbuilding and bundling...');
    return build();
}).then(hash => {
    console.info('build success with hash ', hash, '\n');
}).catch(err => {
    console.error('here\'s a fucking error:', err.join('\n'), '\n');
})