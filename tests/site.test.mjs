import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const html = await read("../dist/client/index.html");
const desktop = await read("../dist/client/motion/desktop/index.html");
const mobile = await read("../dist/client/motion/mobile/index.html");
const script = await read("../src/scripts/portfolio.ts");
const playback = await read("../src/scripts/hero-player.ts");
const composition = await read("../src/pages/motion/[format].astro");

test("home embeds a non-interactive HyperFrames film and keeps the contact form", () => {
	assert.match(html, /<html lang="it">/);
	assert.match(html, /P\. IVA 02644100063/);
	assert.match(html, /href="#lavoro">Lavoro<\/a>/);
	assert.match(html, /href="#contatto">Cominciamo<\/a>/);
	assert.match(html, /Sviluppo software/);
	assert.match(html, /gestionali, ecommerce e siti web/);
	assert.match(html, /<hyperframes-player[^>]*loop[^>]*muted[^>]*disable-click-to-play/);
	assert.match(html, /runtime-src="\/vendor\/hyperframes\/runtime-0\.8\.171\.js"/);
	assert.match(html, /Metti in pausa l’animazione/);
	assert.doesNotMatch(html, /data-select|data-add-to-cart/);
	assert.match(playback, /prefers-reduced-motion: reduce/);
	assert.match(playback, /IntersectionObserver/);
	assert.match(playback, /document\.hidden/);
	assert.match(playback, /player\.pause\(\)/);
	assert.match(playback, /displayedTerm === text/);
	assert.match(playback, /letter\.animate/);
	assert.match(playback, /delay: index \* 28/);
	assert.match(html, /class="hero-stage"/);
	assert.match(html, /<form id="contact-form">/);
	assert.match(html, /name="name"[^>]*required/);
	assert.match(html, /name="email" type="email"[^>]*required/);
	assert.match(html, /id="form-status" aria-live="polite"/);
	assert.match(html, /name="website"/);
	assert.match(script, /contactEventIds\.clear\(\)/);
	assert.match(script, /fetch\("\/api\/contact"/);
});

test("both composition formats have three scenes and one finite seekable timeline", () => {
	for (const film of [desktop, mobile]) {
		assert.match(film, /data-composition-id="hero-motion"/);
		assert.match(film, /data-duration="9"/);
		assert.match(film, /data-view="0"[\s\S]*?Ordini recenti/);
		assert.match(film, /data-view="1"[\s\S]*?Forma 02[\s\S]*?€ 48,00/);
		assert.match(film, /data-view="2"[\s\S]*?Segni[\s\S]*?di luce\./);
		assert.match(film, /DATI E NOMI DI FANTASIA/);
		assert.doesNotMatch(film, /data-select|data-add-to-cart/);
		assert.match(film, /disabled tabindex="-1"/);
	}
	assert.match(desktop, /data-width="1120" data-height="680"/);
	assert.match(mobile, /data-width="390" data-height="720"/);
	assert.equal((composition.match(/gsap\.timeline\(/g) ?? []).length, 2);
	assert.match(composition, /const sequence = gsap\.timeline\(\{ paused: true \}\)/);
	assert.match(composition, /master\.to\(sequence, \{ progress: 1, duration: 9, ease: "none" \}/);
	assert.match(composition, /__timelines\["hero-motion"\] = master/);
	assert.doesNotMatch(composition, /setInterval|Math\.random|timeline\.play\(/);
});
