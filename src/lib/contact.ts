const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const json = (body: object, status: number) => new Response(JSON.stringify(body), {
	status,
	headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});
const receiptStatuses = new Set(['RECEIVED', 'PROCESSING', 'PROCESSING_FAILED', 'PENDING_REVIEW', 'REJECTED', 'SENDING', 'SENT', 'SEND_FAILED', 'SEND_UNKNOWN']);

async function readBoundedBody(request: Request): Promise<string> {
	const reader = request.body?.getReader();
	if (!reader) throw new Error('invalid body');
	const chunks: Uint8Array[] = [];
	let size = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			if (size > 12_000) {
				await reader.cancel();
				throw new RangeError('body too large');
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	const bytes = new Uint8Array(size);
	let offset = 0;
	for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
	return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export async function submitContact(request: Request, env = process.env, fetcher = fetch): Promise<Response> {
	if (request.method !== 'POST') return json({ error: 'Metodo non consentito.' }, 405);
	if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) return json({ error: 'Formato non valido.' }, 415);
	const length = Number(request.headers.get('content-length') ?? 0);
	if (length > 12_000) return json({ error: 'Richiesta troppo grande.' }, 413);

	let data: Record<string, unknown>;
	try {
		const raw = await readBoundedBody(request);
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
		data = parsed as Record<string, unknown>;
	} catch (error) {
		if (error instanceof RangeError) return json({ error: 'Richiesta troppo grande.' }, 413);
		return json({ error: 'Richiesta non valida.' }, 400);
	}
	if (typeof data.website === 'string' && data.website.trim()) return json({ error: 'Richiesta non valida.' }, 400);
	const { event_id, name, email, subject, message } = data;
	if (typeof event_id !== 'string' || !uuid.test(event_id) ||
		typeof name !== 'string' || name.trim().length < 2 || name.length > 100 ||
		typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
		typeof subject !== 'string' || !subject.trim() || subject.length > 120 ||
		typeof message !== 'string' || message.trim().length < 10 || message.length > 5000) {
		return json({ error: 'Controlla i campi: nome, email, progetto e messaggio.' }, 400);
	}
	const { CONTACT_INTAKE_URL: url, CONTACT_INTAKE_TOKEN: token } = env;
	if (!url || !token) return json({ error: 'Invio temporaneamente non disponibile. Riprova più tardi.' }, 503);

	try {
		const response = await fetcher(url, {
			method: 'POST',
			headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
			body: JSON.stringify({ event_id, source: 'longhidev.it', schema_version: 1, name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }),
			signal: AbortSignal.timeout(10_000),
		});
		if (!response.ok) return json({ error: 'Non è stato possibile registrare il messaggio. I campi sono ancora disponibili per riprovare.' }, 502);
		const receipt: unknown = await response.json();
		if (!receipt || typeof receipt !== 'object' || !('request_id' in receipt) || !('status' in receipt) ||
			typeof receipt.request_id !== 'string' || !uuid.test(receipt.request_id) || typeof receipt.status !== 'string' || !receiptStatuses.has(receipt.status)) {
			return json({ error: 'Ricevuta non valida dal servizio. Riprova più tardi.' }, 502);
		}
		return json({ request_id: receipt.request_id, status: 'RECEIVED' }, 200);
	} catch {
		return json({ error: 'Servizio non raggiungibile. I campi sono ancora disponibili per riprovare.' }, 502);
	}
}
