/**
 * 所有 Webpack 配置文件的公共属性、方法
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const px2Rem = require('postcss-plugin-px2rem');


/**
 * webpack 环境变量
 */
const webpackEnv = {
    isEnvDevelopment: process.env.NODE_ENV === 'development',
    isEnvProduction: process.env.NODE_ENV === 'production',
    isEnvSpeedMeasurement: process.env.SPEED_MEASUREMENT,
};

/**
 * 样式文件正则匹配
 */
const styleRegex = {
    cssRegex: /\.css$/,
    cssModuleRegex: /\.module\.css$/,
    lessRegex: /\.less$/,
    lessModuleRegex: /\.module\.less$/,
    sassRegex: /\.(scss|sass)$/,
    sassModuleRegex: /\.module\.(scss|sass)$/,
};


/**
 * function to get style loaders
 * @param options
 * @param preProcessor
 */
const getBaseStyleLoaders = (options, preProcessor) => {
    options = options ? options : {
        cssModule: false
    };
    const loaders = [
        webpackEnv.isEnvDevelopment && 'style-loader',
        webpackEnv.isEnvProduction && MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: options.cssModule ? {
                // localsConvention: 'camelCase',
                modules: {
                    localIdentName: '[local]--[hash:base64:6]'
                },
            } : {}
        },
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        px2Rem({
                            rootValue: 75, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
                            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
                            //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
                            // propBlackList: [], //黑名单
                            exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
                            // selectorBlackList: [], //要忽略并保留为px的选择器
                            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
                            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
                            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
                            minPixelValue: 2 //设置要替换的最小像素值(3px会被转rem)。 默认 0
                        }),
                        require('autoprefixer')
                    ]
                }
            }
        },
    ].filter(Boolean);

    if (preProcessor) {
        loaders.push(preProcessor);
    }
    return loaders;
};

/**
 * 获取公共的 style loaders（可选择是否在项目中开启使用 less/sass）
 * @param options
 */
const getStyleLoaders = (options) => {
    options = options ? options : {
        cssModule: false,
    };
    return [
        {
            test: styleRegex.cssRegex,
            exclude: [styleRegex.cssModuleRegex],
            // exclude: /node_modules/,
            use: getBaseStyleLoaders(),
        },
        {
            test: styleRegex.cssModuleRegex,
            use: getBaseStyleLoaders({cssModule: options.cssModule}),
        },
        {
            test: styleRegex.lessRegex,
            exclude: [styleRegex.lessModuleRegex],
            use: getBaseStyleLoaders(null, 'less-loader'),
        },
        {
            test: styleRegex.lessModuleRegex,
            use: getBaseStyleLoaders({cssModule: options.cssModule}, 'less-loader'),
        },
        {
            test: styleRegex.sassRegex,
            exclude: [styleRegex.sassModuleRegex],
            use: getBaseStyleLoaders(null, 'sass-loader'),
        },
        {
            test: styleRegex.sassModuleRegex,
            use: getBaseStyleLoaders({cssModule: options.cssModule}, 'sass-loader'),
        }
    ];
};

module.exports = {
    webpackEnv,
    styleRegex,
    getStyleLoaders
};
