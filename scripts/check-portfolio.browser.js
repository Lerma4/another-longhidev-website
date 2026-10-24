async (page) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('http://localhost:4321', { waitUntil: 'domcontentloaded' });
	await page.locator('.portfolio-project[data-hover-ready]').first().waitFor();
	const section = page.locator('#portfolio');
	if (!await section.evaluate(el => el.parentElement.querySelector('#portfolio ~ section')?.id === 'contatto')) throw new Error('Portfolio must immediately precede contact');
	const cards = page.locator('.portfolio-project');
	if (await cards.count() !== 3) throw new Error('Expected three concepts');
	await section.scrollIntoViewIfNeeded();
	for (const card of await cards.all()) {
		await card.hover();
		await page.waitForTimeout(1100);
		const offset = await card.locator('.portfolio-mask-path').evaluate(el => parseFloat(getComputedStyle(el).strokeDashoffset));
		if (Math.abs(offset) > 1) throw new Error('Hover did not reveal the complete preview');
	}
	const url = page.url();
	await cards.first().click();
	if (page.url() !== url) throw new Error('Concept click must not navigate');
	await page.mouse.move(0, 0);
	await page.waitForTimeout(750);
	if (await cards.first().locator('.portfolio-mask-path').evaluate(el => parseFloat(getComputedStyle(el).strokeDashoffset)) < 100) throw new Error('Preview did not reverse on exit');
	await cards.first().evaluate(el => el.blur());
	await page.keyboard.press('Tab');
	await cards.first().focus();
	if (await cards.first().locator('.portfolio-mask-path').evaluate(el => Math.abs(parseFloat(getComputedStyle(el).strokeDashoffset))) > 1) throw new Error('Keyboard focus must reveal the preview');
	await cards.first().evaluate(el => el.blur());
	for (const width of [320, 390, 768, 1440]) {
		await page.setViewportSize({ width, height: 1000 });
		if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`Overflow at ${width}`);
	}
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.waitForTimeout(100);
	if (await page.locator('[data-hover-ready]').count()) throw new Error('Reduced motion must remove brush animation');
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	return 'Passed: placement, all hover reveals, reversal, keyboard focus, inactive click, responsive widths and reduced motion';
}
