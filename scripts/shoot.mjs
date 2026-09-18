// Verification screenshots via Chrome DevTools Protocol (no npm dependencies; Node >= 22).
// Usage: node scripts/shoot.mjs   (static server must be running on :3011)
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "screenshots");
const BASE = process.env.BASE || "http://127.0.0.1:3011/";
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });

const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "shoot-"))}`, "about:blank"
], { stdio: "ignore" });

let targets;
for (let i = 0; i < 40; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); break; } catch { await sleep(250); }
}
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const id = ++seq;
    pending.set(id, (m) => (m.error ? rej(new Error(method + ": " + m.error.message)) : res(m.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expr) => (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

await send("Page.enable");
await send("Runtime.enable");

async function go(url, wait = 2200) {
  await send("Page.navigate", { url });
  await sleep(wait);
  await evaluate("document.fonts.ready.then(()=>true)");
}
async function snap(name, full = false) {
  let clip;
  if (full) {
    const h = await evaluate("document.documentElement.scrollHeight");
    const w = await evaluate("innerWidth");
    clip = { x: 0, y: 0, width: w, height: h, scale: 1 };
  }
  const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: full, ...(clip ? { clip } : {}) });
  writeFileSync(join(OUT, name + ".png"), Buffer.from(data, "base64"));
  console.log("saved", name);
}

const report = [];
for (const [w, h, label] of [[1440, 900, "desktop"], [768, 1024, "tablet"], [390, 844, "mobile"]]) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  const pfx = `${label}-${w}`;

  await go(BASE, 2600);
  await snap(`${pfx}-01-firstview`);
  report.push({ view: pfx, docWidth: await evaluate("document.documentElement.scrollWidth"), innerWidth: w });

  // scroll-triggered hero explode
  await evaluate("window.scrollTo(0, innerHeight*0.45)");
  await sleep(700);
  await snap(`${pfx}-02-hero-exploded`);

  await go(BASE + "?static", 1500);
  await evaluate("document.getElementById('products').scrollIntoView()");
  await sleep(900);
  await snap(`${pfx}-03-products`);
  await evaluate("document.getElementById('compare').scrollIntoView()");
  await sleep(900);
  await snap(`${pfx}-04-compare`);
  await evaluate("window.scrollTo(0,0)");
  await sleep(300);
  await snap(`${pfx}-00-fullpage`, true);

  for (const p of ["zw3d", "zwcad", "zwcad-mfg"]) {
    await go(`${BASE}?product=${p}`, 2600);
    await snap(`${pfx}-05-modal-${p}`);
  }
  // modal scrolled to CTA
  await evaluate("document.querySelector('[data-modal-body]').scrollTop = 99999");
  await sleep(400);
  await snap(`${pfx}-06-modal-zwcad-mfg-bottom`);
}

writeFileSync(join(OUT, "overflow-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
ws.close();
chrome.kill();
process.exit(0);
