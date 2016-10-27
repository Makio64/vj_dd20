const webpack = require("webpack");
const path = require('path');

const isProduction = process.argv.indexOf("-p") > -1
const isClassic = process.argv.indexOf("-d") > -1

// ----------------------------------------------------------------------------- PLUGINS

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// const OfflinePlugin = require('offline-plugin');

var plugins = [
	new webpack.DefinePlugin({ isProduction: isProduction }),
	new webpack.ProvidePlugin({
		dat: "dat",
		isMobile: "isMobile",
		THREE: "THREE",
		WAGNER: "WAGNER",
	}),
	new webpack.LoaderOptionsPlugin({
		minimize: isProduction,
		debug: !isProduction
	}),
	new webpack.optimize.CommonsChunkPlugin({children: true, async: true}),
	new webpack.LoaderOptionsPlugin({
		test:/\.(glsl|vs|fs)$/,
		options:{
			glsl: { chunkPath: path.resolve(__dirname,'src/glsl/chunks') }
		}
	})
]
if(isProduction){
	plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
	plugins.push(new webpack.optimize.UglifyJsPlugin({comments:false, compress:{warnings: false} }))
	// plugins.push(new OfflinePlugin({}))
} else {
	if(!isClassic){
		plugins.push(new webpack.HotModuleReplacementPlugin())
	}else{
		plugins.push(new BrowserSyncPlugin({ host: 'localhost', port: 9000, server: { baseDir: ['static','./build'] } }, { reload: true }))
	}
}

// ----------------------------------------------------------------------------- CONFIG

module.exports = {
	devtool: isProduction?false:'source-map',
	entry: [__dirname+"/src/js/Preloader"],
	output: {
		path: path.resolve(__dirname,'build/bin/'),
		filename: 'bundle.js',
		chunkFilename: "[id].bundle.js",
		publicPath: isProduction?'./bin/':'/bin/'
	},
	module: {
		loaders: [
			{ test: /\.json$/, exclude:[/node_modules|vendors/], loader: 'json' },
			{ test: /\.(glsl|vs|fs)$/, exclude:[/node_modules|vendors/], loader: 'shader' },
			{ test: /\.jsx?$/, exclude:[/node_modules|vendors/], loader:'babel', query: {
				presets: [["es2015", { loose: true }], 'stage-0'],
				plugins: ['transform-runtime']
			} },
		],
	},

	resolve: {
		extensions:['.json','.js','.glsl','.vs','.fs'],
		modules: [
			path.resolve(__dirname,'src/js'),
			path.resolve(__dirname,'src/glsl'),
			path.resolve(__dirname,'node_modules'),
			path.resolve(__dirname,'static/vendors'),
		],
		alias: {
			dat: 		path.resolve(__dirname+'/static/vendors/'+"dat.gui.js"),
			isMobile: 	path.resolve(__dirname+'/static/vendors/'+"isMobile.js"),
			THREE: 		path.resolve(__dirname+'/static/vendors/'+"three.js"),
			WAGNER: 	path.resolve(__dirname+'/static/vendors/'+"Wagner.js"),
		}
	},
	devServer: {
		open:true,
		compress:true,
		inline:true,
		https:false,
		noInfo:false,
		port:9000,
		contentBase: ['./static','./build','./src'],
		stats: { colors: true }
	},
	plugins:plugins
};
