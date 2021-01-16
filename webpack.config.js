const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'eval-sourse-map',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        port: 4200
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        publicPath: "public",
        filename: "bundle.js",
        path: path.resolve(__dirname, 'public')
    }
}
