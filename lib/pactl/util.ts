import {spawn} from 'child_process';

export function normalizeName(str: string): string {
	return str.split(' ').map((s, i) => i === 0 ? s.toLowerCase() : `${s[0].toUpperCase()}${s.toLowerCase().substr(1)}`).join('').replace(/[\(\)]/g, '');
}

export function parseOutputList(str: string): Record<string, string> {
	const out = Object.create(null);
	const regex = /\s+([\w ]+): ([^\n]+)/g;
	let match;

	while (match = regex.exec(str)) {
		out[normalizeName(match[1])] = match[2];
	}

	return out;
}

export function parseBytes(str: string): number {
	const match = /(\d+(?:\.\d+)?) (\w+)/.exec(str);
	if (match === null) throw new Error(`Invalid bytes: ${str}`);

	const UNITS: Record<string, number> = {
		B: 1,
		KiB: 1024,
		MiB: 1024 * 1024,
		GiB: 1024 * 1024 * 1024,
	};

	if (UNITS[match[2]] === undefined) throw new Error(`Invalid byte unit: ${match[2]}`);

	return parseFloat(match[1]) * UNITS[match[2]];
}

export function getOutput(args: string[]): Promise<any> {
	return new Promise((resolve, reject) => {
		const process = spawn('pactl', args, {
			shell: false,
		});

		const data: Buffer[] = [];
		const errorData: Buffer[] = [];

		process.stdout.on('data', (d: Buffer) => {
			data.push(d);
		});

		process.stderr.on('data', (d: Buffer) => {
			errorData.push(d);
		});

		process.on('exit', (code) => {
			if (code === 0) {
				resolve(Buffer.concat(data).toString('utf8'));
			} else {
				reject(new Error(Buffer.concat(errorData).toString('utf8')));
			}
		});
	});
}
