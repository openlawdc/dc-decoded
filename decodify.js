var glob = require('glob'),
    fs = require('fs');

glob.sync('sections/*.json').map(function(f) {
    var dec = {};
    var enc = JSON.parse(fs.readFileSync(f));

    dec.history = enc.historical;
    dec.catch_line = enc.heading.catch_text;
    dec.section = enc.heading.identifier;

    dec.text = enc.text + enc.sections.map(function(s) {
        return s.prefix + ': ' + s.text;
    }).join('\n');

    fs.writeFileSync(
        f.replace(/^sections/, 'decodified'),
        JSON.stringify(dec)
    );
});
