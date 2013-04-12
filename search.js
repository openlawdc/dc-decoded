var _s = require('underscore.string'),
    glob = require('glob'),
    fs = require('fs');

var stopwords = JSON.parse(fs.readFileSync('support/stopwords.json')),
    // .concat(JSON.parse(fs.readFileSync('support/stopwords_dc.json'))),
    sidx = {},
    words = {},
    alpha = {},
    titles = 0;

// a fast index of stopwords
stopwords.forEach(function(s) { sidx[s] = true; });

glob.sync('json/*.json').map(function(f) {
    var j = JSON.parse(fs.readFileSync(f));
    var sections = [];
    sections = sections.concat(j.filter(function(l) {
        return l.heading;
    }).map(function(l) {
        return [
            l.heading.identifier.replace(/\.$/, ''),
            l.text + l.sections.map(function(s) {
                return s.text;
            }).join(' ')];
    }));
    sections.forEach(function(f) {
        var id = f[0];
        var w = _s.words(f[1]);
        w.forEach(function(word) {
            word = word.replace(/[^A-Za-z]/g, '').toLowerCase();
            if (word.length > 3 && !(word in sidx)) {
                if (typeof words[word] !== 'object') words[word] = [];
                if (words[word].indexOf(id) === -1) {
                    words[word].push(id);
                }
            }
        });
    });
    for (var w in words) {
        if (!alpha[w[0]]) alpha[w[0]] = {};
        alpha[w[0]][w] = words[w];
    }
    console.log('%d titles done', ++titles);
});

console.log('\ntop words\n---------');
// word frequency, to identify possible stopwords
var l = [];
for (var w in words) {
    l.push([w, words[w].length]);
}
l.sort(function(a, b) {
    return b[1] - a[1];
});
console.log(l.slice(0, 30).map(function(w) {
    return w[1] + '\t' + w[0];
}).join('\n'));

console.log('\n');
console.log(JSON.stringify(l.slice(0, 30).map(function(w) {
    return w[0];
})));
console.log('\n');

// word -> list of ids
for (var a in alpha) {
    fs.writeFileSync('indexes/' + a + '.json', JSON.stringify(alpha[a]));
}
