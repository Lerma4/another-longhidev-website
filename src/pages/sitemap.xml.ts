import type { APIRoute } from 'astro';

import { caseStudyProjects } from "../data/projects";

const pages = ["", "privacy/", "note-legali/", ...caseStudyProjects.map((project) => `progetti/${project.slug}/`)];

export const GET: APIRoute = () => new Response(
	`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `\t<url><loc>https://longhidev.it/${page}</loc></url>`).join('\n')}\n</urlset>\n`,
	{ headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
);
