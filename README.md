## DC Decoded

Tools and middleware to import DC's [Unofficial Code](http://dccouncil.us/UnofficialDCCode)
into [The State Decoded](http://www.statedecoded.com/).

Getting started:

The `Makefile` currently runs through:

1. Downloading the unofficial code to `code.zip`
2. Unzipping into `docs/`
3. Converts docs into HTML with `textutil` (available on Macs)
4. Converts that HTML into parseable XML with `xmlize.py`
5. Converts that XML into structured JSON with `parse.js`

## Running parse.js

This is the meat of the code - it attempts to identify and enforce structure.
This requires [node.js](http://nodejs.org/).

Install:

    npm install

This will install [cheerio](https://github.com/MatthewMueller/cheerio) and
[node-glob](https://github.com/isaacs/node-glob).

Run:

    node text.js
    node parse.js

## Precook

Early versions of the results of this code:

The most useful output so far is [JSON sections (zipped)](https://dl.dropbox.com/u/68059/dccode/sections.zip) (21MB) -
16,569 detected sections (detected with `parse.js`) output into JSON.
These are fast to generate but downloading them lets you skip the Word Doc
to Text to Parsed workflow.

## Requirements

On a basic OSX install with dev tools, you should already have these:

* Make
* Python
* `textutil`
* node.js

## Notes

* [Strong PCRE for identifying citations](https://github.com/statedecoded/law-identifier/blob/master/Washington-DC.md)
