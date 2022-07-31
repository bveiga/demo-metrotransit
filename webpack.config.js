const prod = process.env.NODE_ENV === 'production';
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: prod ? 'production' : 'development',
	entry: './src/index.tsx',
	output: {
		assetModuleFilename: 'static/media/[name].[ext]',
		filename: 'static/js/[name].js',
		path: __dirname + '/build/',
		clean: true
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				resolve: {
					extensions: ['.ts', '.tsx', '.js', '.json'],
				},
				use: 'ts-loader',
			},
			{
				test: /\.(scss|sass|css)$/,
				use: [
					prod ? MiniCssExtractPlugin.loader : "style-loader" ,
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			}
		]
	},
	performance: {
		maxAssetSize: 500000, // 500 KB
		maxEntrypointSize: 500000
	},
	devtool: prod ? undefined : 'source-map',
	plugins: [
		new HtmlWebpackPlugin({
			template: 'public/index.html',
			favicon: 'public/favicon.ico'
		}),
		new MiniCssExtractPlugin({
			filename: 'static/css/[name].css',
		}),
	],
};