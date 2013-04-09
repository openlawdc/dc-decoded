var glob = require('glob'),
    fs = require('fs');

var sections = [], titles = [];

glob.sync('json/*.json').map(function(f) {
    JSON.parse(fs.readFileSync(f)).forEach(function(section) {
        var identifier = section.heading && section.heading.identifier;
        identifier = identifier.trim();
        fs.writeFileSync('sections/' + identifier + '.json', JSON.stringify(section));
    });
});
