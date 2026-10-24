import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import test from "node:test";
import { projects, caseStudyProjects } from "../src/data/projects.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const home = await read("../dist/client/index.html");
const filo = await read("../dist/client/progetti/filo/index.html");

test("only Filo has a case-study link and a generated detail page", async () => {
	assert.deepEqual(caseStudyProjects.map((project) => project.slug), ["filo"]);
	assert.match(home, /href="\/progetti\/filo\/"/);
	assert.match(home, /aria-label="Scopri il progetto Filo"/);
	assert.doesNotMatch(home, /href="\/progetti\/(spazio-forma|ordine)\//);
	for (const slug of ["spazio-forma", "ordine"]) {
		await assert.rejects(access(new URL(`../dist/client/progetti/${slug}/index.html`, import.meta.url)));
	}
});

test("the shared template renders project content and navigation without a shop claim", () => {
	assert.match(filo, /<html lang="it"[^>]*>/);
	assert.match(filo, /<title>Filo/);
	assert.match(filo, /<h1[^>]*>Filo/);
	assert.match(filo, /Il contesto\./);
	assert.match(filo, /La soluzione\./);
	assert.match(filo, /Non un lavoro per un cliente reale/);
	assert.match(filo, /non è uno shop attivo/);
	assert.match(filo, /href="\/#portfolio"/);
	assert.match(filo, /href="\/#contatto"/);
	assert.match(filo, /linkedin\.com\/in\/lorenzo-longhi-392a29211\//);
	assert.doesNotMatch(filo, /hyperframes-player|id="contact-form"/);
	for (const { src, alt } of [caseStudyProjects[0].caseStudy.showcase]) {
		assert.ok(filo.includes(src));
		assert.ok(filo.includes(alt));
	}
});

test("project navigation has floating controls and reuses the home contact button", () => {
	assert.doesNotMatch(filo, /class="project-nav"|class="project-logo"/);
	assert.match(filo, /class="back-link" href="\/#portfolio"/);
	assert.match(filo, /class="site-header" href="\/#contatto"/);
	assert.match(filo, /class="header-star"/);
	assert.match(home, /class="header-star"/);
});

test("project slugs are unique and all referenced media exist", async () => {
	assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
	for (const project of projects) {
		assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
		const assets = [project.image, project.preview];
		if (project.caseStudy) assets.push(project.caseStudy.showcase.src);
		for (const asset of assets) await access(new URL(`../public${asset}`, import.meta.url));
	}
});
