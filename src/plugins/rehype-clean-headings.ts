/**
 * rehype plugin: remove katex-mathml spans from heading elements (h1–h6).
 *
 * Without this, Astro's `headings[].text` extracts text from MathML
 * annotation + presentation + katex-html, tripling the math text in the TOC.
 * Removing the mathml span leaves only the visible katex-html text.
 */
export default function rehypeCleanHeadings() {
  return (tree: any) => {
    const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

    function walk(node: any) {
      if (!node || !node.children) return;

      if (HEADING_TAGS.has(node.tagName)) {
        // Remove katex-mathml spans from this heading's subtree
        node.children = filterKatexMathml(node.children);
        return; // don't recurse into heading children — already processed
      }

      // Recurse into non-heading elements
      for (const child of node.children) {
        walk(child);
      }
    }

    function filterKatexMathml(nodes: any[]): any[] {
      const result: any[] = [];
      for (const node of nodes) {
        // Skip katex-mathml spans entirely
        if (
          node.type === "element" &&
          node.tagName === "span" &&
          node.properties?.className?.includes("katex-mathml")
        ) {
          continue;
        }
        // Recurse into element children
        if (node.children && Array.isArray(node.children)) {
          node.children = filterKatexMathml(node.children);
        }
        result.push(node);
      }
      return result;
    }

    walk(tree);
  };
}
