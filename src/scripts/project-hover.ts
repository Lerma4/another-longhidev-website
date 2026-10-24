import { gsap } from "gsap";

const media = gsap.matchMedia();
media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
	const cleanups: (() => void)[] = [];
	document.querySelectorAll<HTMLElement>(".portfolio-project").forEach((project) => {
		const paint = project.querySelector<SVGPathElement>(".portfolio-paint-path");
		const mask = project.querySelector<SVGPathElement>(".portfolio-mask-path");
		if (!paint || !mask) return;
		const length = paint.getTotalLength();
		const overlay = project.querySelector(".portfolio-reveal");
		gsap.set(overlay, { opacity: 0 });
		gsap.set([paint, mask], { strokeDasharray: length, strokeDashoffset: length });
		// The requested paint reveal needs SVG mask painting, bounded to one hovered card.
		const reveal = gsap.timeline({ paused: true })
			.to(overlay, { opacity: 1, duration: .1 }, 0)
			.to(paint, { strokeDashoffset: 0, duration: .7, ease: "power3.out" }, 0)
			.to(mask, { strokeDashoffset: 0, duration: .8, ease: "power3.out" }, .12);
		project.dataset.hoverReady = "";
		const enter = () => reveal.timeScale(1).play();
		const leave = () => {
			if (!project.matches(":focus-visible, :focus-within")) reveal.timeScale(1.5).reverse();
		};
		const focus = () => { if (project.matches(":focus-visible, :focus-within")) reveal.pause().progress(1); };
		const blur = () => {
			if (project.matches(":hover")) enter();
			else reveal.pause().progress(0);
		};
		project.addEventListener("pointerenter", enter);
		project.addEventListener("pointerleave", leave);
		project.addEventListener("focusin", focus);
		project.addEventListener("focusout", blur);
		cleanups.push(() => {
			project.removeEventListener("pointerenter", enter);
			project.removeEventListener("pointerleave", leave);
			project.removeEventListener("focusin", focus);
			project.removeEventListener("focusout", blur);
			delete project.dataset.hoverReady;
		});
	});
	return () => cleanups.forEach((cleanup) => cleanup());
});
