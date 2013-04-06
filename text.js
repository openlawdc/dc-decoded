var glob = require('glob'), fs = require('fs'), cheerio = require('cheerio');

glob.sync('xml/*.xml').map(function(f) {
    console.warn('loading ', f);
    $ = cheerio.load(fs.readFileSync(f));
    fs.writeFileSync(f.replace(/xml/g, 'txt'), $('p').map(function(i, elem) {
        return $(this).text();
    }).join('\n'));
});
