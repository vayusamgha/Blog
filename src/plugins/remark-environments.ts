import { visit, SKIP } from "unist-util-visit";
import type { Root, Parent } from "mdast";

const ENV_LABELS: Record<string, string> = {
  theorem: "定理",
  lemma: "引理",
  definition: "定义",
  example: "例",
  remark: "注记",
};

function extractTitle(node: any): string | null {
  const firstChild = node.children?.[0];
  if (firstChild?.data?.directiveLabel) {
    const labelText = collectText(firstChild);
    node.children.shift();
    return labelText || null;
  }
  return null;
}

function collectText(node: any): string {
  if (node.type === "text") return node.value;
  if (node.children) return node.children.map(collectText).join("");
  return "";
}

export default function remarkEnvironments() {
  return (tree: Root) => {
    // Collect all container directives first, then process bottom-up
    // so nested environments are handled correctly (inner before outer).
    const directives: { node: any; index: number; parent: Parent }[] = [];
    visit(tree, "containerDirective", (node: any, index: number | null, parent: Parent | null) => {
      if (parent && index !== null) {
        directives.push({ node, index, parent });
      }
    });

    // Process in reverse order (deepest first)
    for (const { node, index, parent } of directives.reverse()) {
      const name = node.name;
      const label = ENV_LABELS[name];
      if (!label) continue;

      const title = extractTitle(node);
      const titleHtml = title ? ` <span class="env-title">${title}</span>` : "";

      const openHtml = {
        type: "html",
        value: `<div class="env-${name}"><p class="env-header"><strong>${label}</strong>${titleHtml}</p>`,
      };

      const closeHtml = {
        type: "html",
        value: `</div>`,
      };

      parent.children.splice(index, 1, openHtml, ...node.children, closeHtml);
    }
  };
}
