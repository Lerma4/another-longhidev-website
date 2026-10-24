export interface ProjectImage {
	src: string;
	alt: string;
	width: number;
	height: number;
}

export interface CaseStudy {
	description: string;
	context: string[];
	solution: string[];
	services: string[];
	showcase: ProjectImage & { caption: string };
	detail: { title: string; text: string };
}

export interface Project {
	slug: string;
	name: string;
	field: string;
	service: string;
	image: string;
	imageWidth: number;
	imageHeight: number;
	preview: string;
	theme: string;
	alt: string;
	year: number;
	caseStudy?: CaseStudy;
}

export const projects: Project[] = [
	{
		slug: "filo", name: "Filo", field: "Ceramiche, fatte a mano.", service: "Ecommerce",
		image: "/images/filo-vaso.jpg", imageWidth: 880, imageHeight: 1100, preview: "/images/portfolio-filo.webp",
		theme: "filo", alt: "Vaso in ceramica del concept Filo", year: 2026,
		caseStudy: {
			description: "Filo: un concept ecommerce per ceramiche artigianali. Un racconto visivo del prodotto, dalla fotografia alla scheda di acquisto.",
			context: [
				"Come portare online un oggetto che invita a essere toccato? Filo è un concept di ecommerce dedicato alle ceramiche fatte a mano: un esercizio di progettazione in cui il prodotto viene prima di tutto.",
				"L’idea è lasciare spazio alle forme e alla materia, senza perdere le informazioni che servono per scegliere. Non un catalogo affollato, ma un percorso semplice dall’oggetto ai suoi dettagli."
			],
			solution: [
				"La fotografia occupa una parte importante della pagina. Accanto, il nome, una breve descrizione, il prezzo e l’azione di acquisto seguono un ordine chiaro, senza competere per l’attenzione.",
				"Fondi chiari e tipografia essenziale lasciano emergere la ceramica. Il bordeaux distingue l’azione principale: una scelta coerente con il linguaggio visivo LonghiDev."
			],
			services: ["Progettazione dell’interfaccia", "Design responsive", "Concept ecommerce"],
			showcase: {
				src: "/images/portfolio-filo.webp", alt: "Scheda prodotto del concept Filo: fotografia del vaso, descrizione, prezzo e azione di acquisto",
				width: 1002, height: 490,
				caption: "La scheda prodotto del concept. L’interfaccia è dimostrativa: non è uno shop attivo."
			},
			detail: {
				title: "Spazio alla materia.",
				text: "Una fotografia ravvicinata racconta superficie, colore e forma. L’interfaccia resta un passo indietro: accompagna la scelta, senza nascondere il prodotto."
			}
		}
	},
	{
		slug: "spazio-forma", name: "Spazio Forma", field: "L’arte trova il suo spazio.", service: "Sito web",
		image: "/images/spazio-forma-mostra.jpg", imageWidth: 1122, imageHeight: 1402, preview: "/images/portfolio-forma.webp",
		theme: "forma", alt: "Galleria d’arte del concept Spazio Forma", year: 2026
	},
	{
		slug: "ordine", name: "Ordine", field: "Il lavoro, tutto al suo posto.", service: "Gestionale",
		image: "/images/portfolio-ordine.webp", imageWidth: 1002, imageHeight: 490, preview: "/images/portfolio-ordine.webp",
		theme: "ordine", alt: "Interfaccia dimostrativa del gestionale Ordine", year: 2026
	}
];

export const caseStudyProjects = projects.filter(
	(project): project is Project & { caseStudy: CaseStudy } => project.caseStudy !== undefined
);
