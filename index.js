var glob = require('glob'),
    _ = require('lodash'),
    fs = require('fs');

var index = [];

glob.sync('json/*.json').map(function(f) {
    var j = JSON.parse(fs.readFileSync(f));
    index = index.concat(j.filter(function(l) {
        return l.heading;
    }).map(function(l) {
        return [l.heading.identifier, l.heading.catch_text];
    }));
});

fs.writeFileSync('index.json', JSON.stringify(index, null, 2));
