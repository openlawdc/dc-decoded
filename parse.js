var glob = require('glob'),
    fs = require('fs'),
    cheerio = require('cheerio');

var heading = /^§ (\d+)\-(\d+)\.(\d+)?/;

var chunks = [];

function makeChunk() {
    return {
        title: '',
        text: '',
        section: '',
        subsection: '',
        subsubsection: ''
    };
}

glob.sync('xml/*.xml').map(function(f) {
    console.warn('loading ', f);
    var chunk = makeChunk();
    var $ = cheerio.load(fs.readFileSync(f));
    $('p').each(function(i, elem) {
        var txt = $(this).text();
        var match = txt.match(heading);
        if (match) {
            chunks.push(chunk);
            chunk = makeChunk();
            chunk.section = match[1];
            chunk.subsection = match[2];
            chunk.subsubsection = match[3];
            chunk.title = txt;
        }
        chunk.text += txt + '\n';
    });
    fs.writeFileSync(f.replace(/xml/g, 'json'), JSON.stringify(chunks, null, 4));
});
