var _s = require('underscore.string'),
    path = require('path'),
    glob = require('glob'),
    fs = require('fs');


glob.sync('indexes/*.json').map(function(f) {
    var words = {},
        obj = JSON.parse(fs.readFileSync(f, 'utf8')),
        keys = Object.keys(obj),
        trie = {};

    for (var i = 0; i < keys.length; i++) {
        var pos = trie;
        for (var j = 0; j < keys[i].length; j++) {
            if (pos[keys[i][j]] === undefined) {
                pos[keys[i][j]] = {};
            }
            pos = pos[keys[i][j]];
        }
    }
    fs.writeFileSync('tries/' + f.replace(/^indexes\//, ''), JSON.stringify(trie));
});
