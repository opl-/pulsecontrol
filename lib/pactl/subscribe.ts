import {spawn} from 'child_process';

export interface PAEvent {
	type: string;
	onType: string;
	onId: number;
}

export function subscribe(callback: (event: PAEvent) => void): () => Promise<void> {
	const process = spawn('pactl', ['subscribe'], {
		shell: false,
	});

	process.stdout.on('data', (data: Buffer) => {
		data.toString('utf8').split('\n').forEach((event) => {
			// Event 'change' on sink-input #29896
			const parsed = /^Event '([^']+)' on ([^ ]+) #(\d+)$/.exec(event);
			if (!parsed) throw new Error(`Received unknown event: ${JSON.stringify(event)}`);

			callback({
				type: parsed[1],
				onType: parsed[2],
				onId: parseInt(parsed[1], 10),
			});
		});
	});

	return () => new Promise((resolve) => {
		if (process.exitCode !== null) return resolve();

		process.once('exit', () => resolve());

		process.kill();
	});
}
