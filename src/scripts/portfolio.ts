import { createContactEventIds } from "./contact-id";
import "./hero-player";

const contactForm = document.querySelector<HTMLFormElement>("#contact-form");
const contactStatus = document.querySelector<HTMLElement>("#form-status");
const contactEventIds = createContactEventIds(() => sessionStorage);
contactForm?.addEventListener("submit", async (event) => {
	event.preventDefault();
	const form = event.currentTarget as HTMLFormElement;
	if (!form.reportValidity()) return;
	const button = form.querySelector<HTMLButtonElement>("button[type=submit]");
	if (button) button.disabled = true;
	if (contactStatus) contactStatus.textContent = "Invio in corso…";
	const fields = new FormData(form);
	const payload = {
		name: String(fields.get("name")).trim(),
		email: String(fields.get("email")).trim(),
		subject: String(fields.get("service")).trim(),
		message: String(fields.get("message")).trim(),
	};
	try {
		const response = await fetch("/api/contact", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ event_id: await contactEventIds.get(payload), ...payload, website: fields.get("website") }),
		});
		const result: { status?: string; error?: string } = await response.json();
		if (!response.ok || result.status !== "RECEIVED") throw new Error(result.error ?? "Invio non riuscito. Riprova.");
		form.reset();
		contactEventIds.clear();
		if (contactStatus) contactStatus.textContent = "Messaggio ricevuto. Ti risponderò appena possibile.";
	} catch (error) {
		if (contactStatus) contactStatus.textContent = error instanceof Error ? error.message : "Servizio non raggiungibile. I campi sono ancora disponibili per riprovare.";
	} finally {
		if (button) button.disabled = false;
	}
});
