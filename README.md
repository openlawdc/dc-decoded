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

## Requirements

On a basic OSX install with dev tools, you should already have these:

* Make
* Python
* `textutil`
* node.js
