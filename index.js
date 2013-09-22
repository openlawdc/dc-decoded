var parse = require('./src/parser'),
    minimist = require('minimist')(process.argv.slice(2));

parse(minimist._[0]);
