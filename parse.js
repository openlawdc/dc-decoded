var glob = require('glob'),
    fs = require('fs'),
    cheerio = require('cheerio');

// District of Columbia Official Code 2001 Edition Currentness
// Division I. Government of District.
// Title 1. Government Organization. (Refs &amp; Annos)
// Chapter 1. District of Columbia Government Development.
// Subchapter I. District of Columbia Establishment.
var re = {
    heading: /^§ (\d+)\-(\d+)\.(\d+)?/,
    title: /^Title (\d+)/,
    division: /^Division ([^\.]+)\.(.*)$/,
    chapter: /^Chapter ([^\.]+)\.(.*)$/,
    subchapter: /^Subchapter ([^\.]+)\.(.*)$/,
    part: /Part ([^\.]+)\.(.*)$/,
    subpart: /^Subpart ([^\.]+)\.(.*)$/,
    end: /^END OF DOCUMENT$/,
    notes: /HISTORICAL AND STATUTORY NOTES/,
    credits: /CREDIT\(S\)/,
    formerly: /Formerly cited as (.*)$/
};

function subchapter(txt) {
    if (!txt.match(re.subchapter)) return false;
    var match = txt.match(re.subchapter);
    return {
        identifier: match[1],
        text: match[2].trim(),
        tag: 'subchapter'
    };
}

function formerly(txt) {
    if (!txt.match(re.formerly)) return false;
    var match = txt.match(re.formerly);
    return {
        as: match[1].trim(),
        tag: 'formerly'
    };
}

function chapter(txt) {
    if (!txt.match(re.chapter)) return false;
    var match = txt.match(re.chapter);
    return {
        identifier: match[1],
        text: match[2].trim(),
        tag: 'chapter'
    };
}

function part(txt) {
    if (!txt.match(re.part)) return false;
    var match = txt.match(re.part);
    return {
        identifier: match[1],
        text: match[2].trim(),
        tag: 'part'
    };
}

function subpart(txt) {
    if (!txt.match(re.subpart)) return false;
    var match = txt.match(re.subpart);
    return {
        identifier: match[1],
        text: match[2].trim(),
        tag: 'subpart'
    };
}

function division(txt) {
    if (!txt.match(re.division)) return false;
    var match = txt.match(re.division);
    return {
        identifier: match[1],
        text: match[2].trim(),
        tag: 'division'
    };
}

function end(txt) {
    return !!txt.match(re.end);
}

var chunks = [];

glob.sync('xml/*.xml').map(function(f) {
    console.warn('loading ', f);

    var chunks = [],
        o = { structure: [], text: '' },
        $ = cheerio.load(fs.readFileSync(f));

    var lines = [];
    $('p').each(function(i, elem) {
        lines.push($(this).text());
    });

    for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        var e;

        if (e = formerly(l)) o.structure.push(e);

        if (e = division(l)) o.structure.push(e);

        if (e = chapter(l)) o.structure.push(e);
        if (e = subchapter(l)) o.structure.push(e);

        if (e = part(l)) o.structure.push(e);
        if (e = subpart(l)) o.structure.push(e);

        if (end(l)) {
            chunks.push(o);
            o = { structure: [], text: '' };
        }
    }

    //
    console.log(JSON.stringify(chunks, null, 4));
    throw 'foo';
    //

    fs.writeFileSync(f.replace(/xml/g, 'json'), JSON.stringify(chunks, null, 4));
});
