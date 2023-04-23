"use strict";

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");

const paths = {
    source: path.join(__dirname, "assets/"),
    dist: path.join(__dirname, "pqr/static/dist"),
    style: "style/",
    js: "js/",
};

module.exports = function (env, argv) {
    const jsPath = path.join(paths.source, paths.js);
    const stylePath = path.join(paths.source, paths.style);

    const isProd = argv.mode === "production";
    return {
        entry: {
            main: [
                path.resolve(jsPath, "main.js"),
                path.resolve(stylePath, "main.less")
            ]
        },
        output: {
            filename: "[name].js",
            path: path.resolve(paths.dist),
            clean: true,
        },
        devtool: isProd ? "source-map" : "eval-source-map",
        module: {
            rules: [
                {
                    test: /\.less$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader: "less-loader",
                            options: {
                                lessOptions: {
                                    math: "always",
                                    javascriptEnabled: true,
                                },
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [new MiniCssExtractPlugin({filename: '[name].css'})]
    };
};
