import "@hyperframes/player";
import type { HyperframesPlayer } from "@hyperframes/player";

const player = document.querySelector<HyperframesPlayer>("hyperframes-player");
const film = document.querySelector<HTMLElement>(".hero-film");
const pageLoader = document.querySelector<HTMLElement>(".page-loader");
const dismissPageLoader = () => {
	if (!pageLoader || pageLoader.classList.contains("is-leaving")) return;
	pageLoader.classList.add("is-leaving");
	pageLoader.addEventListener("transitionend", () => pageLoader.remove(), { once: true });
	setTimeout(() => pageLoader.remove(), 500);
};
const toggle = document.querySelector<HTMLButtonElement>(".motion-toggle");
const term = document.querySelector<HTMLElement>("[data-hero-term]");
const benefit = document.querySelector<HTMLElement>("[data-hero-benefit]");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = matchMedia("(max-width: 640px)");
const pairs = [
	["gestionali", "semplificano"],
	["ecommerce", "fanno crescere"],
	["siti web", "valorizzano"],
] as const;
const animateWord = (word: HTMLElement | null, text: string) => {
	if (!word || word.dataset.text === text) return;
	word.dataset.text = text;
	word.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
	if (reduce.matches) {
		word.textContent = text;
		return;
	}
	const letters = Array.from(text, (character) => {
		const letter = document.createElement("span");
		letter.className = "service-letter";
		letter.textContent = character === " " ? "\u00a0" : character;
		return letter;
	});
	word.replaceChildren(...letters);
	letters.forEach((letter, index) => letter.animate(
		[{ opacity: 0, transform: "translateY(.55em) rotateX(-70deg) scale(.9)" }, { opacity: 1, transform: "translateY(0) rotateX(0) scale(1)" }],
		{ duration: 460, delay: index * 28, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" },
	));
};
const showPair = (index: number) => {
	animateWord(term, reduce.matches ? "gestionali, ecommerce e siti web" : pairs[index]![0]);
	animateWord(benefit, reduce.matches ? "semplificano, fanno crescere e valorizzano" : pairs[index]![1]);
};
showPair(0);

if (player && film && toggle) {
	let visible = false;
	let paused = false;
	const updatePlayback = () => {
		if (!player.ready) return;
		if (reduce.matches || paused || !visible || document.hidden) player.pause();
		else player.play();
		toggle.textContent = paused ? "Riprendi l’animazione" : "Metti in pausa l’animazione";
		toggle.setAttribute("aria-pressed", String(paused));
	};
	const loadFormat = () => {
		film.classList.remove("is-ready");
		player.setAttribute("width", mobile.matches ? "390" : "1120");
		player.setAttribute("height", mobile.matches ? "720" : "680");
		player.setAttribute("src", `/motion/${mobile.matches ? "mobile" : "desktop"}/`);
	};
	player.addEventListener("ready", () => {
		player.iframeElement.tabIndex = -1;
		player.iframeElement.title = "Animazione dei tre servizi LonghiDev";
		if (reduce.matches) player.seek(1);
		updatePlayback();
	});
	player.addEventListener("painted", () => {
		film.classList.add("is-ready");
		dismissPageLoader();
		toggle.hidden = reduce.matches;
	});
	player.addEventListener("timeupdate", () => {
		const index = player.currentTime >= 11.63 ? 0 : Math.min(2, Math.floor((player.currentTime + .37) / 4));
		showPair(index);
	});
	player.addEventListener("error", () => {
		dismissPageLoader();
		film.classList.remove("is-ready");
		toggle.hidden = true;
		showPair(0);
	});
	toggle.addEventListener("click", () => { paused = !paused; updatePlayback(); });
	document.addEventListener("visibilitychange", updatePlayback);
	reduce.addEventListener("change", () => {
		toggle.hidden = reduce.matches;
		if (reduce.matches) {
			player.pause();
			player.seek(1);
		}
		showPair(0);
		updatePlayback();
	});
	mobile.addEventListener("change", loadFormat);
	new IntersectionObserver(([entry]) => {
		visible = Boolean(entry?.isIntersecting);
		updatePlayback();
	}, { threshold: .15 }).observe(film);
	loadFormat();
}
