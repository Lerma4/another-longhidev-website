import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
const script = await readFile(new URL("../src/scripts/portfolio.ts", import.meta.url), "utf8");

test("home contains the hero, three accessible demo views, and contact form", () => {
	assert.match(html, /<html lang="it">/);
	assert.match(html, /P\. IVA 02644100063/);
	assert.match(html, /href="#lavoro">Lavoro<\/a>/);
	assert.match(html, /href="#contatto">Cominciamo<\/a>/);
	assert.match(html, /Sviluppo software/);
	assert.match(html, /gestionali, ecommerce e siti web/);
	assert.match(html, /data-view="0"[\s\S]*?Ordini recenti/);
	assert.match(html, /data-view="1"[\s\S]*?Forma 02[\s\S]*?€ 48,00[\s\S]*?Aggiungi al carrello/);
	assert.match(html, /data-cart-count aria-live="polite">0/);
	assert.match(html, /class="cart-indicator" role="group" aria-label="Carrello"><svg aria-hidden="true"/);
	assert.match(html, /data-add-to-cart aria-pressed="false"/);
	assert.match(html, />Aggiungi al carrello/);
	assert.match(script, /Aggiunto al carrello/);
	assert.doesNotMatch(script, /borsa/i);
	assert.match(script, /letter\.animate/);
	assert.match(script, /delay: index \* 28/);
	assert.match(script, /prefers-reduced-motion: reduce/);
	assert.match(html, /data-view="2"[\s\S]*?MOSTRA TEMPORANEA[\s\S]*?Segni[\s\S]*?di luce\./);
	assert.equal((html.match(/data-select="[0-2]"/g) ?? []).length, 3);
	assert.match(html, /DATI E NOMI DI FANTASIA/);
	assert.match(html, /<form id="contact-form">/);
	assert.match(html, /name="name"[^>]*required/);
	assert.match(html, /name="email" type="email"[^>]*required/);
	assert.match(html, /id="form-status" aria-live="polite"/);
	assert.match(html, /name="website"/);
	assert.match(script, /contactEventIds\.clear\(\)/);
	assert.match(script, /fetch\("\/api\/contact"/);
	assert.match(html, /id="form-status"/);
});
