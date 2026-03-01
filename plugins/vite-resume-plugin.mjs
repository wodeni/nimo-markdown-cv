import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const VIRTUAL_ID = "virtual:resume-data";
const RESOLVED_VIRTUAL_ID = "\0" + VIRTUAL_ID;

function getPathValue(obj, dottedPath) {
  return dottedPath.split(".").reduce((acc, key) => {
    if (!acc || typeof acc !== "object") {
      return undefined;
    }
    return acc[key];
  }, obj);
}

function renderContactInfo(frontmatter) {
  const chunks = ["<div id=\"contact-info\">"];

  if (frontmatter.homepage) {
    chunks.push("    <i class=\"fa-solid fa-house\" style=\"margin-left:1em\"></i>");
    chunks.push(
      `    <a href=\"${frontmatter.homepage.url}\" style=\"margin-left:0.5em\"> ${frontmatter.homepage.text}</a>`
    );
  }

  if (frontmatter.email) {
    chunks.push("    <i class=\"fa-regular fa-envelope\" style=\"margin-left:1em\"></i>");
    chunks.push(
      `    <a href=\"${frontmatter.email.url}\" style=\"margin-left:0.5em\">${frontmatter.email.text}</a>`
    );
  }

  if (frontmatter.phone) {
    chunks.push(
      "    <i class=\"fa-solid fa-phone\" style=\"margin-left:1em\"></i>"
    );
    chunks.push(`    ${frontmatter.phone}`);
  }

  chunks.push("</div>");
  return chunks.join("\n");
}

function renderLiquidCompat(markdown, frontmatter) {
  const withIncludes = markdown.replace(
    /\{%\s*include\s+cv-contact\.html\s*%\}/g,
    renderContactInfo(frontmatter)
  );

  return withIncludes.replace(/\{\{\s*page\.([\w.-]+)\s*\}\}/g, (_, keyPath) => {
    const value = getPathValue(frontmatter, keyPath);
    return value == null ? "" : String(value);
  });
}

async function markdownToHtml(markdown) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(file.value);
}

export default function resumePlugin({ markdownFile = "index.md" } = {}) {
  let rootDir = process.cwd();
  let markdownPath = path.resolve(rootDir, markdownFile);

  async function buildModuleCode() {
    const source = await fs.readFile(markdownPath, "utf8");
    const { data, content } = matter(source);

    const hydratedMarkdown = renderLiquidCompat(content, data);
    const html = await markdownToHtml(hydratedMarkdown);
    const title = data.title ? `${data.title} | CV` : "CV";

    return `export default ${JSON.stringify({ title, html, frontmatter: data })};`;
  }

  return {
    name: "vite-resume-plugin",

    configResolved(config) {
      rootDir = config.root;
      markdownPath = path.resolve(rootDir, markdownFile);
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_VIRTUAL_ID;
      }
      return null;
    },

    async load(id) {
      if (id !== RESOLVED_VIRTUAL_ID) {
        return null;
      }
      return buildModuleCode();
    },

    handleHotUpdate(ctx) {
      const changed = path.resolve(ctx.file);
      if (changed !== markdownPath) {
        return;
      }

      const module = ctx.server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
      if (module) {
        ctx.server.moduleGraph.invalidateModule(module);
      }

      ctx.server.ws.send({ type: "full-reload" });
      return [];
    },
  };
}
