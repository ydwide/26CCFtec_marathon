import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../thread-skills-workspace.html", import.meta.url), "utf8");

assert.match(html, /对话沉淀/);
assert.match(html, /这一线程已沉淀为可复用技能/);
assert.match(html, /任务技能/);
assert.match(html, /项目技能/);
assert.match(html, /查看 Skill/);
assert.match(html, /复制 Prompt/);
assert.match(html, /继续使用/);

console.log("thread-skills-workspace checks passed");
