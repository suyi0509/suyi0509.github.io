import React from 'react';
import { useRouter } from 'next/router';
import { Logo } from '@/components';

const config = {
  project: {
    link: 'https://github.com/suyi0509', // 右上角按钮指向的Url
  },
  // 文档仓库链接
  docsRepositoryBase: 'https://github.com/suyi0509/suyi0509.github.io',
  logo: <Logo />,

  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== '/') {
      return {
        // 设置浏览器标题
        titleTemplate: '%s – 前端博客和笔记',
      };
    }
  },
  // 发现文档错误时，可点击直接去 GitHub 编辑内容
  editLink: {
    text: 'Edit this page on GitHub →',
  },
  // 问题反馈配置，可以自动跳转到 github issue
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback',
  },
  // 页面底部版权信息
  footer: {
    text: `@Sue.`,
  }
};

export default config;
