const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  // 给文档中的代码块添加 copy 能力
  defaultShowCopyCode: true,
  // 支持 latex
  latex: true,
  // 支持静态图片
  staticImage: true,
});

const nextConfig = {
  // next 工程本身配置内容
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // i18n: {
  // locales: ['zh', 'en'],
  // defaultLocale: 'zh', // 默认语言
  // },
  // webpack: (config) => {
  //   config.module.rules.push({
  //     test: /\.scss$/,
  //     use: [
  //       'style-loader', // 将 JS 字符串生成为 style 节点
  //       'css-loader', // 将 CSS 转化成 CommonJS 模块
  //       'sass-loader', // 将 Sass 编译成 CSS，需要`node-sass`或`sass`
  //     ],
  //   });
    
  //   return config;
  // },
};

module.exports = withNextra(nextConfig);
