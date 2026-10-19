// Shared by the canvas renderer and its geometry regression check.
export function ideaLines(text: string, width: number, measure: (text: string) => number) {
	const lines: string[] = [];
	for (const paragraph of text.split("\n")) {
		let line = "";
		for (const word of paragraph.split(/\s+/)) {
			const next = line ? `${line} ${word}` : word;
			if (line && measure(next) > width) { lines.push(line); line = ""; }
			for (const char of (line ? ` ${word}` : word)) {
				if (line && measure(line + char) > width) { lines.push(line); line = ""; }
				line += char;
			}
		}
		lines.push(line);
	}
	return lines;
}

export function ideaFit(width: number, height: number, textWidth: number, textHeight: number, angle: number, margin: number) {
	const cos = Math.abs(Math.cos(angle));
	const sin = Math.abs(Math.sin(angle));
	return Math.max(0.001, Math.min(1,
		Math.max(1, width - 40) / (textWidth * cos + textHeight * sin + margin),
		Math.max(1, height - 80) / (textWidth * sin + textHeight * cos + margin)));
}
