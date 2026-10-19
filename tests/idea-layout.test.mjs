import assert from 'node:assert/strict';
import test from 'node:test';
import { ideaFit, ideaLines } from '../src/lib/idea-layout.ts';

test('playground wraps text and fits rotated compositions on mobile, including an open drawer', () => {
	const measure = text => [...text].length * 28;
	for (const width of [256, 326, 704, 1000]) {
		for (const text of ['LA TUA IDEA.\nA MODO TUO.', 'Una idea molto lunga da portare sul web', 'x'.repeat(120), '', 'A\n\nB']) {
			const lines = ideaLines(text, width, measure);
			assert.ok(lines.length);
			assert.ok(lines.every(line => measure(line) <= width));
			for (const angle of [-25, 0, 25]) {
				const radians = angle * Math.PI / 180;
				const textWidth = Math.max(1, ...lines.map(measure));
				const textHeight = lines.length * 55;
				const factor = ideaFit(width + 64, 240, textWidth, textHeight, radians, 65);
				assert.ok(factor > 0 && factor <= 1);
				assert.ok((textWidth * Math.abs(Math.cos(radians)) + textHeight * Math.abs(Math.sin(radians)) + 65) * factor <= width + 24 + 0.001);
				assert.ok((textWidth * Math.abs(Math.sin(radians)) + textHeight * Math.abs(Math.cos(radians)) + 65) * factor <= 160 + 0.001);
			}
		}
	}
	assert.deepEqual(ideaLines('LA TUA IDEA.\nA MODO TUO.', 1000, measure), ['LA TUA IDEA.', 'A MODO TUO.']);
});
