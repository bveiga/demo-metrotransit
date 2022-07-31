const prod = process.env.NODE_ENV === 'production';
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: prod ? 'production' : 'development',
	entry: './src/index.tsx',
	output: {
		path: __dirname + '/build/',
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
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ico$/],
				type: 'asset',
				parser: {
				  dataUrlCondition: {
					maxSize: '10000',
				  },
				},
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
		}),
		new MiniCssExtractPlugin(),
	],
};