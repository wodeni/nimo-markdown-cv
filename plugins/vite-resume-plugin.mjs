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
  const entries = [];

  if (frontmatter.homepage) {
    entries.push(
      `<span class="contact-entry"><i class="fas fa-home"></i><a href="${frontmatter.homepage.url}">${frontmatter.homepage.text}</a></span>`
    );
  }

  if (frontmatter.email) {
    entries.push(
      `<span class="contact-entry"><i class="far fa-envelope"></i><a href="${frontmatter.email.url}">${frontmatter.email.text}</a></span>`
    );
  }

  if (frontmatter.phone) {
    entries.push(
      `<span class="contact-entry"><i class="fas fa-phone"></i><span>${frontmatter.phone}</span></span>`
    );
  }

  return `<div id="contact-info">\n  ${entries.join("\n  ")}\n</div>`;
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

function injectContactInfo(html, frontmatter) {
  if (html.includes('id="contact-info"')) {
    return html;
  }

  const contactHtml = renderContactInfo(frontmatter);
  const hasContactData =
    Boolean(frontmatter.homepage) ||
    Boolean(frontmatter.email) ||
    Boolean(frontmatter.phone);
  if (!hasContactData) {
    return html;
  }

  const h1CloseTag = "</h1>";
  const h1Index = html.indexOf(h1CloseTag);
  if (h1Index === -1) {
    return `${contactHtml}\n${html}`;
  }

  const insertionPoint = h1Index + h1CloseTag.length;
  return `${html.slice(0, insertionPoint)}\n${contactHtml}${html.slice(insertionPoint)}`;
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
    const html = injectContactInfo(await markdownToHtml(hydratedMarkdown), data);
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
