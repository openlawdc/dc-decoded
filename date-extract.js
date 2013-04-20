var glob = require('glob'),
    dateExtract = require('date-extract'),
    fs = require('fs');

var map = {};

glob.sync('sections/*.json').map(function(f) {
    var enc = JSON.parse(fs.readFileSync(f));
    var identifier = enc.heading.identifier;

    map[identifier] = dateExtract(enc.text + enc.sections.map(function(s) {
        return s.prefix + ': ' + s.text;
    }).join('\n') + ' ' + enc.historical + ' ' + enc.credits);
});

fs.writeFileSync('dates_extracted.json', JSON.stringify(map));
