var Tokenizer = require('tokenizer'),
    fs = require('fs'),
    t = new Tokenizer();

t.addRule(/^History$/, 'history');

// Organizational headings
t.addRule(/^\s*Sec\. (\d+)\.\s+$/, 'section');
t.addRule(/^\s*ARTICLE\s+(\w+)$/, 'article');
t.addRule(/^\s*CHAPTER\s+(\d+)$/, 'chapter');
t.addRule(/^\s*TITLE\s+(\d+)$/, 'title');

// // The text of the law
t.addRule(/^\w+$/, 'word');
t.addRule(/^(\.|\,|\-|\;|\(|\)|\/|\:|\"|\')$/, 'punctuation');
t.addRule(/^(\-?[\d]+)$/, 'number');
t.addRule(/^(\s)+$/, 'whitespace');

module.exports = function parse(file) {
    var stream = fs.createReadStream(file, { encoding: 'utf8' });

    stream.pipe(t).on('token', handleToken).on('end', function() {
        console.log('done');
    });

    function handleToken(token, type) {
        console.log(type);
    }
};
