const complier = require('./complier.js');

module.exports = function(source) {
    const callback = this.async();
    complier.parse(source).then(result => {
        const { code } = result;
        callback(null, code)
    });
}
