import {getOutput, parseOutputList} from './util';

export async function info() {
	const output = await getOutput(['info']);

	return parseOutputList(output);
}
