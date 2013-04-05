var glob = require('glob'),
    fs = require('fs');

function repealed(l) {
    return !!(l.filter(function(_) {
        return _.repealed;
    })).length;
}

glob.sync('json/*.json').map(function(f) {
    var j = JSON.parse(fs.readFileSync(f));
    var output = '<?xml version="1.0" encoding="utf-8"?>\n';
    j.map(function(m) {
        output += '<law>\n';
        output += '<structure>\n';
        m.structure.forEach(function(s) {
            if (s.tag == 'title') {
                output += '\t<unit label="title">' + s.catch_text + '</unit>\n';
            }
            if (s.tag == 'chapter') {
                output += '\t<unit label="chapter">' + s.text + '</unit>\n';
            }
            if (s.tag == 'subchapter') {
                output += '\t<unit label="subchapter">' + s.text + '</unit>\n';
            }
            if (s.tag == 'division') {
                output += '\t<unit label="division">' + s.text + '</unit>\n';
            }
            if (s.tag == 'part') {
                output += '\t<unit label="part">' + s.text + '</unit>\n';
            }
        });

        output += '</structure>\n';
        output += '<text>\n';

        m.sections.forEach(function(s) {
            if (s.prefix) {
                output += '<section prefix="' + s.prefix + '">\n';
            } else {
                output += '<section>\n';
            }
            output += s.text;
            output += '</section>\n';
        });

        if (m.history) {
            output += '<history>\n';
            output += m.history;
            output += '\n</history>\n';
        }

        if (repealed(m.structure)) {
            output += '<metadata><repealed>y</repealed></metadata>\n';
        }

        output += '</law>\n';
    });
    fs.writeFileSync(f.replace(/^json/, 'decoded').replace('json', 'xml'), output);
});
