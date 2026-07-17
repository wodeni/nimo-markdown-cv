import "./styles/tailwind.css";
import resume from "virtual:resume-data";

document.title = resume.title;

const content = document.getElementById("content");
if (!content) {
  throw new Error("Missing #content root element");
}

content.innerHTML = resume.html;

const iconSvg = (viewBox, body) => `
  <svg
    class="site-icon"
    viewBox="${viewBox}"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >${body}</svg>
`;

const icons = {
  "fa-home": iconSvg(
    "0 0 24 24",
    '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />'
  ),
  "fa-envelope": iconSvg(
    "0 0 24 24",
    '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />'
  ),
  "fa-phone": iconSvg(
    "0 0 24 24",
    '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />'
  ),
  "fa-star": iconSvg(
    "0 0 576 512",
    '<path d="M259.3 17.8 194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />'
  ),
  "fa-award": iconSvg(
    "0 0 24 24",
    '<path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2ZM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8Zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1Z" />'
  ),
  "fa-file-pdf": iconSvg(
    "0 0 384 512",
    '<path d="M369.9 97.9 286 14C277 5 264.8-.1 252.1-.1H48C21.5-.1 0 21.4 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34ZM332.1 128H256V51.9l76.1 76.1ZM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48Zm250.2-143.7c-12.2-12-47-8.7-64.4-6.5-17.2-10.5-28.7-25-36.8-46.3 3.9-16.1 10.1-40.6 5.4-56-4.2-26.2-37.8-23.6-42.6-5.9-4.4 16.1-.4 38.5 7 67.1-10 23.9-24.9 56-35.4 74.4-20 10.3-47 26.2-51 46.2-3.3 15.8 26 55.2 76.1-31.2 22.4-7.4 46.8-16.5 68.4-20.1 18.9 10.2 41 17 55.8 17 25.5 0 28-28.2 17.5-38.7Zm-198.1 77.8c5.1-13.7 24.5-29.5 30.4-35-19 30.3-30.4 35.7-30.4 35Zm81.6-190.6c7.4 0 6.7 32.1 1.8 40.8-4.4-13.9-4.3-40.8-1.8-40.8Zm-24.4 136.6c9.7-16.9 18-37 24.7-54.7 8.3 15.1 18.9 27.2 30.1 35.5-20.8 4.3-38.9 13.1-54.8 19.2Zm131.6-5s-5 6-37.3-7.8c35.1-2.6 40.9 5.4 37.3 7.8Z" />'
  ),
  "fa-book": iconSvg(
    "0 0 16 16",
    '<path fill-rule="evenodd" d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0Z" /><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2Zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4Z" />'
  ),
  "fa-video": iconSvg(
    "0 0 512 512",
    '<path d="m371.7 238-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42ZM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248Zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256Z" />'
  ),
  "fa-microphone": iconSvg(
    "0 0 512 512",
    '<path d="m371.7 238-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42ZM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248Zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256Z" />'
  ),
  "fa-desktop": iconSvg(
    "0 0 24 24",
    '<path d="M20 3H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h7v3H8v2h8v-2h-3v-3h7c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2ZM4 15V5h16l.001 10H4Z" /><path d="m10 13 5-3-5-3Z" />'
  ),
  "fa-globe": iconSvg(
    "0 0 24 24",
    '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2Zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8ZM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96ZM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26Zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16Zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8ZM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96ZM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2Zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56ZM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38Z" />'
  ),
  "fa-github": iconSvg(
    "0 0 496 512",
    '<path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6Zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3Zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9ZM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8ZM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1Zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7Zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1Zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2Z" />'
  ),
  "fa-link": iconSvg(
    "0 0 24 24",
    '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1ZM8 13h8v-2H8v2Zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5Z" />'
  ),
};

for (const oldIcon of content.querySelectorAll("i")) {
  const iconClass = Object.keys(icons).find((className) =>
    oldIcon.classList.contains(className)
  );
  if (!iconClass) continue;

  const template = document.createElement("template");
  template.innerHTML = icons[iconClass].trim();
  oldIcon.replaceWith(template.content.firstElementChild);
}

const makePill = (label) => {
  const pill = document.createElement("span");
  pill.className = "metadata-pill";
  pill.textContent = label;
  return pill;
};

