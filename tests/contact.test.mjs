import assert from "node:assert/strict";
import test from "node:test";
import { submitContact } from "../src/lib/contact.ts";

const event_id = "550e8400-e29b-41d4-a716-446655440000";
const requestId = "550e8400-e29b-41d4-a716-446655440001";
const input = { event_id, name: "Ada Lovelace", email: "ada@example.test", subject: "Gestionale", message: "Vorrei parlare del progetto." };
const request = (body = input) => new Request("http://site.test/api/contact", {
	method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
});
const env = { CONTACT_INTAKE_URL: "https://windmill.test/contact", CONTACT_INTAKE_TOKEN: "server-secret" };

test("validates input and fails closed without backend configuration", async () => {
	assert.equal((await submitContact(request({ ...input, email: "bad" }), env)).status, 400);
	assert.equal((await submitContact(request({ ...input, website: "bot" }), env)).status, 400);
	assert.equal((await submitContact(request(), {})).status, 503);
});

test("sends only contract fields with server credentials and returns a valid receipt", async () => {
	let captured;
	const response = await submitContact(request({ ...input, website: "" }), env, async (url, options) => {
		captured = { url, options };
		return Response.json({ request_id: requestId, status: "RECEIVED" });
	});
	assert.equal(response.status, 200);
	assert.deepEqual(await response.json(), { request_id: requestId, status: "RECEIVED" });
	assert.equal(captured.url, env.CONTACT_INTAKE_URL);
	assert.equal(captured.options.headers.authorization, `Bearer ${env.CONTACT_INTAKE_TOKEN}`);
	assert.deepEqual(JSON.parse(captured.options.body), {
		event_id, source: "longhidev.it", schema_version: 1,
		name: input.name, email: input.email, subject: input.subject, message: input.message,
	});
});

test("accepts a duplicate receipt for a request already persisted", async () => {
	const response = await submitContact(request(), env, async () => Response.json({ request_id: requestId, status: "PENDING_REVIEW" }));
	assert.equal(response.status, 200);
	assert.deepEqual(await response.json(), { request_id: requestId, status: "RECEIVED" });
});

test("does not claim success for failed intake or invalid receipt", async () => {
	assert.equal((await submitContact(request(), env, async () => new Response("", { status: 500 }))).status, 502);
	assert.equal((await submitContact(request(), env, async () => Response.json({ request_id: "bad", status: "RECEIVED" }))).status, 502);
	assert.equal((await submitContact(request(), env, async () => { throw new Error("network"); })).status, 502);
});

test("bounds streamed bodies without a Content-Length header", async () => {
	const body = JSON.stringify({ ...input, message: "x".repeat(12_100) });
	const streamed = new Request("http://site.test/api/contact", {
		method: "POST", headers: { "content-type": "application/json" },
		body: new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode(body)); controller.close(); } }),
		duplex: "half",
	});
	assert.equal(streamed.headers.get("content-length"), null);
	assert.equal((await submitContact(streamed, env, async () => { throw new Error("must not call intake"); })).status, 413);
});
