var glob = require('glob'),
    _ = require('lodash'),
    fs = require('fs');

var sections = [];
var titles = [];

glob.sync('json/*.json').map(function(f) {
    var j = JSON.parse(fs.readFileSync(f));
    sections = sections.concat(j.filter(function(l) {
        return l.heading;
    }).map(function(l) {
        return [l.heading.identifier.replace(/\.$/, ''), l.heading.catch_text];
    }));
    titles = titles.concat(j.filter(function(l) {
        return l.title;
    }).map(function(l) {
        return [l.title.identifier, l.title.text.replace('(Refs & Annos)', '').trim().replace(/\.$/, '')];
    }));
});

var index = {
    sections: sections,
    titles: _.uniq(titles, function(t) {
        return t.join('');
    }).sort(function(a, b) {
        return +a[0] - +b[0];
    })
};

fs.writeFileSync('index.json', JSON.stringify(index, null, 2));