for (const code of content.querySelectorAll("code")) {
  const group = document.createElement("span");
  group.className = "metadata-pills";

  const items = code.textContent
    .trim()
    .split(/\s*,\s*/)
    .filter(Boolean);

  for (const item of items) {
    const duration = item.match(/^(\d{4}(?:\.\d+)?)\s*-\s*(\d{4}(?:\.\d+)?)?$/);
    if (!duration) {
      group.append(makePill(item));
      continue;
    }

    group.append(makePill(duration[1]));

    const separator = document.createElement("span");
    separator.className = "metadata-separator";
    separator.textContent = "–";
    separator.setAttribute("aria-hidden", "true");
    group.append(separator, makePill(duration[2] || "Present"));
  }

  code.replaceWith(group);
}

for (const publicationLinks of content.querySelectorAll(".pub-links")) {
  const venue = publicationLinks.previousElementSibling;
  if (venue?.tagName === "P") {
    venue.classList.add("pub-venue");
    const beforeVenue = venue.previousElementSibling;
    if (beforeVenue?.tagName === "P") {
      beforeVenue.classList.add("pub-before-venue");
    }
  }
}

const heading = content.querySelector("h1");
const contactInfo = content.querySelector("#contact-info");

const createPdfButton = () => {
  const button = document.createElement("button");
  button.className = "download-pdf";
  button.type = "button";
  button.innerHTML = `${icons["fa-file-pdf"]}<span>Download PDF</span>`;

  button.addEventListener("click", async () => {
    const pdfUrl = `${import.meta.env.BASE_URL}cv.pdf`;

    try {
      const response = await fetch(pdfUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`PDF returned ${response.status}`);
      if (!response.headers.get("content-type")?.includes("application/pdf")) {
        throw new Error("PDF URL did not return a PDF");
      }

      const pdf = await response.blob();
      const signature = await pdf.slice(0, 5).text();
      if (signature !== "%PDF-") throw new Error("Downloaded file is not a PDF");

      const download = document.createElement("a");
      const objectUrl = URL.createObjectURL(pdf);
      download.href = objectUrl;
      download.download = "cv.pdf";
      document.body.append(download);
      download.click();
      download.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      window.print();
    }
  });

  return button;
};

if (heading) {
  const title = resume.frontmatter.title || heading.textContent.trim();
  heading.classList.add("hero-heading");
  heading.setAttribute("aria-label", title);

  const renderTextWordmark = () => {
    const wordmark = document.createElement("span");
    wordmark.className = "hero-wordmark hero-wordmark-text";
    wordmark.setAttribute("aria-hidden", "true");

    const nickname = title.match(/^(.*?)\s*["“]([^"”]+)["”]\s*(.*?)$/);
    let lines;
    let accentIndex;

    if (nickname) {
      lines = [nickname[1], `“${nickname[2]}”`, nickname[3]].filter(Boolean);
      accentIndex = lines.length === 3 ? 1 : 0;
    } else {
      const words = title.trim().split(/\s+/).filter(Boolean);
      if (words.length <= 2) {
        lines = words;
      } else {
        lines = [words[0], words.slice(1, -1).join(" "), words.at(-1)];
      }
      accentIndex = lines.length > 1 ? 1 : -1;
    }

    const longestLine = Math.max(...lines.map((line) => line.length));
    const scale = Math.max(0.58, Math.min(1, 10 / longestLine));
    wordmark.style.setProperty("--hero-scale", scale.toFixed(3));

    for (const [index, line] of lines.entries()) {
      const lineElement = document.createElement("span");
      lineElement.className = "hero-wordmark-line";
      if (index === accentIndex) {
        lineElement.classList.add("hero-wordmark-accent");
      }
      lineElement.textContent = line;
      wordmark.append(lineElement);
    }

    heading.replaceChildren(wordmark);
  };

  const heroImage = resume.frontmatter.hero?.image;
  if (heroImage) {
    const image = document.createElement("img");
    image.className = "hero-wordmark";
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    image.addEventListener("error", renderTextWordmark, { once: true });
    image.src = /^(?:[a-z]+:|\/)/i.test(heroImage)
      ? heroImage
      : `${import.meta.env.BASE_URL}${heroImage.replace(/^\.\//, "")}`;
    heading.replaceChildren(image);
  } else {
    renderTextWordmark();
  }

  const header = document.createElement("header");
  const headerMeta = document.createElement("div");
  header.id = "resume-header";
  headerMeta.className = "header-meta";
  heading.before(header);
  header.append(heading);
  if (contactInfo) {
    headerMeta.append(contactInfo);
  }
  headerMeta.append(createPdfButton());
  header.append(headerMeta);
}
