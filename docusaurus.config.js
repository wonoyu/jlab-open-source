// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'JLab Documentation',
  tagline: 'Open source Flutter development tools',
  favicon: 'img/favicon.ico',

  // URL configuration - base URL should include repo name
  url: 'https://wonoyu.github.io',
  baseUrl: '/jlab-open-source/',

  // Handle multiple projects
  organizationName: 'wonoyu',
  projectName: 'jlab-open-source',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebar.js'),
          editUrl: 'https://github.com/wonoyu/jlab-flutter-development-kit/tree/main/docs/',
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'JLab',
      items: [
        // Home - JLab Open Source
        {
          to: '/',
          label: 'JLab Open Source',
          position: 'left',
        },
        // Docs - JLab FDK
        {
          type: 'docSidebar',
          sidebarId: 'jlabSidebar',
          position: 'left',
          label: 'JLab FDK',
        },
        {
          href: 'https://github.com/wonoyu/jlab-open-source',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} JLab. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

module.exports = config;
