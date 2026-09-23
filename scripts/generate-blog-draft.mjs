import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("OPENAI_API_KEY is required. Add it as a GitHub Actions repository secret.");

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const topics = JSON.parse(await readFile(path.join(root, "blog/topics.json"), "utf8"));
const existing = new Set((await readFile(path.join(root, "blog.html"), "utf8")).match(/blog\/([\w-]+)\.html/g)?.map((item) => item.replace("blog/", "").replace(".html", "")) || []);
const topic = topics.find((candidate) => !existing.has(candidate.slug));
if (!topic) throw new Error("All configured topics have been used. Add more topics to blog/topics.json.");

const schema = {
  type: "object", additionalProperties: false,
  required: ["title", "description", "excerpt", "readTime", "sections"],
  properties: {
    title: { type: "string" }, description: { type: "string" }, excerpt: { type: "string" }, readTime: { type: "string" },
    sections: { type: "array", minItems: 3, maxItems: 5, items: { type: "object", additionalProperties: false, required: ["heading", "paragraphs"], properties: { heading: { type: "string" }, paragraphs: { type: "array", minItems: 1, maxItems: 3, items: { type: "string" } } } } }
  }
};
const prompt = `Write a clear, helpful Ontario construction-industry article as JSON. Topic title: ${topic.title}. Focus: ${topic.focus}

Audience: homeowners, developers, contractors and municipal project teams in York Region, South Simcoe and the northern GTA. Keep it between 600 and 850 words. Use plain language. Do not claim SJ completed a project. Do not provide engineering, legal, building-code, zoning, financial or safety advice as a substitute for qualified professionals. Do not state time-sensitive municipal or provincial requirements unless the prompt supplied them. Include a reminder to confirm project-specific requirements with the relevant municipality and qualified professionals. Do not cite invented sources or use statistics. Return JSON only.`;

const response = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
  body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5-mini", input: prompt, text: { format: { type: "json_schema", name: "blog_article", strict: true, schema } } })
});
if (!response.ok) throw new Error(`OpenAI API request failed: ${response.status} ${await response.text()}`);
const payload = await response.json();
const outputText = payload.output?.flatMap((item) => item.content || []).find((item) => item.type === "output_text")?.text;
if (!outputText) throw new Error("The model response did not contain article text.");
const article = JSON.parse(outputText);

const articleFile = path.join(root, "blog", `${topic.slug}.html`);
if (existsSync(articleFile)) throw new Error("The selected article already exists.");
const sectionMarkup = article.sections.map((section) => `<h2>${escapeHtml(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}`).join("");
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(article.title)} | SJ Engineering & Constructions</title><meta name="description" content="${escapeHtml(article.description)}"><link rel="stylesheet" href="../styles.css?v=20260923-insights"></head><body><header class="header"><div class="container nav"><a class="brand" href="../index.html"><img class="brand-mark" src="../assets/sj-logo.png" alt="SJ Engineering & Constructions logo"><span class="brand-text">SJ Engineering & Constructions<small>Infrastructure • Civil • Design-Build</small></span></a><nav class="nav-links"><a href="../index.html">Home</a><a href="../services.html">Services</a><a href="../about.html">About Us</a><a href="../blog.html">Insights</a><a href="../contact.html">Contact</a></nav><div class="nav-cta"><a class="btn primary" href="../contact.html#quote">Request a Quote</a></div></div></header><main><article class="article"><div class="container"><p class="blog-meta">${escapeHtml(topic.category)} · ${escapeHtml(article.readTime)}</p><h1>${escapeHtml(article.title)}</h1><p class="article-lead">${escapeHtml(article.excerpt)}</p>${sectionMarkup}<p class="article-note">This article is general information. Confirm requirements for your address, scope and project with the relevant municipality and qualified professionals.</p><a class="btn primary" href="../contact.html#quote">Discuss your project</a></div></article></main><footer class="footer"><div class="container"><div class="footer-bottom"><div>© 2026 SJ Engineering & Constructions. All rights reserved.</div><div><a href="../blog.html">Back to Insights</a></div></div></div></footer><script src="../script.js?v=20260923-services-menu"></script></body></html>`;
await mkdir(path.join(root, "blog"), { recursive: true });
await writeFile(articleFile, page, "utf8");

const blogPath = path.join(root, "blog.html");
const blog = await readFile(blogPath, "utf8");
const card = `\n        <article class="blog-card"><p class="blog-meta">${escapeHtml(topic.category)} · ${escapeHtml(article.readTime)}</p><h3><a href="blog/${topic.slug}.html">${escapeHtml(article.title)}</a></h3><p>${escapeHtml(article.excerpt)}</p><a class="linkline" href="blog/${topic.slug}.html">Read article →</a></article>`;
await writeFile(blogPath, blog.replace("<!-- AUTO_POSTS_START -->", `<!-- AUTO_POSTS_START -->${card}`), "utf8");

const sitemapPath = path.join(root, "sitemap.xml");
const sitemap = await readFile(sitemapPath, "utf8");
await writeFile(sitemapPath, sitemap.replace("</urlset>", `  <url><loc>https://sjconstructions.ca/blog/${topic.slug}.html</loc></url>\n</urlset>`), "utf8");
console.log(`Generated draft: blog/${topic.slug}.html`);
