const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
function resolve(name) {
    return path.resolve(__dirname, name);
}


module.exports = {
    entry: resolve('./src/index.js'),
    output: {
        path: resolve('./dist'),
        filename: '[name].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.wzb$/,
                use: [
                    // {
                    //     loader: 'pre-loader',
                    // },
                    {
                        loader: 'wzb-loader',
                    }
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve('./src/index.html'),
        })
    ],
    resolveLoader: {
        modules: ['node_modules', resolve('./src/loaders')],
    },
    optimization: {
        minimize: false,
    }
}