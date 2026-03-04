// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'JLab Documentation',
  tagline: 'Open source Flutter development tools',
  favicon: 'img/favicon.ico',

  // Single URL for the hub
  url: 'https://wonoyu.github.io',
  baseUrl: '/',

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
          // Each project has its own sidebar
          sidebarPath: require.resolve('./sidebar.js'),
          // Edit URL points to source repo
          editUrl: 'https://github.com/wonoyu/jlab-open-source/tree/main/',
          // Show last update time
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
    image: 'img/social-card.jpg',
    
    navbar: {
      title: 'JLab Docs',
      logo: {
        alt: 'JLab Logo',
        src: 'img/logo.svg',
      },
      items: [
        // Dropdown for selecting project
        {
          type: 'docSidebar',
          sidebarId: 'jlabSidebar',
          position: 'left',
          label: 'jlab-flutter-development-kit',
        },
        // Add more projects as dropdown:
        // {
        //   type: 'docsVersionDropdown',
        //   position: 'right',
        // },
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
