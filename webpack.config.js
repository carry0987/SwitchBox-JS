const path = require('path');

module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, 'src'),
    entry: {switchBox: './switchBox.js'},
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SwitchBox',
        libraryTarget: 'umd',
        globalObject: 'this'
    }
};
