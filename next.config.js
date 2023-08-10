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
  reactStrictMode: true,
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh', // 默认语言
  },
};

module.exports = withNextra(nextConfig);
