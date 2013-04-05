var glob = require('glob'),
    print = require('printf');
    encode = require('entities').encode,
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
                output += print('\t<unit label="title"></unit>\n', s.catch_text);
            }
            if (s.tag == 'chapter') {
                output += print('\t<unit identifier="%s" label="chapter">%s</unit>\n', s.identifier, s.text);
            }
            if (s.tag == 'subchapter') {
                output += print('\t<unit identifier="%s" label="subchapter">%s</unit>\n', s.identifier, s.text);
            }
            if (s.tag == 'division') {
                output += print('\t<unit identifier="%s" label="division">%s</unit>\n', s.identifier, s.text);
            }
            if (s.tag == 'part') {
                output += print('\t<unit identifier="%s" label="part">%s</unit>\n', s.identifier, s.text);
            }
        });

        output += '</structure>\n';
        output += '<text>\n';

        m.sections.forEach(function(s) {
            if (s.prefix) {
                output += print('<section prefix="%s">\n', s.prefix);
            } else {
                output += '<section>\n';
            }
            output += encode(s.text);
            output += '\n</section>\n';
        });

        output += '</text>\n';

        if (m.history) {
            output += '<history>\n';
            output += encode(m.history);
            output += '\n</history>\n';
        }

        if (repealed(m.structure)) {
            output += '<metadata><repealed>y</repealed></metadata>\n';
        }

        output += '</law>\n';
    });
    fs.writeFileSync(f.replace(/^json/, 'decoded').replace('json', 'xml'), output);
});
