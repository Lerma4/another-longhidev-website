import "@hyperframes/player";
import type { HyperframesPlayer } from "@hyperframes/player";

const player = document.querySelector<HyperframesPlayer>("hyperframes-player");
const film = document.querySelector<HTMLElement>(".hero-film");
const toggle = document.querySelector<HTMLButtonElement>(".motion-toggle");
const word = document.querySelector<HTMLElement>(".changing-word");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = matchMedia("(max-width: 640px)");
const terms = ["gestionali", "ecommerce", "siti web"];
let displayedTerm = "";
const animateWord = (text: string) => {
	if (!word || displayedTerm === text) return;
	displayedTerm = text;
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
animateWord(reduce.matches ? "gestionali, ecommerce e siti web" : terms[0]!);

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
		toggle.hidden = reduce.matches;
	});
	player.addEventListener("timeupdate", () => {
		const index = player.currentTime >= 8.725 ? 0 : Math.min(2, Math.floor((player.currentTime + .275) / 3));
		animateWord(reduce.matches ? "gestionali, ecommerce e siti web" : terms[index]!);
	});
	player.addEventListener("error", () => {
		film.classList.remove("is-ready");
		toggle.hidden = true;
		animateWord("gestionali, ecommerce e siti web");
	});
	toggle.addEventListener("click", () => { paused = !paused; updatePlayback(); });
	document.addEventListener("visibilitychange", updatePlayback);
	reduce.addEventListener("change", () => {
		toggle.hidden = reduce.matches;
		if (reduce.matches) {
			player.pause();
			player.seek(1);
			animateWord("gestionali, ecommerce e siti web");
		}
		updatePlayback();
	});
	mobile.addEventListener("change", loadFormat);
	new IntersectionObserver(([entry]) => {
		visible = Boolean(entry?.isIntersecting);
		updatePlayback();
	}, { threshold: .15 }).observe(film);
	loadFormat();
}
