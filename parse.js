var glob = require('glob'),
    _ = require('lodash'),
    fs = require('fs'),
    cheerio = require('cheerio');

// District of Columbia Official Code 2001 Edition Currentness
// Division I. Government of District.
// Title 1. Government Organization. (Refs &amp; Annos)
// Chapter 1. District of Columbia Government Development.
// Subchapter I. District of Columbia Establishment.
//
// § 1-101. Territorial area.
var re = {
    start: /District of Columbia Official Code 2001 Edition Currentness/,
    title: /^Title (\d+)/,
    division: /^Division ([^\.]+)\.(.*)$/,
    chapter: /^Chapter ([^\.]+)\.(.*)$/,
    subchapter: /^Subchapter ([^\.]+)\.(.*)$/,
    part: /Part ([^\.]+)\.(.*)$/,
    subpart: /^Subpart ([^\.]+)\.(.*)$/,
    heading: /^((§\s)?)([0-9]{1,2})([A-Z]?)-([0-9]{3,4})((((\.)([0-9]{2}))?)([a-z]?))\.?(.*)$/,
    section: /^\(([0-9a-zA-Z])+\)(.*)/,
    historical: /HISTORICAL AND STATUTORY NOTES/,
    credits: /CREDIT\(S\)/,
    formerly: /Formerly cited as (.*)$/,
    end: /^END OF DOCUMENT$/,
    empty: /^\s*$/
};

// sections tend to go
//
// a
// b
//   1
//     A
//   2
//     A
//     B
//
// And so on

function heading(txt) {
    if (!txt.match(re.heading)) return false;
    var match = txt.match(re.heading);
    return {
        tag: 'heading',
        title: match[3],
        chapter: match[10],
        catch_text: match[12].trim()
    };
}

function section(txt) {
    if (!txt.match(re.section)) return false;
    var match = txt.match(re.section);
    return {
        prefix: match[1],
        text: match[2]
    };
}

function title(txt) {
    if (!txt.match(re.title)) return false;
    var match = txt.match(re.title);
    return {
        identifier: match[1],
        tag: 'title'
    };
}

function subchapter(txt) {
    if (!txt.match(re.subchapter)) return false;
    var match = txt.match(re.subchapter);
    return {
        tag: 'subchapter',
        identifier: match[1],
        text: match[2].trim()
    };
}

function formerly(txt) {
    if (!txt.match(re.formerly)) return false;
    var match = txt.match(re.formerly);
    return {
        as: match[1].trim()
    };
}

function chapter(txt) {
    if (!txt.match(re.chapter)) return false;
    var match = txt.match(re.chapter);
    return {
        tag: 'chapter',
        identifier: match[1],
        text: match[2].trim()
    };
}

function part(txt) {
    if (!txt.match(re.part)) return false;
    var match = txt.match(re.part);
    return {
        tag: 'part',
        identifier: match[1],
        text: match[2].trim()
    };
}

function subpart(txt) {
    if (!txt.match(re.subpart)) return false;
    var match = txt.match(re.subpart);
    return {
        tag: 'subpart',
        identifier: match[1],
        text: match[2].trim()
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

function start(txt) { return !!txt.match(re.start); }
function end(txt) { return !!txt.match(re.end); }
function historical(txt) { return !!txt.match(re.historical); }
function empty(txt) { return !!txt.match(re.empty); }
function credits(txt) { return !!txt.match(re.credits); }

var laws = [];

function template() {
    return {
        text: '',
        historical: '',
        credits: '',
        sections: []
    };
}

glob.sync('xml/*.xml').map(function(f) {
    console.warn('loading ', f);

    var laws = [],
        law = template(),
        $ = cheerio.load(fs.readFileSync(f));

    var lines = [];
    $('p').each(function(i, elem) {
        lines.push($(this).text());
    });

    for (var i = 0; i < lines.length;) {
        var l = lines[i].trim();

        // start a law
        if (start(l)) {
            l = lines[++i].trim();

            // structure
            while (structure = (heading(l) ||
                division(l) ||
                title(l) ||
                chapter(l) ||
                subchapter(l) ||
                part(l) ||
                empty(l) ||
                subpart(l))) {
                if (structure.tag) {
                    law[structure.tag] = _.omit(structure, 'tag');
                }
                l = lines[++i].trim();
            }

            // text and sections
            while (!(historical(l) || end(l) || credits(l))) {
                // TODO: sections
                if (section(l)) {
                    law.sections.push(section(l));
                } else {
                    law.text += l + '\n';
                }
                l = lines[++i].trim();
            }

            // credits
            if (credits(l)) {
                l = lines[++i].trim();
                while (!(end(l) || historical(l))) {
                    law.credits += l + '\n';
                    l = lines[++i].trim();
                }
            }

            // historical notes
            if (historical(l)) {
                l = lines[++i].trim();
                while (!end(l)) {
                    law.historical += l + '\n';
                    l = lines[++i].trim();
                }
            }
        }

        // we're done with this law
        if (end(l)) {
            // console.log(law);
            // throw 'e';
            laws.push(law);
            law = template();
        }

        i++;
    }

    fs.writeFileSync(f.replace(/xml/g, 'json'), JSON.stringify(laws, null, 4));
});
