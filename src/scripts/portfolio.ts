const slides = [...document.querySelectorAll<HTMLElement>("[data-view]")];
const controls = [...document.querySelectorAll<HTMLButtonElement>("[data-select]")];
const word = document.querySelector<HTMLElement>(".changing-word");
const viewport = document.querySelector<HTMLElement>(".views");
const terms = ["gestionali", "ecommerce", "siti web"];
let active = 0;
let manual = false;
let visible = true;
const animateWord = (text: string) => {
	if (!word) return;
	if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
animateWord(terms[active]!);
const select = (index: number) => {
	const previous = active;
	active = (index + slides.length) % slides.length;
	if (active !== previous && viewport) viewport.scrollTop = 0;
	slides.forEach((slide, i) => {
		slide.classList.toggle("is-active", i === active);
		slide.toggleAttribute("inert", i !== active);
	});
	controls.forEach((button, i) => button.setAttribute("aria-pressed", String(i === active)));
	animateWord(terms[active]!);
};
controls.forEach((button, i) => button.addEventListener("click", () => { manual = true; select(i); }));

const laptop = document.querySelector<HTMLElement>(".laptop");
if (laptop && slides.length) {
	let startX = 0;
	laptop.addEventListener("touchstart", (event) => { manual = true; startX = event.changedTouches[0]?.clientX ?? 0; }, { passive: true });
	laptop.addEventListener("touchend", (event) => {
		const delta = (event.changedTouches[0]?.clientX ?? startX) - startX;
		if (Math.abs(delta) > 48) { manual = true; select(active + (delta < 0 ? 1 : -1)); }
	}, { passive: true });
	laptop.addEventListener("keydown", (event) => {
		if (event.key === "ArrowRight" || event.key === "ArrowLeft") { manual = true; select(active + (event.key === "ArrowRight" ? 1 : -1)); }
	});
	const observer = new IntersectionObserver(([entry]) => { visible = Boolean(entry?.isIntersecting); }, { threshold: 0.2 });
	observer.observe(laptop);
	window.setInterval(() => { if (!manual && visible && !document.hidden && !matchMedia("(prefers-reduced-motion: reduce)").matches) select(active + 1); }, 5200);
}

document.querySelector<HTMLFormElement>("#demo-form")?.addEventListener("submit", (event) => {
	event.preventDefault();
	const form = event.currentTarget as HTMLFormElement;
	if (!form.reportValidity()) return;
	const status = document.querySelector<HTMLElement>("#form-status");
	if (status) status.textContent = "Demo completata: nessun dato è stato inviato o salvato.";
});

const cartCount = document.querySelector<HTMLElement>("[data-cart-count]");
const addToCart = document.querySelector<HTMLButtonElement>("[data-add-to-cart]");
addToCart?.addEventListener("click", () => {
	if (!cartCount) return;
	const count = Number(cartCount.textContent ?? "0") + 1;
	cartCount.textContent = String(count);
	addToCart.textContent = `Aggiunto al carrello (${count}) ✓`;
	addToCart.setAttribute("aria-pressed", "true");
});
