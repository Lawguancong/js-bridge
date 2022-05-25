// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/vsDark');
const darkCodeTheme = require('prism-react-renderer/themes/oceanicNext');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ruqi-jsbridge文档',
  tagline: '如祺Hybrid-App交互sdk',
  url: 'https://webio-1258234669.cos-website.ap-guangzhou.myqcloud.com', // todo
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ruqi', // Usually your GitHub org/user name.
  projectName: 'ruqi-jsbridge', // Usually your repo name.

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'http://gitlab.ruqimobility.local/frontend/ruqi-jsbridge/-/tree/master/docusaurus/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'jsbridge',
        logo: {
          alt: 'ruqi-jsbridge',
          src: 'https://ruqi-static.ruqimobility.com/pic_image/20211116063930__Q9BFF9SQ.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'usage',
            position: 'left',
            label: '使用文档',
          },
          {
            href: 'http://gitlab.ruqimobility.local/frontend/ruqi-jsbridge',
            label: 'Gitlab',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
