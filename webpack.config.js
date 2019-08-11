const path = require('path');

const CopyPlugin = require('copy-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require('dart-sass')
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new CopyPlugin([
            {
                from: './src/ui/index.html',
                to: 'index.html'
            },
            {
                from: './src/ui/background.jpg',
                to: 'background.jpg'
            },
            {
                from: './src/ui/css',
                to: 'css'
            },
            {
                from: './src/ui/font',
                to: 'font'
            },
            {
                from: './src/.env'
            },
            {
                from: './src/ui/modules/calendar/authorization.json'
            }
        ]),
        new MiniCssExtractPlugin({
            filename: 'bundle.css',
            chunkFilename: '[id].css'
        })
    ],
    target: 'electron-renderer'
}