import blessed, {Widgets} from 'blessed';

import * as pactl from '../pactl';

export async function mountInspect(content: Widgets.BoxElement) {
	const list = blessed.list({
		parent: content,
		mouse: true,
		ignoreKeys: false,
		interactive: true,
		invertSelected: true,
		style: {
			item: {
				selected: {
					bg: 'red',
				},
				hover: {
					bg: 'lightgrey',
				},
			},
		},
	});

	async function showType(type: pactl.ListType) {
		const things = await pactl.list(type);

		list.clearItems();

		things.forEach((thing: any) => list.addItem(`#${thing.id} ${thing.name ?? thing.description}`));

		list.focus();

		content.screen.render();
	}

	await showType('cards');
}
