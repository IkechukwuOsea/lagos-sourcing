import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";

const html = readFileSync("index.html", "utf8");
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(([, , body]) => body.trim());
assert.ok(scripts.length > 0, "No inline JavaScript was found.");

for (let i = 0; i < scripts.length; i += 1) {
  const [, attributes, body] = scripts[i];
  const isModule = /\btype\s*=\s*["\']module["\']/i.test(attributes);
  const filename = `.tmp-inline-${i}.${isModule ? "mjs" : "js"}`;
  writeFileSync(filename, body);
  const result = spawnSync(process.execPath, ["--check", filename], { encoding: "utf8" });
  unlinkSync(filename);
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || `Syntax check failed for ${filename}.`);
    process.exit(1);
  }
}

assert.match(html, /<main\b[^>]*id=["\']root["\']/i, "The app root must be a main landmark.");
assert.match(html, /<meta\b[^>]*name=["\']viewport["\']/i, "A responsive viewport declaration is required.");
assert.match(html, /role=["\']dialog["\'][^>]*aria-labelledby=/i, "The account dialog must have an accessible name.");
assert.match(html, /prefers-reduced-motion\s*:\s*reduce/i, "Reduced-motion preferences must be respected.");
assert.match(html, /:focus-visible/i, "Keyboard focus styles are required.");

const buttons = [...html.matchAll(/<button\b[^>]*>/gi)].map((match) => match[0]);
assert.ok(buttons.length > 0, "No buttons were found.");
for (const button of buttons) {
  assert.match(button, /\btype\s*=\s*["\'](?:button|submit|reset)["\']/i, `Button is missing an explicit type: ${button}`);
}

const controls = [...html.matchAll(/<(?:input|select|textarea)\b[^>]*>/gi)].map((match) => match[0]);
for (const control of controls) {
  const id = (control.match(/\bid=["\']([^"\']+)["\']/i) || [])[1];
  if (!id) continue;
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const labelPattern = new RegExp(`<label\\b[^>]*\\bfor=["\']${escapedId}["\']`, "i");
  assert.match(html, labelPattern, `Form control "${id}" must have an associated label.`);
}

const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
for (const image of images) assert.match(image, /\balt\s*=/i, `Image is missing alt text: ${image}`);

process.stdout.write(`Passed: ${scripts.length} inline script syntax checks, ${buttons.length} typed buttons, ${controls.length} labelled form controls, ${images.length} images, and core accessibility checks.\n`);