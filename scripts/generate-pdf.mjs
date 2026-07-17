import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { preview } from "vite";
import { getPdfFilename } from "../src/pdf-filename.js";
import { findChrome, renderPdf } from "./render-pdf.mjs";

const chrome = await findChrome();

if (!chrome) {
  console.warn("Chrome was not found; skipping PDF generation.");
  process.exit(0);
}

const resumeSource = await readFile(path.resolve("index.md"), "utf8");
const resumeFrontmatter = matter(resumeSource).data;
const pdfFilename = getPdfFilename(resumeFrontmatter.pdf?.filename);
const outputPath = path.resolve("dist", pdfFilename);
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.GITHUB_ACTIONS === "true" && repoName ? `/${repoName}/` : "/";
const server = await preview({
  preview: {
    host: "127.0.0.1",
    port: 0,
  },
});

try {
  const address = server.httpServer.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not determine the preview server port");
  }

  await renderPdf({
    chrome,
    outputPath,
    url: `http://127.0.0.1:${address.port}${base}`,
  });

  console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
} finally {
  await new Promise((resolve, reject) => {
    server.httpServer.close((error) => (error ? reject(error) : resolve()));
  });
}
