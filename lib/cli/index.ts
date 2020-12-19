import blessed from 'blessed';

import {mountInspect} from './inspect';
import {mountRoute} from './route';

const views = {
	inspect: mountInspect,
	route: mountRoute,
};

(async () => {
	const screen = blessed.screen({
		smartCSR: true,
		title: 'PulseControl',
	});

	const content = blessed.box({
		parent: screen,
		top: 1,
		left: 1,
		right: 1,
		height: '100%-3',
	});

	const tabs = blessed.listbar({
		parent: screen,
		top: '100%-1',
		autoCommandKeys: false,
		commands: [{
			text: 'Route',
			keys: ['C-1'],
			callback() {
				showTab('route');
			},
		}, {
			text: 'Inspect',
			keys: ['C-2'],
			callback() {
				showTab('inspect');
			},
		}],
	} as any);

	function showTab(tab: keyof typeof views): void {
		while (content.children.length > 0) content.remove(content.children[0]);

		views[tab](content);

		screen.render();
	}

	screen.key(['q', 'esc', 'C-c'], () => process.exit(0));

	showTab('route');

	screen.render();
})();
