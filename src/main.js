import "./styles/tailwind.css";
import resume from "virtual:resume-data";

document.title = resume.title;

const content = document.getElementById("content");
if (!content) {
  throw new Error("Missing #content root element");
}

content.innerHTML = resume.html;
