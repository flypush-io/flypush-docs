// Sidebar configuration

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    { type: "doc", id: "quickstart", label: "Quickstart" },
    {
      type: "category",
      label: "Platform Guides",
      collapsed: false,
      items: [
        "guides/ios",
        "guides/android",
        "guides/web",
        "guides/react-native",
        "guides/flutter",
      ],
    },
    {
      type: "category",
      label: "API Reference",
      collapsed: false,
      items: [
        "api-reference/authentication",
        "api-reference/notifications",
        "api-reference/devices",
        "api-reference/topics",
        "api-reference/segments",
        "api-reference/analytics",
        "api-reference/webhooks",
      ],
    },
    {
      type: "category",
      label: "Server SDKs",
      items: ["sdks/node", "sdks/python", "sdks/go"],
    },
    {
      type: "category",
      label: "Concepts",
      items: [
        "concepts/architecture",
        "concepts/android-transport",
        "concepts/scale",
      ],
    },
    { type: "doc", id: "changelog", label: "Changelog" },
  ],
};

export default sidebars;
