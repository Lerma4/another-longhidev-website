const key = "longhidev-contact-event";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type Fields = { name: string; email: string; subject: string; message: string };
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function createContactEventIds(storage: () => StorageLike, createId = () => crypto.randomUUID()) {
	let memory: { fingerprint: string; eventId: string } | undefined;
	const get = async (fields: Fields) => {
		const normalized = JSON.stringify([fields.name.trim(), fields.email.trim(), fields.subject.trim(), fields.message.trim()]);
		const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
		const fingerprint = [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
		let store: StorageLike | undefined;
		try { store = storage(); } catch { /* Session storage can be disabled by the browser. */ }
		try {
			const saved = JSON.parse(store?.getItem(key) ?? "null");
			if (saved?.fingerprint === fingerprint && uuid.test(saved.eventId)) return saved.eventId as string;
		} catch { /* Ignore inaccessible or malformed session data. */ }
		if (memory?.fingerprint === fingerprint) return memory.eventId;
		const eventId = createId();
		memory = { fingerprint, eventId };
		try { store?.setItem(key, JSON.stringify(memory)); } catch { /* Sending remains available without session storage. */ }
		return eventId;
	};
	const clear = () => {
		memory = undefined;
		try { storage()?.removeItem(key); } catch { /* Session storage can be disabled by the browser. */ }
	};
	return { get, clear };
}
