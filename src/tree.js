var through = require('through');

// Read a stream of 'tokenized' input and infer that sections, articles,
// amendments, and so on continue on, so concatenate their text.
module.exports = through(write);

function write(data) {
    if (!this._section || (data.type && data.type !== this._section.type)) {
        if (this._section) this.queue(this._section);
        this._section = {
            type: data.type,
            match: data.match,
            content: data.text
        };
        this._inType = data.type;
    } else if (this._section) {
        this._section.content += '\n' + data.text;
    }
}
