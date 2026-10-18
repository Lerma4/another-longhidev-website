import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { gsap } from "gsap";

test("hero entrances never reset already visible details, including the loop seam", async () => {
	const source = await readFile(new URL("../src/pages/motion/[format].astro", import.meta.url), "utf8");
	const script = source.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
	const node = () => ({ opacity: 1, x: 0, y: 0, xPercent: 0, scale: 1, textContent: "" });
	const rows = Array.from({ length: 3 }, node);
	const shop = [node(), node()];
	const art = [node(), node()];
	const scenes = [rows, shop, art].map((details) => ({ ...node(), querySelectorAll: () => details }));
	const elements = {
		"[data-view]": scenes,
		"[data-caption]": Array.from({ length: 3 }, node),
		".table > div": rows,
		".stats strong": node(),
		".shop-content button": node(),
		"[data-cart-count]": node(),
		".cart-indicator": node(),
		".exhibition-photo": art[0],
	};
	const window = {};
	runInNewContext(script, {
		window,
		document: {
			querySelector: (selector) => elements[selector],
			querySelectorAll: (selector) => elements[selector],
			createElement: () => ({}),
			body: { append() {} },
		},
		gsap: {
			timeline(options) {
				const timeline = gsap.timeline(options);
				for (const method of ["set", "to", "fromTo"]) {
					const original = timeline[method].bind(timeline);
					timeline[method] = (target, ...args) => original(typeof target === "string" ? elements[target] : target, ...args);
				}
				return timeline;
			},
		},
	});
	const timeline = window.__timelines["hero-motion"];
	try {
		timeline.seek(.1);
		assert.ok(rows.every((row) => row.opacity === 0), "orders must be hidden before their entrance");
		timeline.seek(1.1);
		assert.ok(rows.every((row) => row.opacity === 1), "orders must finish their entrance");
		assert.equal(timeline.duration(), 9, "the full three-scene cycle must run in half the time");
		for (const [details, start] of [[shop, 5.65 / 2], [art, 11.65 / 2]]) {
			timeline.seek(start - .01);
			assert.ok(details.every((detail) => detail.opacity === 0 && detail.y === 22));
			let previous = details.map((detail) => ({ ...detail }));
			for (let time = start; time < start + .5; time += .001) {
				timeline.seek(time);
				details.forEach((detail, index) => {
					assert.ok(detail.opacity >= previous[index].opacity, "entrance opacity must never jump backwards");
					assert.ok(Math.abs(detail.y - previous[index].y) < 1, "entrance position must stay continuous");
					assert.ok(Math.abs(detail.scale - previous[index].scale) < .01, "photo scale must stay continuous");
				});
				previous = details.map((detail) => ({ ...detail }));
			}
		}
		timeline.seek(8.99);
		assert.ok(rows.every((row) => row.opacity === 0));
		timeline.seek(.1);
		assert.ok(rows.every((row) => row.opacity === 0), "loop restart must preserve the hidden order state");
	} finally {
		timeline.kill();
		gsap.ticker.sleep();
	}
});
