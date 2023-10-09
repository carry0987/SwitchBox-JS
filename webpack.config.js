const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, 'src'),
    entry: {
        switchBox: ['./switchBox.js', './switchBox.css']
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SwitchBox',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].min.css'
        })
    ],
    optimization: {
        minimizer: [
            `...`,
            new CssMinimizerPlugin()
        ]
    }
};
