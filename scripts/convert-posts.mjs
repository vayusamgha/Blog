#!/usr/bin/env node
/**
 * convert-posts.mjs
 *
 * 将 mypost/ 中的 .md/.tex 文件转为博客文章，推送到 src/content/posts/。
 * - .md 文件：自动补全 frontmatter（标题、日期、标签、摘要），复制到 posts/
 * - .tex 文件：转换为 Markdown，定理环境用 ::: 语法，数学公式保留为 KaTeX，
 *   然后补全 frontmatter
 * - 处理完后删除 mypost/ 中的原文件
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const MYPOST = path.join(REPO_ROOT, "mypost");
const POSTS  = path.join(REPO_ROOT, "src/content/posts");

// ─── 定理环境 ─────────────────────────────────────────────────────────────────
const ENV_TYPES = ["theorem", "lemma", "definition", "example", "remark"];

// ─── 工具函数 ────────────────────────────────────────────────────────────────

function todayDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function safeFilename(name) {
  return name.replace(/[^a-zA-Z0-9\u4e00-\u9fff\-_]/g, "").trim().replace(/\s+/g, "-") || "untitled";
}

// ─── TeX → Markdown 转换 ─────────────────────────────────────────────────────

function parseEnvPairs(lines) {
  const pairs = [];
  const stack = [];
  for (let i = 0; i < lines.length; i++) {
    const begin = lines[i].match(/\\begin\{(\w+)\}(?:\s*\[([^\]]*)\])?/);
    const end   = lines[i].match(/\\end\{(\w+)\}/);
    if (begin && ENV_TYPES.includes(begin[1])) {
      const node = { start: i, end: -1, name: begin[1], title: begin[2] || "", children: [] };
      pairs.push(node);
      if (stack.length > 0) stack.at(-1).children.push(node);
      stack.push(node);
    }
    if (end && ENV_TYPES.includes(end[1]) && stack.length > 0 && stack.at(-1).name === end[1]) {
      stack.at(-1).end = i;
      stack.pop();
    }
  }
  return pairs;
}

function texToMarkdown(tex) {
  // 1. 清理 LaTeX 前导
  let body = tex
    .replace(/^\\documentclass[^\n]*\n?/gm, "")
    .replace(/^\\usepackage[^\n]*\n?/gm, "")
    .replace(/^\\input[^\n]*\n?/gm, "")
    .replace(/\\begin\{document\}/g, "")
    .replace(/\\end\{document\}/g, "");

  // 2. 提取标题
  let title = "";
  const titleMatch = body.match(/\\title\{([^}]*)\}/);
  if (titleMatch) {
    title = titleMatch[1].trim();
    body = body.replace(/\\title\{[^}]*\}\s*/, "");
  }

  // 3. 多行数学环境 → $$...$$
  const mathEnvs = ["align", "align*", "equation", "equation*", "gather", "gather*", "multline", "multline*"];
  for (const env of mathEnvs) {
    const re = new RegExp(
      `\\\\begin\\{${env.replace("*", "\\*")}\\}([\\s\\S]*?)\\\\end\\{${env.replace("*", "\\*")}\\}`,
      "g"
    );
    body = body.replace(re, (_, inner) => "$$\n" + inner.trim() + "\n$$");
  }

  // 4. 定理环境转换（带嵌套检测）
  const lines = body.split("\n");
  const pairs = parseEnvPairs(lines);
  const startMap = new Map(pairs.map((p) => [p.start, p]));
  const resultLines = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (startMap.has(i)) {
      const node = startMap.get(i);
      const hasChildren = node.children.length > 0;
      resultLines.push(`${hasChildren ? "::::" : ":::"}${node.name}${node.title ? `[${node.title}]` : ""}`);
      i++;
      continue;
    }
    const endMatch = line.match(/\\end\{(\w+)\}/);
    if (endMatch && ENV_TYPES.includes(endMatch[1])) {
      const openNode = pairs.find((p) => p.end === i);
      if (openNode) resultLines.push(openNode.children.length > 0 ? "::::" : ":::");
      i++;
      continue;
    }
    const pb = line.match(/\\begin\{proof\}(?:\s*\[([^\]]*)\])?/);
    if (pb) { resultLines.push(`**证明${pb[1] ? `（${pb[1]}）` : ""}**`); i++; continue; }
    if (line.match(/\\end\{proof\}/)) { resultLines.push("∎"); i++; continue; }
    resultLines.push(line);
    i++;
  }

  let md = resultLines.join("\n");

  // 5. 全局正则替换
  md = md.replace(/\\\[/g, "$$").replace(/\\\]/g, "$$");
  md = md.replace(/\\section\*?\{([^}]*)\}/g, "## $1");
  md = md.replace(/\\subsection\*?\{([^}]*)\}/g, "### $1");
  md = md.replace(/\\subsubsection\*?\{([^}]*)\}/g, "#### $1");
  md = md.replace(/\\paragraph\*?\{([^}]*)\}/g, "**$1**");
  md = md.replace(/\\textbf\{([^}]*)\}/g, "**$1**");
  md = md.replace(/\\textit\{([^}]*)\}/g, "*$1*");
  md = md.replace(/\\emph\{([^}]*)\}/g, "*$1*");
  md = md.replace(/\\underline\{([^}]*)\}/g, "<u>$1</u>");

  // 非数学行中清理引用/标签
  const cleanedLines = md.split("\n").map((ln) => {
    if (ln.trim().startsWith("$$")) return ln;
    return ln
      .replace(/\\label\{[^}]*\}/g, "")
      .replace(/\\ref\{[^}]*\}/g, "")
      .replace(/\\eqref\{[^}]*\}/g, "")
      .replace(/\\pageref\{[^}]*\}/g, "")
      .replace(/\\cite\{[^}]*\}/g, "");
  });
  md = cleanedLines.join("\n");

  // 列表基础支持
  md = md.replace(/\\begin\{itemize\}\s*/g, "");
  md = md.replace(/\\end\{itemize\}\s*/g, "");
  md = md.replace(/\\begin\{enumerate\}\s*/g, "");
  md = md.replace(/\\end\{enumerate\}\s*/g, "");
  md = md.replace(/\\item\s*/g, "- ");
  md = md.replace(/\\item\[([^\]]*)\]\s*/g, "- **$1** ");

  // 清理多余空行
  md = md.replace(/\n{4,}/g, "\n\n\n");

  // 提取描述（正文第一段，去公式与标记）
  let description = "";
  const paraMatch = md.match(/^(?!:::)([^#\n].*?)(?=\n\n|\n#|$)/m);
  if (paraMatch) {
    const para = paraMatch[1].trim().replace(/\n/g, " ").replace(/\$\$/g, "").replace(/\$[^$]*\$/g, " ").replace(/\s{2,}/g, " ").replace(/[*_]/g, "").trim().slice(0, 160);
    if (para.length > 10 && !para.startsWith("```")) description = para;
  }

  return { content: md.trim(), title, description };
}

// ─── Frontmatter 生成 ────────────────────────────────────────────────────────

function buildFrontmatter(title, date, tags, description) {
  const tagStr = tags.length > 0 ? JSON.stringify(tags.map(t => t.trim())) : "[]";
  let fm = `---
title: ${JSON.stringify(title)}
date: ${date}
tags: ${tagStr}`;
  if (description) fm += `\ndescription: ${JSON.stringify(description)}`;
  return fm + "\n---\n\n";
}

function parseExistingFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { body: content, title: "", tags: [], description: "" };
  const yamlBlock = m[1];
  const body = content.slice(m[0].length);
  let title = "", description = "";
  let tags = [];
  for (const line of yamlBlock.split("\n")) {
    const t = line.match(/^title:\s*["']?(.+?)["']?\s*$/);
    const d = line.match(/^description:\s*["']?(.+?)["']?\s*$/);
    const tg = line.match(/^tags:\s*(\[.*?\])\s*$/);
    if (t) title = t[1];
    if (d) description = d[1];
    if (tg) { try { tags = JSON.parse(tg[1]); } catch {} }
  }
  return { body, title, tags, description };
}

function extractTitleFromBody(body) {
  const h1 = body.match(/^#\s+(.+)/m);
  if (h1) return h1[1].trim();
  const h2 = body.match(/^##\s+(.+)/m);
  if (h2) return h2[1].trim();
  return "";
}

async function processMdFile(filePath, stem) {
  const raw = await fs.readFile(filePath, "utf-8");
  const { body, title: fmTitle, tags: fmTags, description: fmDesc } = parseExistingFrontmatter(raw);
  const title = fmTitle || extractTitleFromBody(body) || stem;
  const content = buildFrontmatter(title, todayDate(), fmTags, fmDesc || "") + body.trim();
  return { content, title, slug: safeFilename(stem) };
}

async function processTexFile(filePath, stem) {
  const raw = await fs.readFile(filePath, "utf-8");
  const { content: mdBody, title: texTitle, description: texDesc } = texToMarkdown(raw);
  const title = texTitle || extractTitleFromBody(mdBody) || stem;
  const content = buildFrontmatter(title, todayDate(), [], texDesc) + mdBody;
  return { content, title, slug: safeFilename(stem) };
}

// ─── 主流程 ──────────────────────────────────────────────────────────────────

async function main() {
  const results = { converted: [], errors: [], reminder: "" };

  let entries;
  try {
    entries = await fs.readdir(MYPOST, { withFileTypes: true });
  } catch (e) {
    console.error(`无法读取 mypost/ 目录: ${e.message}`);
    process.exit(1);
  }

  const toProcess = entries.filter(e => e.isFile() && (e.name.endsWith(".md") || e.name.endsWith(".tex")));

  if (toProcess.length === 0) {
    console.log("📭 mypost/ 中没有待处理的 .md 或 .tex 文件。");
  } else {
    console.log(`📦 发现 ${toProcess.length} 个文件待处理：`);
    for (const ent of toProcess) {
      const ext = path.extname(ent.name);
      const stem = path.basename(ent.name, ext);
      const srcPath = path.join(MYPOST, ent.name);
      try {
        const result = ext === ".md" ? await processMdFile(srcPath, stem) : await processTexFile(srcPath, stem);
        const outName = `${result.slug}.md`;
        await fs.writeFile(path.join(POSTS, outName), result.content, "utf-8");
        await fs.unlink(srcPath);
        results.converted.push({ file: ent.name, title: result.title, target: outName });
        console.log(`  ✅ ${ent.name} → ${outName}（${result.title}）`);
      } catch (err) {
        results.errors.push({ file: ent.name, error: err.message });
        console.error(`  ❌ ${ent.name}: ${err.message}`);
      }
    }
  }

  // 检查 14 天无新文章
  try {
    const postFiles = (await fs.readdir(POSTS, { withFileTypes: true })).filter(e => e.isFile() && e.name.endsWith(".md"));
    let latestDate = 0;
    for (const pf of postFiles) {
      const raw = await fs.readFile(path.join(POSTS, pf.name), "utf-8");
      const dm = raw.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
      if (dm) { const ts = new Date(dm[1]).getTime(); if (ts > latestDate) latestDate = ts; }
    }
    if (latestDate > 0) {
      const diffDays = (Date.now() - latestDate) / 86400000;
      if (diffDays > 14) {
        const lastDate = new Date(latestDate).toISOString().slice(0, 10);
        results.reminder = `⚠️  已经 ${Math.floor(diffDays)} 天没有发布新文章了（上次发布：${lastDate}）。考虑写一篇新文章吧！`;
        console.log(`\n${results.reminder}`);
      }
    }
  } catch { /* 安静处理 */ }

  console.log("\n── 摘要 ──");
  if (results.converted.length > 0) {
    console.log(`转换成功: ${results.converted.length} 篇`);
    for (const c of results.converted) console.log(`  - ${c.file} → ${c.target}（${c.title}）`);
  }
  if (results.errors.length > 0) {
    console.log(`转换失败: ${results.errors.length} 篇`);
    for (const e of results.errors) console.log(`  - ${e.file}: ${e.error}`);
  }
  if (results.reminder) console.log(`\n${results.reminder}`);

  return results;
}

await main();
