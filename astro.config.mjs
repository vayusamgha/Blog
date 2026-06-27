import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import remarkEnvironments from "./src/plugins/remark-environments.ts";
import rehypeKatex from "rehype-katex";
import rehypeCleanHeadings from "./src/plugins/rehype-clean-headings.ts";

export default defineConfig({
  site: "https://vayusamgha.github.io",
  base: "/Blog",
  markdown: {
    remarkPlugins: [remarkMath, remarkDirective, remarkEnvironments],
    rehypePlugins: [rehypeKatex, rehypeCleanHeadings],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
