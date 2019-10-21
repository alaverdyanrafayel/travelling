const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');

/*
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const NoEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
    title: 'Holipay',
    baseUrl: '/',
    isDevServer: helpers.isWebpackDevServer(),
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: HMR
};

module.exports = () => {
    return webpackMerge(commonConfig({ env: ENV }), {
    
        devtool: 'source-map',
        
        entry: {
            app: ['babel-polyfill', helpers.root('client/src')]
        },
    
        output: {
            filename: 'js/[name].js',
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        module: {
            rules: [
                {
                    test: /.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader'
                },
                {
                    test: /\.jsx?$/,
                    include: /client/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.scss$/,
                    exclude: /(node_modules|bower_components)/,
                    use: ['style-loader', 'css-loader','sass-loader']
                }
            ]
        },
        
        devServer: {
            contentBase: helpers.root('client/public'),
            port: METADATA.port,
            host: METADATA.host,
            hot: false,
            open: false,
            inline: true,
            noInfo: true,
            compress: true,
            disableHostCheck: true,
            historyApiFallback: true,
            
        },
    
        plugins: [
    
            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'process.env': {
                    'ENV': JSON.stringify(METADATA.ENV),
                    'NODE_ENV': JSON.stringify(METADATA.ENV),
                    'HMR': METADATA.HMR,
                }
            }),
            
            new NoEmitOnErrorsPlugin(),
            
            new HotModuleReplacementPlugin(),
            
            new DashboardPlugin()
        ]
    });
};
