import { ideaFit, ideaLines } from "../lib/idea-layout";

const section = document.querySelector<HTMLElement>(".idea-section")!;
const canvas = section.querySelector<HTMLCanvasElement>("canvas")!;
const ctx = canvas.getContext("2d");

if (ctx) {
	const context = ctx;
	const form = section.querySelector<HTMLFormElement>("form")!;
	const panel = section.querySelector<HTMLElement>(".idea-panel")!;
	const toggle = section.querySelector<HTMLButtonElement>(".idea-panel-toggle")!;
	const pause = section.querySelector<HTMLButtonElement>("[data-idea-pause]")!;
	const stage = section.querySelector<HTMLElement>(".idea-stage")!;
	const note = section.querySelector<HTMLElement>(".idea-note")!;
	const reduce = matchMedia("(prefers-reduced-motion: reduce)");
	const mobile = matchMedia("(max-width:899px)");
	let width = 1, height = 1, fontSize = 110, scale = 1;
	let visible = false, frozen = reduce.matches, frame = 0, time = 0, last = 0;
	let drag: { x: number; y: number; id: number } | null = null;
	let offset = { x: 0, y: 0 };
	let letters: { char: string; x: number; y: number }[] = [];
	let settings = new FormData(form);
	const number = (name: string) => Number(settings.get(name));
	const string = (name: string) => String(settings.get(name) ?? "");
	const currentColor = () => string("background") === "#242424" ? "#f7f7f4" : string("color");

	function layout() {
		fontSize = number("size") * (mobile.matches ? width * 0.13 / 110 : 1);
		context.font = `500 ${fontSize}px ${string("font")}`;
		const spacing = number("spacing");
		const measure = (text: string) => [...text].reduce((sum, char) => sum + context.measureText(char).width + spacing, 0);
		const lines = ideaLines(string("text").trim() || "LA TUA IDEA.", Math.max(1, width - 64), measure);
		const leading = fontSize * number("leading");
		const textWidth = Math.max(1, ...lines.map(measure));
		const textHeight = lines.length * leading;
		scale = ideaFit(width, height, textWidth, textHeight, number("rotation") * Math.PI / 180, fontSize * 1.3);
		letters = [];
		lines.forEach((line, row) => {
			let x = -measure(line) / 2;
			for (const char of line) {
				const advance = context.measureText(char).width + spacing;
				letters.push({ char, x: x + advance / 2, y: (row - (lines.length - 1) / 2) * leading });
				x += advance;
			}
		});
		// Preview always fits, even when the mobile controls or keyboard reduce its height.
		canvas.dataset.fit = String(scale);
		canvas.dataset.lines = String(lines.length);
		offset = { x: 0, y: 0 };
	}

	function draw() {
		const dpr = Math.min(devicePixelRatio || 1, 2);
		context.setTransform(dpr, 0, 0, dpr, 0, 0);
		context.fillStyle = string("background");
		context.fillRect(0, 0, width, height);
		context.translate(width / 2 + offset.x, height / 2 + offset.y - 10);
		context.scale(scale, scale);
		context.rotate(number("rotation") * Math.PI / 180);
		context.font = `500 ${fontSize}px ${string("font")}`;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = currentColor();
		const motion = reduce.matches ? "none" : string("motion");
		const intensity = number("intensity");
		const phase = time * number("speed") * 2 * number("direction");
		const amplitude = fontSize * 0.3 * intensity;
		letters.forEach((letter, index) => {
			let x = letter.x, y = letter.y, angle = 0, size = 1, alpha = 1;
			const wave = phase + index * 0.38;
			switch (motion) {
				case "wave": y += Math.sin(wave) * amplitude; angle = Math.cos(wave) * 0.07 * intensity; break;
				case "marquee": x += Math.sin(phase) * amplitude; break;
				case "float": y += Math.sin(phase * 0.6 + index * 0.6) * amplitude; x += Math.cos(wave) * amplitude * 0.3; break;
				case "rotate": angle = Math.sin(wave) * 0.35 * intensity; break;
				case "pulse": size = 1 + Math.sin(wave) * 0.16 * intensity; break;
				case "scatter": x += Math.sin(index * 12.7 + phase) * amplitude; y += Math.cos(index * 7.3 + phase) * amplitude; angle = Math.sin(wave) * 0.25 * intensity; break;
				case "orbit": x += Math.cos(wave) * amplitude; y += Math.sin(wave) * amplitude; break;
				case "glitch": if (Math.sin(phase * 5 + index * 3) > 0.93) x += amplitude * Math.sin(index * 17); break;
				case "type": alpha = index <= (Math.abs(phase) * 9 % (letters.length + 10)) ? 1 : 0.12; break;
			}
			context.save();
			context.translate(x, y);
			context.rotate(angle);
			context.scale(size, size);
			context.globalAlpha = alpha;
			context.fillText(letter.char, 0, 0);
			context.restore();
		});
	}

	function tick(now: number) {
		frame = 0;
		if (last) time += Math.min((now - last) / 1000, 0.05);
		last = now;
		draw();
		if (visible && !document.hidden && !frozen && !reduce.matches && string("motion") !== "none" && number("speed") > 0) frame = requestAnimationFrame(tick);
	}
	function refresh() {
		cancelAnimationFrame(frame);
		frame = 0; last = 0;
		draw();
		if (visible && !document.hidden && !frozen && !reduce.matches) frame = requestAnimationFrame(tick);
	}
	function update() {
		settings = new FormData(form);
		section.style.setProperty("--play-surface", string("background"));
		stage.querySelector<HTMLElement>(".idea-stage-hint")!.style.color = string("background") === "#242424" ? "#f7f7f4" : "#545454";
		for (const output of form.querySelectorAll<HTMLOutputElement>("output")) output.value = string(output.dataset.value!) + (output.dataset.value === "rotation" ? "°" : "");
		layout(); refresh();
	}
	function pauseState() {
		pause.setAttribute("aria-pressed", String(frozen));
		pause.textContent = frozen ? "Riprendi" : "Pausa";
		refresh();
	}
	function syncPanel() {
		const open = !mobile.matches || toggle.getAttribute("aria-expanded") === "true";
		section.querySelector<HTMLElement>(".idea-panel-body")!.inert = !open;
	}
	form.addEventListener("input", update);
	form.addEventListener("submit", event => event.preventDefault());
	form.addEventListener("reset", () => {
		requestAnimationFrame(() => { time = 0; frozen = reduce.matches; update(); pauseState(); });
	});
	pause.addEventListener("click", () => { frozen = !frozen; pauseState(); });
	toggle.addEventListener("click", () => {
		const open = toggle.getAttribute("aria-expanded") !== "true";
		toggle.setAttribute("aria-expanded", String(open));
		panel.classList.toggle("is-open", open);
		syncPanel();
	});
	mobile.addEventListener("change", syncPanel);
	section.querySelector("[data-idea-center]")!.addEventListener("click", () => section.scrollIntoView({ behavior: reduce.matches ? "instant" : "smooth", block: "start" }));
	section.querySelector("[data-idea-fullscreen]")!.addEventListener("click", async () => {
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else if (section.requestFullscreen) await section.requestFullscreen();
			else { section.scrollIntoView({ block: "start" }); note.textContent = "Il browser non supporta lo schermo intero: playground centrato."; }
		} catch { note.textContent = "Schermo intero non disponibile in questo browser."; }
	});
	document.addEventListener("fullscreenchange", () => {
		section.querySelector("[data-idea-fullscreen]")!.textContent = document.fullscreenElement ? "Esci da schermo intero" : "Schermo intero";
	});
	section.querySelector("[data-idea-export]")!.addEventListener("click", () => {
		draw();
		canvas.toBlob(blob => {
			if (!blob) { note.textContent = "Impossibile creare l’immagine. Riprova."; return; }
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url; link.download = "la-tua-idea-longhidev.png"; link.click();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		}, "image/png");
	});
	section.querySelector("[data-idea-random]")!.addEventListener("click", () => {
		const choose = (name: string) => {
			const inputs = [...form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)];
			inputs[Math.floor(Math.random() * inputs.length)].checked = true;
		};
		choose("motion"); choose("color"); choose("background");
		(form.elements.namedItem("rotation") as HTMLInputElement).value = String(Math.round(Math.random() * 30 - 15));
		(form.elements.namedItem("spacing") as HTMLInputElement).value = String(Math.round(Math.random() * 8));
		update();
	});
	canvas.addEventListener("pointerdown", event => {
		if (event.button !== 0) return;
		drag = { x: event.clientX - offset.x, y: event.clientY - offset.y, id: event.pointerId };
		canvas.setPointerCapture(event.pointerId);
	});
	canvas.addEventListener("pointermove", event => {
		if (!drag || drag.id !== event.pointerId) return;
		offset = { x: Math.max(-width * 0.1, Math.min(width * 0.1, event.clientX - drag.x)), y: Math.max(-height * 0.1, Math.min(height * 0.1, event.clientY - drag.y)) };
		draw();
	});
	const endDrag = () => { drag = null; draw(); };
	canvas.addEventListener("pointerup", endDrag);
	canvas.addEventListener("pointercancel", endDrag);
	canvas.addEventListener("lostpointercapture", endDrag);
	new ResizeObserver(() => {
		width = Math.max(1, stage.clientWidth); height = Math.max(1, stage.clientHeight);
		const dpr = Math.min(devicePixelRatio || 1, 2);
		canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
		layout(); refresh();
	}).observe(stage);
	const header = document.querySelector<HTMLElement>(".site-header");
	new ResizeObserver(() => {
		header?.style.setProperty("--idea-controls-height", `${panel.getBoundingClientRect().height}px`);
	}).observe(panel);
	new IntersectionObserver(entries => {
		visible = entries[0].isIntersecting;
		refresh();
	}, { threshold: 0 }).observe(section);
	new IntersectionObserver(entries => {
		document.body.classList.toggle("idea-in-view", entries[0].isIntersecting);
		if (entries[0].isIntersecting) document.body.classList.add("logo-centered");
	}, { rootMargin: "-35% 0px -35% 0px" }).observe(section);
	const contact = document.querySelector<HTMLElement>(".contact-demo");
	if (contact) new IntersectionObserver(([entry]) => {
		const active = entry.isIntersecting;
		document.body.classList.toggle("contact-in-view", active);
		if (active) document.body.classList.remove("idea-in-view");
	}, { rootMargin: "-30% 0px -30% 0px" }).observe(contact);
	window.addEventListener("scroll", () => {
		if (window.scrollY <= 4) document.body.classList.remove("logo-centered");
	}, { passive: true });
	document.addEventListener("visibilitychange", refresh);
	reduce.addEventListener("change", () => { frozen = reduce.matches; pauseState(); });
	section.querySelector<HTMLElement>(".idea-fallback")!.hidden = true;
	for (const element of section.querySelectorAll<HTMLElement>("[hidden]")) {
		if (!element.classList.contains("idea-fallback")) element.hidden = false;
	}
	syncPanel(); update(); pauseState();
	void document.fonts.ready.then(() => { layout(); refresh(); });
}
