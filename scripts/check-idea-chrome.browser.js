async (page) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('http://localhost:4321');
	const center = async () => {
		await page.evaluate(() => document.querySelector('.idea-section').scrollIntoView({ behavior: 'instant', block: 'start' }));
		await page.waitForTimeout(650);
	};
	const header = page.locator('.site-header');
	await center();
	const desktop = await header.evaluate(el => ({
		visible: getComputedStyle(el).visibility,
		transform: getComputedStyle(el).transform,
		transition: getComputedStyle(el).transitionProperty,
	}));
	if (desktop.visible !== 'visible' || desktop.transform === 'none' || desktop.transition !== 'transform') throw new Error('Logo must move, not disappear');
	if ((await page.locator('.idea-panel').evaluate(el => getComputedStyle(el).maskImage)) === 'none') throw new Error('Desktop panel needs a soft lower edge');
	for (const width of [390, 320]) {
		await page.setViewportSize({ width, height: 844 });
		await center();
		await page.locator('.idea-panel-toggle').evaluate(el => {
			if (el.getAttribute('aria-expanded') !== 'true') el.click();
		});
		await page.waitForTimeout(600);
		const logo = await header.boundingBox();
		const panel = await page.locator('.idea-panel').boundingBox();
		if (!logo || logo.y < 0 || logo.x < 0 || logo.y + logo.height > panel.y) throw new Error(`Logo overlaps mobile controls at ${width}`);
		await page.locator('.idea-panel-body').evaluate(el => el.scrollTop = el.scrollHeight);
		const bottomClearance = await page.locator('.idea-panel-body').evaluate(el => el.getBoundingClientRect().bottom - el.querySelector('.idea-note').getBoundingClientRect().bottom);
		if (bottomClearance < 28) throw new Error('Last content must remain above the fade');
	}
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const duration = await header.evaluate(el => parseFloat(getComputedStyle(el).transitionDuration));
	if (duration > 0.001) throw new Error('Reduced motion must skip logo travel');
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
	await page.waitForTimeout(650);
	if (await header.evaluate(el => getComputedStyle(el).transform) !== 'none') throw new Error('Logo must return on leaving the playground');
	for (const width of [320, 390, 768, 1440]) {
		await page.setViewportSize({ width, height: 844 });
		await page.locator('.idea-panel-toggle').evaluate(el => {
			if (el.getAttribute('aria-expanded') === 'true') el.click();
		});
		await page.waitForTimeout(300);
		const gap = await page.evaluate(() => document.documentElement.scrollHeight - (document.querySelector('.site-footer').getBoundingClientRect().bottom + scrollY));
		if (gap > 2) throw new Error(`Unexpected empty space below footer at ${width}: ${gap}px`);
	}
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 844 });
		await page.locator('.idea-section').evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
		await page.waitForTimeout(650);
		await page.locator('.contact-demo').evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
		await page.waitForTimeout(650);
		if (await page.evaluate(() => !document.body.classList.contains('contact-in-view') || document.body.classList.contains('idea-in-view'))) throw new Error('Logo should return to its initial position at contact');
		const original = await page.locator('.site-header').boundingBox();
		if (width > 899 && (original.y > 30 || Math.abs(original.right - (width - 72)) > 3)) throw new Error(`Logo did not return top-right on desktop: ${JSON.stringify(original)}`);
		if (width <= 899 && (Math.abs(original.bottom - (844 - 12)) > 3 || Math.abs(original.right - (width - 12)) > 3)) throw new Error(`Logo did not return bottom-right on mobile: ${JSON.stringify(original)}`);
		await page.locator('.idea-section').evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
		await page.waitForTimeout(650);
		if (await page.evaluate(() => !document.body.classList.contains('idea-in-view'))) throw new Error('Logo should dock in the center when scrolling back up');
		await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
		await page.waitForTimeout(650);
		if (await page.evaluate(() => document.body.classList.contains('idea-in-view') || document.body.classList.contains('contact-in-view'))) throw new Error('Logo should return to initial placement at the hero');
	}
	return 'Passed: logo docking, return to initial position at contact and hero, reduced motion, panel fade and no footer overflow';
}
