var path = require('path');
var webpack = require('webpack')

module.exports = {
    entry: {
        "svga.min": "./src/Canvas/index.js",
        "svgaplus":'./src/svgaplus/index.js',
        // "canvas2webgl":"./src/webgl/index.js",
        // "svga.createjs.min": "./src/CreateJS/index.js",
        // "svga.layabox.min": "./src/LayaBox/index.js",
    },
    output: {
        path: __dirname,
        filename: "build/[name].js",
        libraryTarget: 'umd',
        library: 'SVGA',
    },
    module: {
        rules: [
           /*  {
                test: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', "stage-0"]
                }
            }, */
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['es2015', "stage-0"]
                  }
                }
              },
            {
              test: /\.(png|jpe?g|gif|svga)$/i,
              loader: 'file-loader',
              /* options: {
                name: '[path][name].[ext]',
              }, */
            },
          ],
        /* loaders: [
            {
                test: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', "stage-0"]
                }
            }
        ], */
    },
    plugins: [
        /* new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            output: { comments: false },
        }) */
        ['transform-runtime', {
            "helpers": false,
            "polyfill": false,
            "regenerator": true,
            "moduleName": 'babel-runtime'
          }]
       
    ],
}