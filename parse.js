var glob = require('glob'),
    fs = require('fs'),
    cheerio = require('cheerio');

// District of Columbia Official Code 2001 Edition Currentness
// Division I. Government of District.
// Title 1. Government Organization. (Refs &amp; Annos)
// Chapter 1. District of Columbia Government Development.
// Subchapter I. District of Columbia Establishment.
var re = {
    heading: /^((§\s)?)([0-9]{1,2})([A-Z]?)-([0-9]{3,4})((((\.)([0-9]{2}))?)([a-z]?))\.?(.*)$/,
    title: /^Title (\d+)/,
    division: /^Division ([^\.]+)\.(.*)$/,
    chapter: /^Chapter ([^\.]+)\.(.*)$/,
    subchapter: /^Subchapter ([^\.]+)\.(.*)$/,
    part: /Part ([^\.]+)\.(.*)$/,
    subpart: /^Subpart ([^\.]+)\.(.*)$/,
    end: /^END OF DOCUMENT$/,
    section: /^\(([0-9a-zA-Z])+\)(.*)/,
    notes: /HISTORICAL AND STATUTORY NOTES/,
    credits: /CREDIT\(S\)/,
    formerly: /Formerly cited as (.*)$/
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

function notes(txt) {
    return !!txt.match(re.notes);
}

var chunks = [];

function preprocess(o) {
    var heading = o.structure.filter(function(s) {
        return s.tag == 'heading';
    });
    if (heading.length && heading[0].catch_text.match(/\[Repealed\]/)) {
        o.structure.push({
            repealed: true
        });
    }
    return o;
}

glob.sync('xml/*.xml').map(function(f) {
    console.warn('loading ', f);

    var chunks = [],
        o = { structure: [], sections: [{text:''}] },
        $ = cheerio.load(fs.readFileSync(f));

    var lines = [];
    $('p').each(function(i, elem) {
        lines.push($(this).text());
    });

    for (var i = 0; i < lines.length; i++) {
        var l = lines[i].trim();
        var e;

        if      (e = formerly(l)) o.structure.push(e);
        else if (e = heading(l)) o.structure.push(e);
        else if (e = division(l)) o.structure.push(e);
        else if (e = chapter(l)) o.structure.push(e);
        else if (e = subchapter(l)) o.structure.push(e);
        else if (e = part(l)) o.structure.push(e);
        else if (e = subpart(l)) o.structure.push(e);
        else if (end(l)) {
            chunks.push(preprocess(o));
            o = { structure: [], sections: [{text:''}] };
        }
        else if (section(l)) {
            o.sections.push(section(l));
        }
        else if (notes(l)) {
            o.history = '';
            // fast-forward through historical notes. this needs to be revised
            // to catch the restatement of the law's headed and its effective
            // date
            for (; i < lines.length; i++) {
                l = lines[i].trim();
                if (end(l)) {
                    chunks.push(preprocess(o));
                    o = { structure: [], sections: [{text:''}] };
                    break;
                } else {
                    o.history += l + '\n';
                }
            }
        }
        else {
            o.sections[o.sections.length-1].text += l + '\n';
        }
    }

    //
    // console.log(JSON.stringify(chunks, null, 4));
    // throw 'foo';
    //

    fs.writeFileSync(f.replace(/xml/g, 'json'), JSON.stringify(chunks, null, 4));
});
