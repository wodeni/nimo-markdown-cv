import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { findChrome, renderPdf } from "../scripts/render-pdf.mjs";
import { getPdfFilename } from "../src/pdf-filename.js";

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
      `<span class="contact-entry"><a href="${frontmatter.homepage.url}">${frontmatter.homepage.text}</a></span>`
    );
  }

  if (frontmatter.email) {
    entries.push(
      `<span class="contact-entry"><a href="${frontmatter.email.url}">${frontmatter.email.text}</a></span>`
    );
  }

  if (frontmatter.phone) {
    entries.push(
      `<span class="contact-entry"><span>${frontmatter.phone}</span></span>`
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

function getNodeText(node) {
  if (!node) return "";
  if (node.type === "text") return node.value || "";
  if (!Array.isArray(node.children)) return "";
  return node.children.map(getNodeText).join("");
}

function isWhitespaceTextNode(node) {
  return node.type === "text" && /^\s*$/.test(node.value || "");
}

function isPublicationLinksParagraph(node) {
  if (node.type !== "element" || node.tagName !== "p" || !Array.isArray(node.children)) {
    return false;
  }

  const significantChildren = node.children.filter((child) => !isWhitespaceTextNode(child));
  if (significantChildren.length === 0) return false;

  return significantChildren.every(
    (child) => child.type === "element" && child.tagName === "a"
  );
}

function iconClassForPublicationLink(label) {
  const normalized = label.trim().toLowerCase();
  if (normalized === "pdf") return "fas fa-file-pdf";
  if (normalized === "bibtex") return "fas fa-book";
  if (normalized === "video preview") return "fas fa-video";
  if (normalized === "talk") return "fas fa-microphone";
  if (normalized === "slides") return "fas fa-desktop";
  if (normalized === "www") return "fas fa-globe";
  if (normalized === "repo") return "fab fa-github";
  return "fas fa-link";
}

function prependIconToPublicationLink(anchorNode) {
  if (!Array.isArray(anchorNode.children)) return;

  const firstNonWhitespace = anchorNode.children.find(
    (child) => !(child.type === "text" && /^\s*$/.test(child.value || ""))
  );
  if (
    firstNonWhitespace &&
    firstNonWhitespace.type === "element" &&
    firstNonWhitespace.tagName === "i"
  ) {
    return;
  }

  const label = getNodeText(anchorNode);
  const iconClass = iconClassForPublicationLink(label);
  const labelChildren = anchorNode.children;
  anchorNode.children = [
    {
      type: "element",
      tagName: "i",
      properties: { className: iconClass.split(" "), "aria-hidden": "true" },
      children: [],
    },
    {
      type: "element",
      tagName: "span",
      properties: { className: ["pub-link-label"] },
      children: labelChildren,
    },
  ];
}

function markPublicationLinks() {
  return (tree) => {
    if (!Array.isArray(tree.children)) return;

    let inPublications = false;
    for (const node of tree.children) {
      if (node.type === "element" && node.tagName === "h2") {
        const headingText = getNodeText(node).trim().toLowerCase();
        if (headingText === "publications") {
          inPublications = true;
        } else if (inPublications) {
          inPublications = false;
        }
      }

      if (!inPublications) continue;
      if (!isPublicationLinksParagraph(node)) continue;

      node.properties = node.properties || {};
      const existing = node.properties.className || [];
      const classNames = Array.isArray(existing) ? existing : [existing];
      if (!classNames.includes("pub-links")) {
        classNames.push("pub-links");
      }
      node.properties.className = classNames;

      for (const child of node.children) {
        if (child.type === "element" && child.tagName === "a") {
          prependIconToPublicationLink(child);
        }
      }
    }
  };
}

async function markdownToHtml(markdown) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(markPublicationLinks)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(file.value);
}

export default function resumePlugin({ markdownFile = "index.md" } = {}) {
  let rootDir = process.cwd();
  let markdownPath = path.resolve(rootDir, markdownFile);
  let basePath = "/";

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
      basePath = config.base;
    },

    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.method !== "GET" || !request.url) return next();

        const pathname = decodeURIComponent(
          new URL(request.url, "http://localhost").pathname
        );
        if (!pathname.toLowerCase().endsWith(".pdf")) return next();

        const source = await fs.readFile(markdownPath, "utf8");
        const frontmatter = matter(source).data;
        const pdfFilename = getPdfFilename(frontmatter.pdf?.filename);
        if (pathname !== `${basePath}${pdfFilename}`) return next();

        const chrome = await findChrome();
        const address = server.httpServer?.address();
        if (!chrome || !address || typeof address === "string") {
          response.statusCode = 503;
          response.end("PDF generation requires Chrome or Chromium.");
          return;
        }

        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "markdown-cv-pdf-"));
        const outputPath = path.join(tempDir, pdfFilename);

        try {
          await renderPdf({
            chrome,
            outputPath,
            url: `http://127.0.0.1:${address.port}${basePath}`,
          });
          const pdf = await fs.readFile(outputPath);
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/pdf");
          response.setHeader("Content-Length", String(pdf.length));
          response.setHeader("Cache-Control", "no-store");
          response.end(pdf);
        } catch (error) {
          console.error("Could not generate the development PDF:", error);
          response.statusCode = 500;
          response.end("Could not generate PDF.");
        } finally {
          await fs.rm(tempDir, { recursive: true, force: true });
        }
      });
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
