import assert from "node:assert/strict";
import test from "node:test";
import { createContactEventIds } from "../src/scripts/contact-id.ts";

const payload = { name: " Ada ", email: "ada@example.test", subject: "Gestionale", message: "Vorrei parlarne." };
const id = "550e8400-e29b-41d4-a716-446655440000";

test("reuses an event id only for the same normalized payload", async () => {
	const values = new Map();
	const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
	let count = 0;
	const events = createContactEventIds(() => storage, () => `550e8400-e29b-41d4-a716-44665544000${++count}`);
	const first = await events.get(payload);
	assert.equal(await events.get({ ...payload, name: "Ada" }), first);
	assert.notEqual(await events.get({ ...payload, message: "Testo diverso." }), first);
	events.clear();
	assert.notEqual(await events.get(payload), first);
});

test("storage failures do not block sending and retries retain the id in memory", async () => {
	const events = createContactEventIds(() => { throw new Error("storage disabled"); }, () => id);
	assert.equal(await events.get(payload), id);
	assert.equal(await events.get({ ...payload, name: "Ada" }), id);
});
