/* eslint-disable @typescript-eslint/explicit-function-return-type */
// shared config (dev and prod)
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
	mode: 'production',
	entry: resolve(__dirname, './src/index.tsx'),
	output: {
		path: resolve(__dirname, './build'),
		publicPath: '/',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		plugins: [new TsconfigPathsPlugin({})],
	},
	cache: {
		type: 'filesystem',
		allowCollectingMemory: true,
		cacheDirectory: resolve(__dirname, '.temp_cache'),
		buildDependencies: {
			// This makes all dependencies of this file - build dependencies
			config: [__filename],
			// By default webpack and loaders are build dependencies
		},
	},

	module: {
		rules: [
			{
				test: [/\.jsx?$/, /\.tsx?$/],
				use: ['babel-loader'],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					'file-loader?hash=sha512&digest=hex&name=img/[chunkhash].[ext]',
					'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
				],
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				use: ['file-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({ template: 'src/index.html.ejs' }),
		new CompressionPlugin({
			exclude: /.map$/,
		}),
		new CopyPlugin({
			patterns: [{ from: resolve(__dirname, 'public/'), to: '.' }],
		}),
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(process.env),
		}),
		new MiniCssExtractPlugin(),
	],
	optimization: {
		chunkIds: 'named',
		concatenateModules: true,
		emitOnErrors: true,
		flagIncludedChunks: true,
		innerGraph: true, //tells webpack whether to conduct inner graph analysis for unused exports.
		mangleWasmImports: true,
		mergeDuplicateChunks: true,
		minimize: true,
		nodeEnv: 'production',
		runtimeChunk: {
			name: (entrypoint) => `runtime~${entrypoint.name}`,
		},
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					compress: true,
					keep_classnames: true,
					keep_fnames: false,
					sourceMap: false,
					safari10: true,
					parse: {
						html5_comments: false,
					},
				},
			}),
			new CssMinimizerPlugin(),
		],
	},
	performance: {
		hints: 'warning',
	},
};

module.exports = config;
