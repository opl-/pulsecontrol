import {Format} from './list';
import {getOutput, stringifyProps} from './util';

export async function loadModule(moduleName: string, args: Record<string, string> = {}): Promise<number> {
	const output = await getOutput(['load-module', moduleName, ...stringifyProps(args)]);

	return parseInt(output, 10);
}

export async function unloadModule(moduleNameOrId: string | number): Promise<void> {
	await getOutput(['unload-module', `${moduleNameOrId}`]);
}

export async function moveSinkInput(playbackStreamId: number, sinkNameOrId: string | number): Promise<void> {
	await getOutput(['move-sink-input', `${playbackStreamId}`, `${sinkNameOrId}`]);
}

export async function moveSourceOutput(recordingStreamId: number, sourceNameOrId: string | number): Promise<void> {
	await getOutput(['move-source-output', `${recordingStreamId}`, `${sourceNameOrId}`]);
}

export async function suspendSink(sinkNameOrId: string | number, suspend: boolean = true): Promise<void> {
	await getOutput(['suspend-sink', `${sinkNameOrId}`, suspend ? '1' : '0']);
}

export async function resumeSink(sinkNameOrId: string | number): Promise<void> {
	return suspendSink(sinkNameOrId, false);
}

export async function suspendSource(sourceNameOrId: string | number, suspend: boolean = true): Promise<void> {
	await getOutput(['suspend-source', `${sourceNameOrId}`, suspend ? '1' : '0']);
}

export async function resumeSource(sourceNameOrId: string | number): Promise<void> {
	return suspendSource(sourceNameOrId, false);
}

export async function setCardProfile(cardId: number, profileName: string): Promise<void> {
	await getOutput(['set-card-profile', `${cardId}`, profileName]);
}

export async function setDefaultSink(sinkName: string): Promise<void> {
	await getOutput(['set-default-sink', sinkName]);
}

export async function setDefaultSource(sourceName: string): Promise<void> {
	await getOutput(['set-default-source', sourceName]);
}

export async function setSinkPort(sinkNameOrId: string | number, portName: string): Promise<void> {
	await getOutput(['set-sink-port', `${sinkNameOrId}`, portName]);
}

export async function setSourcePort(sourceNameOrId: string | number, portName: string): Promise<void> {
	await getOutput(['set-source-port', `${sourceNameOrId}`, portName]);
}

export async function setPortLatencyOffset(cardNameOrId: string | number, portName: string, offset: number): Promise<void> {
	await getOutput(['set-port-latency-offset', `${cardNameOrId}`, portName, `${offset}`]);
}

export async function setSinkVolume(sinkNameOrId: string | number, volume: number | string | (number | string)[]): Promise<void> {
	await getOutput(['set-sink-volume', `${sinkNameOrId}`, ...([] as Array<string | number>).concat(volume).map((v) => `${v}`)]);
}

export async function setSourceVolume(sourceNameOrId: string | number, volume: number | string | (number | string)[]): Promise<void> {
	await getOutput(['set-source-volume', `${sourceNameOrId}`, ...([] as Array<string | number>).concat(volume).map((v) => `${v}`)]);
}

export async function setSinkInputVolume(inputId: number, volume: number | string | (number | string)[]): Promise<void> {
	await getOutput(['set-sink-input-volume', `${inputId}`, ...([] as Array<string | number>).concat(volume).map((v) => `${v}`)]);
}

export async function setSourceOutputVolume(outputId: number, volume: number | string | (number | string)[]): Promise<void> {
	await getOutput(['set-source-output-volume', `${outputId}`, ...([] as Array<string | number>).concat(volume).map((v) => `${v}`)]);
}

export async function setSinkMute(sinkNameOrId: string | number, muted: boolean): Promise<void> {
	await getOutput(['set-sink-mute', `${sinkNameOrId}`, muted ? '1' : '0']);
}

export async function toggleSinkMute(sinkNameOrId: string | number): Promise<void> {
	await getOutput(['set-sink-mute', `${sinkNameOrId}`, 'toggle']);
}

export async function setSourceMute(sourceNameOrId: string | number, muted: boolean): Promise<void> {
	await getOutput(['set-source-mute', `${sourceNameOrId}`, muted ? '1' : '0']);
}

export async function toggleSourceMute(sourceNameOrId: string | number): Promise<void> {
	await getOutput(['set-source-mute', `${sourceNameOrId}`, 'toggle']);
}

export async function setSinkInputMute(inputId: number, muted: boolean): Promise<void> {
	await getOutput(['set-sink-input-mute', `${inputId}`, muted ? '1' : '0']);
}

export async function toggleSinkInputMute(inputId: number): Promise<void> {
	await getOutput(['set-sink-input-mute', `${inputId}`, 'toggle']);
}

export async function setSourceOutputMute(outputId: number, muted: boolean): Promise<void> {
	await getOutput(['set-source-output-mute', `${outputId}`, muted ? '1' : '0']);
}

export async function toggleSourceOutputMute(outputId: number): Promise<void> {
	await getOutput(['set-source-output-mute', `${outputId}`, 'toggle']);
}

export async function setSinkFormats(sinkId: number, formats: Format[]): Promise<void> {
	await getOutput(['set-sink-formats', `${sinkId}`, formats.map((format) => `${format.encoding}, ${!format.properties ? '' : stringifyProps(format.properties).join(', ')}`).join('; ')]);
}
