import {getOutput, parseBytes} from './util';

export async function stat() {
	const output = await getOutput(['stat']);

	const stats = /Currently in use: (\d+) blocks containing (\d+(?:\.?\d+)? \w+) bytes total\.\nAllocated during whole lifetime: (\d+) blocks containing (\d+(?:\.?\d+)? \w+) bytes total\.\nSample cache size: (\d+(?:\.?\d+)? \w+)/.exec(output);
	if (stats === null) throw new Error('Invalid stat output');

	return {
		usedBlocks: parseInt(stats[1], 10),
		usedBytes: parseBytes(stats[2]),
		lifetimeBlocks: parseInt(stats[3], 10),
		lifetimeBytes: parseBytes(stats[4]),
		sampleCacheBytes: parseBytes(stats[5]),
	};
}
