var fs = require('fs'),
    tree = require('./tree'),
    toc = require('./toc'),
    JSONStream = require('JSONStream'),
    split = require('split');

var matcher = Matcher([
    ['section', /^\s*Sec\. (\d+)\.\s+(.*)$/],
    ['section', /^\s*(\d+)\-(\d+)\s*$/],
    ['article', /^\s*ARTICLE\s+(\w+)$/],
    ['amendment', /^\s*AMENDMENT/],
    ['history', /^History$/],
    ['annotations', /^Annotations$/],
    ['chapter', /^\s*CHAPTER\s+(\w+)$/],
    ['subchapter', /^\s*SUBCHAPTER\s+(\w+)$/],
    ['title', /^\s*TITLE\s+(\w+)$/],
    ['part', /^\s*PART\s+(\w+)$/]
]);

module.exports = function parse(file) {
    var stream = fs.createReadStream(file, { encoding: 'utf8' });

    var classifiedStream = stream
        .pipe(split(classify));

    var treeStream = classifiedStream.pipe(tree);

    treeStream.pipe(JSONStream.stringify())
        .pipe(fs.createWriteStream('all.json'));

    treeStream.pipe(toc())
        .pipe(JSONStream.stringify())
        .pipe(fs.createWriteStream('toc.json'));
};

function classify(txt) {
    return matcher(txt);
}

function Matcher(res) {
    return function(txt) {
        var match;
        for (var i = 0; i < res.length; i++) {
            match = txt.match(res[i][1]);
            if (match) return {
                type: res[i][0],
                match: match,
                text: txt
            };
        }
        return {
            text: txt
        };
    };
}
