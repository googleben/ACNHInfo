const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "/src/index.tsx",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.(tsx?)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass")
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|png)$/i,
                type: "asset/resource"
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', ".json"],
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, "dist"),
        filename: "index.[contenthash].js",
        assetModuleFilename: (pathData) => {
            if (/\.png$/g.test(pathData.filename)) return "images/[name].[contenthash].png";
            if (/\.(eot|svg|ttf|woff)$/g.test(pathData.filename)) return "fonts/[name].[contenthash][ext]";
            return "[base]";
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            title: "ACNHInfo",
            favicon: "./src/favicon.ico"
        })
    ]
}