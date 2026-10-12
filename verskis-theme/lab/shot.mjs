// Screenshot lab pages headlessly: node verskis-theme/lab/shot.mjs [outDir] [pages...]
import { chromium } from "@playwright/test";
const out = process.argv[2] ?? "verskis-theme/lab/shots";
const pages = process.argv.slice(3).length ? process.argv.slice(3) : ["home", "subcategory", "product", "category", "cart"];
const browser = await chromium.launch();
for (const [w, h, tag] of [[1280, 900, "desktop"], [390, 844, "mobile"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(`http://localhost:4100/${p === "home" ? "" : p}`, { waitUntil: "load", timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await page.addStyleTag({ content: ".omnisnippet, #omni-wrapper, [id^='omni'], .parnidia-widget, iframe[src*='omnisnippet'] { display:none !important }" }).catch(() => {});
    await page.screenshot({ path: `${out}/${p}-${tag}.png`, fullPage: p !== "home" ? false : true, clip: p === "home" ? undefined : undefined });
    if (p === "home") await page.screenshot({ path: `${out}/${p}-${tag}-top.png` });
    console.log(`${p}-${tag}`);
  }
  await ctx.close();
}
await browser.close();
