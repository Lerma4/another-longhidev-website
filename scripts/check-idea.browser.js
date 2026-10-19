async (page) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('http://localhost:4321');
	await page.locator('.page-loader').waitFor({ state: 'hidden' });
	const section = page.locator('.idea-section');
	const checkActions = async () => {
		const layout = await page.locator('.idea-actions button').evaluateAll(buttons => ({
			rows: [...new Set(buttons.map(button => Math.round(button.getBoundingClientRect().top)))].length,
			overflow: buttons.some(button => button.scrollWidth > button.clientWidth),
		}));
		if (layout.rows !== 2 || layout.overflow) throw new Error('Action buttons must fit on two rows');
	};
	await section.scrollIntoViewIfNeeded();
	await page.waitForTimeout(500);
	await section.screenshot({ path: '/tmp/idea-desktop.png' });
	await page.locator('textarea[name="text"]').fill('La mia idea.');
	await page.selectOption('select[name="font"]', 'Georgia');
	await page.locator('.idea-swatches label').nth(2).click();
	await page.locator('input[name="size"]').fill('180');
	await page.locator('input[name="rotation"]').fill('25');
	if (await page.locator('output[data-value="size"]').innerText() !== '180') throw new Error('Size control failed');
	await page.getByRole('button', { name: 'Pausa', exact: true }).click();
	if (await page.locator('[data-idea-pause]').getAttribute('aria-pressed') !== 'true') throw new Error('Pause failed');
	await checkActions();
	const canvas = page.locator('.idea-stage canvas');
	const beforeDrag = await canvas.evaluate(el => el.toDataURL());
	const box = await canvas.boundingBox();
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 30);
	const duringDrag = await canvas.evaluate(el => el.toDataURL());
	await page.mouse.up();
	const afterDrag = await canvas.evaluate(el => el.toDataURL());
	if (beforeDrag === duringDrag || afterDrag !== duringDrag) throw new Error('Dragged position must persist after release');
	await page.getByRole('button', { name: 'Ripristina', exact: true }).click();
	await page.waitForTimeout(100);
	if (!(await page.locator('textarea[name="text"]').inputValue()).includes('A MODO TUO.')) throw new Error('Reset failed');
	if (await page.locator('input[name="size"]').inputValue() !== '110') throw new Error('Size reset failed');
	const downloadPromise = page.waitForEvent('download');
	await page.getByRole('button', { name: 'Salva PNG' }).click();
	if ((await downloadPromise).suggestedFilename() !== 'la-tua-idea-longhidev.png') throw new Error('PNG export failed');
	for (const width of [768, 390, 320]) {
		await page.setViewportSize({ width, height: 844 });
		await section.scrollIntoViewIfNeeded();
		await page.waitForTimeout(200);
		const toggle = page.locator('.idea-panel-toggle');
		if (await toggle.getAttribute('aria-expanded') === 'true') await toggle.click();
		if (width === 390) await section.screenshot({ path: '/tmp/idea-mobile.png' });
		await toggle.click();
		await page.waitForTimeout(350);
		if (width === 390) await section.screenshot({ path: '/tmp/idea-mobile-controls.png' });
		await checkActions();
		if (await page.locator('.idea-panel-body').evaluate(el => el.inert)) throw new Error('Open controls are inert');
		await page.locator('textarea[name="text"]').fill('Una parola lunghissima'.replaceAll(' ', '').repeat(5));
		const fit = Number(await page.locator('.idea-stage canvas').getAttribute('data-fit'));
		if (!Number.isFinite(fit) || fit <= 0 || fit > 1) throw new Error(`Invalid mobile fit at ${width}`);
		if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`Overflow at ${width}`);
		await page.getByRole('button', { name: 'Ripristina', exact: true }).click();
		await page.waitForTimeout(100);
		await toggle.click();
		if (!(await page.locator('.idea-panel-body').evaluate(el => el.inert))) throw new Error('Closed controls remain focusable');
	}
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.waitForTimeout(100);
	if (await page.locator('[data-idea-pause]').getAttribute('aria-pressed') !== 'true') throw new Error('Reduced motion failed');
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	return 'Passed: text/font/color/size/rotation, pause/reset, PNG export, responsive drawer, long text fit, reduced motion';
}
