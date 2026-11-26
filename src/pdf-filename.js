export const getPdfFilename = (configuredName) => {
  const basename = String(configuredName || "cv")
    .trim()
    .replace(/\.pdf$/i, "")
    .normalize("NFKD")
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return `${basename || "cv"}.pdf`;
};
