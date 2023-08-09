const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  // 给文档中的代码块添加 copy 能力
  defaultShowCopyCode: true,
  images: {
    loader: 'akamai',
    path: '',
  },
  // 支持 latex
  // latex: true,
  // 支持静态图片
  // staticImage: true,
});

const nextConfig = {
  // next 工程本身配置内容
  reactStrictMode: true,
};

module.exports = withNextra(nextConfig);
