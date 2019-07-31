const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/ui/app.tsx',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new CopyPlugin([
            {
                from: './src/ui/index.html',
                to: 'index.html'
            }
        ])
    ],
    target: 'electron-renderer'
}