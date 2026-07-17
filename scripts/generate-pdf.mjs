import { access, mkdir, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { preview } from "vite";

const chromeCandidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  process.env.PROGRAMFILES &&
    path.join(process.env.PROGRAMFILES, "Google/Chrome/Application/chrome.exe"),
  process.env["PROGRAMFILES(X86)"] &&
    path.join(process.env["PROGRAMFILES(X86)"], "Google/Chrome/Application/chrome.exe"),
  process.env.LOCALAPPDATA &&
    path.join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"),
].filter(Boolean);

const findChrome = async () => {
  for (const candidate of chromeCandidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next common Chrome location.
    }
  }
  return null;
};

const run = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });

const chrome = await findChrome();

if (!chrome) {
  console.warn("Chrome was not found; skipping PDF generation.");
  process.exit(0);
}

const outputPath = path.resolve("dist/cv.pdf");
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

  await mkdir(path.dirname(outputPath), { recursive: true });
  await run(chrome, [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${outputPath}`,
    `http://127.0.0.1:${address.port}${base}`,
  ]);

  const signature = (await readFile(outputPath)).subarray(0, 5).toString("ascii");
  if (signature !== "%PDF-") {
    throw new Error("Chrome did not produce a valid PDF");
  }

  console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
} finally {
  await new Promise((resolve, reject) => {
    server.httpServer.close((error) => (error ? reject(error) : resolve()));
  });
}
