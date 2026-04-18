// Docs home page — redirects to quickstart

import { Redirect } from "@docusaurus/router";

export default function Home() {
  return <Redirect to="/quickstart" />;
}
