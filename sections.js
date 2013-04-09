var glob = require('glob'),
    fs = require('fs');

var n = 0;

glob.sync('json/*.json').map(function(f) {
    JSON.parse(fs.readFileSync(f)).forEach(function(section) {
        var identifier = section.heading && section.heading.identifier;
        if (identifier) {
            fs.writeFileSync('sections/' + identifier + '.json', JSON.stringify(section));
            n++;
        }
    });
});

console.warn('%s sections saved', n);
