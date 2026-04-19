// Docusaurus 3 configuration for FlyPush docs

import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "FlyPush",
  tagline: "Fast, multiplatform push notifications at any scale",
  favicon: "img/favicon.ico",
  staticDirectories: ["static"],
  url: "https://docs.flypush.io",
  baseUrl: "/",
  organizationName: "flypush",
  projectName: "flypush-docs",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: { defaultLocale: "en", locales: ["en"] },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
          editUrl: "https://github.com/flypush-io/flypush-docs/tree/main/",
        },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
        gtag: { trackingID: "G-PLACEHOLDER", anonymizeIP: true },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: { defaultMode: "dark", disableSwitch: false, respectPrefersColorScheme: true },
    image: "img/social-card.png",
    navbar: {
      title: "FlyPush",
      logo: { alt: "FlyPush", src: "img/logo.svg" },
      items: [
        { type: "docSidebar", sidebarId: "docs", position: "left", label: "Docs" },
        { to: "/api-reference/authentication", position: "left", label: "API Reference" },
        { to: "/sdks/node", position: "left", label: "SDKs" },
        { href: "https://flypush.io", label: "Dashboard", position: "right" },
        { href: "https://github.com/flypush-io", label: "GitHub", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Quickstart", to: "/quickstart" },
            { label: "API Reference", to: "/api-reference/authentication" },
            { label: "Concepts", to: "/concepts/architecture" },
          ],
        },
        {
          title: "SDKs",
          items: [
            { label: "Node.js", to: "/sdks/node" },
            { label: "Python", to: "/sdks/python" },
            { label: "Go", to: "/sdks/go" },
            { label: "iOS", to: "/guides/ios" },
            { label: "Android", to: "/guides/android" },
          ],
        },
        {
          title: "Company",
          items: [
            { label: "Website", href: "https://flypush.io" },
            { label: "Dashboard", href: "https://app.flypush.io" },
            { label: "Status", href: "https://status.flypush.io" },
            { label: "Email", href: "mailto:hi@flypush.io" },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} FlyPush. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "kotlin", "swift", "python", "go", "php", "ruby"],
    },
    algolia: {
      appId: "PLACEHOLDER",
      apiKey: "PLACEHOLDER",
      indexName: "flypush",
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
