import {Format} from './list';
import {getOutput} from './util';

function stringifyProps(properties: Record<string, string>): string[] {
	return Object.entries(properties).reduce((acc, [key, value]) => {
		acc.push(`${key}=${value.replace(/ /g, '\\ ')}`);

		return acc;
	}, [] as string[]);
}

// FIXME: these return trues are useless

export async function loadModule(moduleName: string, args: Record<string, string> = {}): Promise<number> {
	const output = await getOutput(['load-module', moduleName, ...stringifyProps(args)]);

	return parseInt(output, 10);
}

export async function unloadModule(moduleNameOrId: string | number): Promise<true> {
	await getOutput(['unload-module', `${moduleNameOrId}`]);

	return true;
}

export async function moveSinkInput(playbackStreamId: number, sinkNameOrId: string | number): Promise<true> {
	await getOutput(['move-sink-input', `${playbackStreamId}`, `${sinkNameOrId}`]);

	return true;
}

export async function moveSourceOutput(recordingStreamId: number, sourceNameOrId: string | number): Promise<true> {
	await getOutput(['move-source-output', `${recordingStreamId}`, `${sourceNameOrId}`]);

	return true;
}

export async function suspendSink(sinkNameOrId: string | number, suspend: boolean = true): Promise<true> {
	await getOutput(['suspend-sink', `${sinkNameOrId}`, suspend ? '1' : '0']);

	return true;
}

export async function resumeSink(sinkNameOrId: string | number): Promise<true> {
	return suspendSink(sinkNameOrId, false);
}

export async function suspendSource(sourceNameOrId: string | number, suspend: boolean = true): Promise<true> {
	await getOutput(['suspend-source', `${sourceNameOrId}`, suspend ? '1' : '0']);

	return true;
}

export async function resumeSource(sourceNameOrId: string | number): Promise<true> {
	return suspendSource(sourceNameOrId, false);
}

export async function setCardProfile(cardId: number, profileName: string): Promise<true> {
	await getOutput(['set-card-profile', `${cardId}`, profileName]);

	return true;
}

export async function setDefaultSink(sinkName: string): Promise<true> {
	await getOutput(['set-default-sink', sinkName]);

	return true;
}

export async function setDefaultSource(sourceName: string): Promise<true> {
	await getOutput(['set-default-source', sourceName]);

	return true;
}

export async function setSinkPort(sinkNameOrId: string | number, portName: string): Promise<true> {
	await getOutput(['set-sink-port', `${sinkNameOrId}`, portName]);

	return true;
}

export async function setSourcePort(sourceNameOrId: string | number, portName: string): Promise<true> {
	await getOutput(['set-source-port', `${sourceNameOrId}`, portName]);

	return true;
}

export async function setPortLatencyOffset(cardNameOrId: string | number, portName: string, offset: number): Promise<true> {
	await getOutput(['set-port-latency-offset', `${cardNameOrId}`, portName, `${offset}`]);

	return true;
}

export async function setSinkVolume(sinkNameOrId: string | number, volume: number | string | (number | string)[]): Promise<true> {
	await getOutput(['set-sink-volume', `${sinkNameOrId}`, ...([] as Array<string | number>).concat(volume).map((v) => `${v}`)]);

	return true;
}

export async function setSourceVolume(sourceNameOrId: string | number, volume: number | string | (number | string)[]): Promise<true> {
	await getOutput(['set-source-volume', `${sourceNameOrId}`, ...([] as Array<string | number>).concat(volume).map((v) => `${v}`)]);

	return true;
}

export async function setSinkInputVolume(inputId: number, volume: number | string | (number | string)[]): Promise<true> {
	await getOutput(['set-sink-input-volume', `${inputId}`, ...([] as Array<string | number>).concat(volume).map((v) => `${v}`)]);

	return true;
}

export async function setSourceOutputVolume(outputId: number, volume: number | string | (number | string)[]): Promise<true> {
	await getOutput(['set-source-output-volume', `${outputId}`, ...([] as Array<string | number>).concat(volume).map((v) => `${v}`)]);

	return true;
}

export async function setSinkMute(sinkNameOrId: string | number, muted: boolean): Promise<true> {
	await getOutput(['set-sink-mute', `${sinkNameOrId}`, muted ? '1' : '0']);

	return true;
}

export async function toggleSinkMute(sinkNameOrId: string | number): Promise<true> {
	await getOutput(['set-sink-mute', `${sinkNameOrId}`, 'toggle']);

	return true;
}

export async function setSourceMute(sourceNameOrId: string | number, muted: boolean): Promise<true> {
	await getOutput(['set-source-mute', `${sourceNameOrId}`, muted ? '1' : '0']);

	return true;
}

export async function toggleSourceMute(sourceNameOrId: string | number): Promise<true> {
	await getOutput(['set-source-mute', `${sourceNameOrId}`, 'toggle']);

	return true;
}

export async function setSinkInputMute(inputId: number, muted: boolean): Promise<true> {
	await getOutput(['set-sink-input-mute', `${inputId}`, muted ? '1' : '0']);

	return true;
}

export async function toggleSinkInputMute(inputId: number): Promise<true> {
	await getOutput(['set-sink-input-mute', `${inputId}`, 'toggle']);

	return true;
}

export async function setSourceOutputMute(outputId: number, muted: boolean): Promise<true> {
	await getOutput(['set-source-output-mute', `${outputId}`, muted ? '1' : '0']);

	return true;
}

export async function toggleSourceOutputMute(outputId: number): Promise<true> {
	await getOutput(['set-source-output-mute', `${outputId}`, 'toggle']);

	return true;
}

export async function setSinkFormats(sinkId: number, formats: Format[]): Promise<true> {
	await getOutput(['set-sink-formats', `${sinkId}`, formats.map((format) => `${format.encoding}, ${!format.properties ? '' : stringifyProps(format.properties).join(', ')}`).join('; ')]);

	return true;
}
