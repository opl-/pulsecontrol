import blessed, {Widgets} from 'blessed';

import * as pactl from '../pactl';
import {Sink, SinkInput, Source, SourceOutput} from '../pactl';

export async function mountRoute(content: Widgets.BoxElement) {
	const sinkInputsList = blessed.list({
		parent: content,
		left: 1,
		width: '50%-3',
		bottom: 2,
		keys: true,
		mouse: true,
		style: {
			selected: {
				bg: 'red',
			},
		},
	});
	blessed.text({
		parent: content,
		top: '50%',
		left: '50%-1',
		content: '->',
	});
	const sinksList = blessed.list({
		parent: content,
		left: '50%+2',
		width: '100%-2',
		bottom: 2,
		keys: true,
		mouse: true,
		style: {
			selected: {
				bg: 'grey',
			},
		},
	});

	const buttons = blessed.listbar({
		parent: content,
		left: 1,
		top: '100%-1',
		commands: [{
			text: 'Switch side',
			keys: ['tab'],
			async callback() {
				switchSide();
			},
		}, {
			text: 'Set/Toggle sink',
			keys: ['enter'],
			async callback() {
				const sinkInput = sinkInputs[(sinkInputsList as any).selected];
				const sink = sinks[(sinksList as any).selected];
				if (!sinkInput || !sink) return;

				await pactl.moveSinkInput(sinkInput.id, sink.id);

				await reloadData();
			},
		}, {
			text: 'Create null sink',
			keys: ['n'],
			callback() {
				blessed.prompt({
					parent: content,
				}).readInput('Enter sink name (empty for random):', '', async (err, value) => {
					if (value === null) return;

					const name = value || `Null sink ${~~(Math.random() * 1000)}`;

					await pactl.loadModule('module-null-sink', {
						sink_name: name,
						sink_properties: `device.description=${JSON.stringify(name)}`,
					});

					await reloadData();
				});
			},
		}, {
			text: 'Create combine sink',
			keys: ['c'],
			async callback() {
				const result = await promptSinks('Select sinks for combined output:');
				if (!result || result.length === 0) return;

				await pactl.loadModule('module-combine-sink', {
					slaves: result.map((sink) => sink.id).join(','),
				});

				await reloadData();
			},
		}, {
			text: 'Delete selected sink',
			keys: ['d'],
			async callback() {
				const selectedSink = sinks[(sinksList as any).selected];
				if (!selectedSink || !['module-null-sink.c', 'module-combine-sink.c'].includes(selectedSink.driver!)) return;

				await pactl.unloadModule(selectedSink.ownerModule);

				await reloadData();
			},
		}, {
			text: 'Reload',
			keys: ['r'],
			async callback() {
				await reloadData();
			},
		}],
	} as any);

	function promptSinks(text: string): Promise<Sink[] | null> {
		return new Promise((resolve) => {
			const box = blessed.box({
				parent: content.screen,
			});

			blessed.text({
				parent: box,
				top: 2,
				left: 2,
				content: text,
			});

			const ok = blessed.button({
				parent: box,
				content: 'Ok',
				top: 4,
				left: 2,
				keys: true,
				mouse: true,
			});
			const cancel = blessed.button({
				parent: box,
				content: 'Cancel',
				top: 4,
				left: 6,
				keys: true,
				mouse: true,
			});

			const list = blessed.list({
				parent: box,
				top: 6,
				left: 2,
				keys: true,
				mouse: true,
				style: {
					selected: {
						bg: 'red',
					},
				},
			});
			sinks.forEach((sink) => {
				list.addItem('  ' + formatSink(sink));
			});

			const selected: number[] = [];

			list.key('space', () => {
				const sink = sinks[(list as any).selected];
				if (!sink) return;

				const indexInSelected = selected.indexOf(sink.id);
				if (indexInSelected !== -1) selected.splice(indexInSelected, 1);
				else selected.push(sink.id);

				(list as any).items[(list as any).selected].setContent((indexInSelected === -1 ? 'v ' : '  ') + formatSink(sink));

				content.screen.render();
			});

			function cleanUp() {
				box.hide();
				content.screen.restoreFocus();
				box.detach();
				content.screen.render();
			}

			function doAccept() {
				cleanUp();
				resolve(sinks.filter((sink) => selected.includes(sink.id)));
			}

			function doCancel() {
				cleanUp();
				resolve(null);
			}

			ok.on('press', doAccept);
			cancel.on('press', doCancel);
			list.key('enter', doAccept);
			list.key('esc', doCancel);

			content.screen.saveFocus();
			list.focus();
		});
	}

	// sink: target that can play audio
	// sink input: applications
	// source: input device
	// source output: input device stream

	let sinkInputs: SinkInput[] = [];
	let sinks: Sink[] = [];
	let side: 'inputs' | 'sinks' = 'inputs';

	function switchSide() {
		if (side === 'inputs') {
			side = 'sinks';

			sinkInputsList.style.selected.bg = 'grey';
			sinksList.style.selected.bg = 'red';

			sinksList.focus();
		} else if (side === 'sinks') {
			side = 'inputs';

			sinkInputsList.style.selected.bg = 'red';
			sinksList.style.selected.bg = 'grey';

			sinkInputsList.focus();
		}
	}

	function formatSinkInput(sinkInput: SinkInput) {
		return `#${sinkInput.id} ${sinkInput.properties['application.name']} - ${sinkInput.properties['media.name']}`;
	}

	function formatSink(sink: Sink) {
		return `#${sink.id} ${sink.properties['device.description']}`;
	}

	async function reloadData() {
		const sinkInputsSelection = sinkInputs[(sinkInputsList as any).selected];
		const sinksSelection = sinks[(sinksList as any).selected];

		// Ignore combine sink inputs as they don't allow moving to another sink
		sinkInputs = (await pactl.list('sink-inputs')).filter((sinkInput) => sinkInput.driver !== 'module-combine-sink.c');
		sinks = await pactl.list('sinks');

		sinkInputsList.clearItems();
		sinksList.clearItems();

		sinkInputs.forEach((sinkInput) => sinkInputsList.addItem(formatSinkInput(sinkInput) as unknown as string));
		sinks.forEach((sink) => sinksList.addItem(formatSink(sink) as unknown as string));

		const newSinkInputsIndex = !sinkInputsSelection ? 0 : sinkInputs.findIndex((sinkInput) => sinkInput.id >= sinkInputsSelection.id);
		const newSinksIndex = !sinksSelection ? 0 : sinks.findIndex((sink) => sink.id >= sinksSelection.id);

		sinkInputsList.select(newSinkInputsIndex === -1 ? sinkInputs.length - 1 : newSinkInputsIndex);
		sinksList.select(newSinksIndex === -1 ? sinks.length - 1 : newSinksIndex);

		content.screen.render();
	}

	sinkInputsList.on('select item', (item, index) => {
		const sinkInput = sinkInputs[index];
		if (!sinkInput) return;
		const sinkIndex = sinks.findIndex((sink) => sink.id === sinkInput.sink);

		if (sinkIndex !== -1) sinksList.select(sinkIndex);
	});

	await reloadData();

	sinkInputsList.focus();
}
