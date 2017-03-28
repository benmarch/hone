const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        hone: './src/Hone.js'
    },
    output: {
        path: "./dist",
        filename: "[name].js",
        library: 'hone',
        libraryTarget: 'umd'
    },
    externals: [nodeExternals()],
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            {test: /\.json$/, exclude: /node_modules/, loader: 'json-loader'}
        ]
    }
};
