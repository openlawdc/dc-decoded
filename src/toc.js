var through = require('through');

// extract a table of contents from a stream of tokenized data
module.exports = makeToc;

function makeToc() {
    var i = 0;

    return through(write);

    // title
    // -> chapter
    // --> subchapter
    function write(data) {
        if (data.type && data.match) {
            this.queue([data.match[0], data.type, i]);
        }
        i++;
    }
}
