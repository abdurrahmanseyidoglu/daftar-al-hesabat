import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

function getStaticRoutes(dir: string, baseDir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const fullPath = path.join(dir, entry.name);
    const routeSegment = entry.name;

    // Skip special Next.js folders
    if (["api", "_", "("].some((skip) => routeSegment.startsWith(skip)))
      continue;
    // Skip dynamic segments like [slug]
    if (routeSegment.startsWith("[")) continue;

    const hasPage =
      fs.existsSync(path.join(fullPath, "page.tsx")) ||
      fs.existsSync(path.join(fullPath, "page.ts")) ||
      fs.existsSync(path.join(fullPath, "page.jsx")) ||
      fs.existsSync(path.join(fullPath, "page.js"));

    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

    if (hasPage) routes.push(`/${relativePath}`);

    // Recurse
    routes.push(...getStaticRoutes(fullPath, baseDir));
  }

  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ledger-notebook.vercel.app";
  const appDir = path.join(process.cwd(), "app");

  const staticRoutes = getStaticRoutes(appDir, appDir).map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Add root
  const root = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  };

  return [root, ...staticRoutes];
}
