const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/switchBox.js',
    output: {
        filename: 'switchbBox.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SwitchBox',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
