// Local lab for the Verskis skin: serves live-page snapshots with the compiled Verskis CSS
// plus our rankis2 template CSS appended, so the theme can be iterated without touching production.
// Usage: node verskis-theme/lab/serve.mjs  → http://localhost:4100/
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT ?? 4100);
const PAGES = ["home", "category", "subcategory", "product", "cart", "search", "sale"];
const THEME_CSS = ["color", "typography", "forms", "style"].map((f) => `/rankis2/css/${f}.css`);
const MIME = { ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".html": "text/html" };

async function page(name) {
  let html = await readFile(path.join(ROOT, "fixtures", `${name}.html`), "utf8");
  // absolute base so Verskis images/JS resolve to the live site; local CSS links stay absolute to the lab
  html = html.replace(/<head>/i, `<head><base href="https://www.rankis.lt/">`);
  const theme = THEME_CSS.map((h) => `<link rel="stylesheet" href="http://localhost:${PORT}${h}?t=${Date.now()}">`).join("");
  html = html.replace(/<link[^>]*styles\/min\/css_all[^>]*>/, `<link rel="stylesheet" href="http://localhost:${PORT}/vendor/css_all.css">${theme}`);
  // rewrite site navigation links between snapshots so clicking around the lab stays local
  html = html
    .replace(/href="https:\/\/www\.rankis\.lt\/"(?=[^>]*>)/g, `href="http://localhost:${PORT}/"`)
    .replace(/href="https:\/\/www\.rankis\.lt\/sodo-technika"/g, `href="http://localhost:${PORT}/category"`)
    .replace(/href="https:\/\/www\.rankis\.lt\/prekiu-krepselis"/g, `href="http://localhost:${PORT}/cart"`);
  // home: preview the HTML blocks that will be pasted into the admin ("Tekstas pradiniame puslapyje")
  if (name === "home") {
    const block = async (f) => (existsSync(path.join(ROOT, "admin", f)) ? await readFile(path.join(ROOT, "admin", f), "utf8") : "");
    const raw = `${await block("hero.html")}${await block("usp.html")}${await block("categories.html")}`;
    // blocks use site-relative paths (what the admin needs); the lab points them at the live site
    const blocks = `<div id="rk-admin-blocks">${raw.replace(/(src|href)="\//g, '$1="https://www.rankis.lt/')}</div>`;
    html = html.replace(/<ul id="top_blocks" class="blocks">/, `${blocks}<ul id="top_blocks" class="blocks">`);
  }
  const nav = `<div style="position:fixed;bottom:8px;left:8px;z-index:99999;background:#111;color:#fff;font:12px system-ui;padding:6px 10px;border-radius:8px;display:flex;gap:10px">
    ${PAGES.map((p) => `<a href="/${p === "home" ? "" : p}" style="color:#ffd400">${p}</a>`).join("")}</div>`;
  return html.replace(/<\/body>/i, `${nav}</body>`);
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const name = url.pathname === "/" ? "home" : url.pathname.slice(1);
  try {
    if (PAGES.includes(name)) {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      return res.end(await page(name));
    }
    const file = path.join(ROOT, url.pathname);
    if (file.startsWith(ROOT) && existsSync(file)) {
      res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream", "cache-control": "no-store", "access-control-allow-origin": "*" });
      if (url.pathname === "/vendor/css_all.css") {
        // compiled Verskis CSS references site-absolute assets; point them at the live site
        const css = await readFile(file, "utf8");
        return res.end(css.replace(/url\((["']?)\//g, "url($1https://www.rankis.lt/"));
      }
      return res.end(await readFile(file));
    }
    res.writeHead(404).end("not found");
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
}).listen(PORT, () => console.log(`verskis lab: http://localhost:${PORT}/  pages: ${PAGES.join(", ")}`));
