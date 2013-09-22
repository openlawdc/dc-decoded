var Tokenizer = require('tokenizer'),
    fs = require('fs'),
    t = Tokenizer(function() {
        // console.log(arguments);
    });

t.addRule(/^History$/, 'history');

// Organizational headings
t.addRule(/^\s*Sec\. (\d+)\.\s+$/, 'section');
t.addRule(/^\s*ARTICLE\s+(\w+)$/, 'article');
t.addRule(/^\s*CHAPTER\s+(\d+)$/, 'chapter');
t.addRule(/^\s*TITLE\s+(\d+)$/, 'title');

// text of the law
t.addRule(/^([\r|\n]*)$/, 'space');
t.addRule(/^(.*)$/, 'anything');

module.exports = function parse(file) {
    var stream = fs.createReadStream(file, { encoding: 'utf8' });

    stream.pipe(t).on('token', handleToken).on('end', function() {
        console.log('done');
    }).on('error', function() {
        console.log(arguments);
    });
    //
    // stream.on('data', function(chunk) {
    //     console.log(chunk.toString());
    // });

    function handleToken(token, type) {
        if (type !== 'space' && type !== 'anything') {
            console.log(token.toString());
        }
    }
};
