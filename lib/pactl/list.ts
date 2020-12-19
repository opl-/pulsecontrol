import {getOutput, normalizeName, parseBytes} from './util';

export type Available = boolean | null;

export interface Profile {
	name: string;
	sinks: number;
	sources: number;
	priority: number;
	available: Available;
}

export type SampleFormat = 'u8' | 'aLaw' | 'uLaw' | 's16le' | 's16be' | 'float32le' | 'float32be' | 's32le' | 's32be' | 's24le' | 's24be' | 's24-32le' | 's24-32be';

export interface SampleSpecification {
	format: SampleFormat;
	channels: number;
	samplingRate: number;
}

export type ChannelPosition = 'mono' | 'front-center' | 'front-left' | 'front-right' | 'rear-center' | 'rear-left' | 'rear-right' | 'lfe' | 'front-left-of-center' | 'front-right-of-center' | 'side-left' | 'side-right' | 'aux0' | 'aux1' | 'aux2' | 'aux3' | 'aux4' | 'aux5' | 'aux6' | 'aux7' | 'aux8' | 'aux9' | 'aux10' | 'aux11' | 'aux12' | 'aux13' | 'aux14' | 'aux15' | 'aux16' | 'aux17' | 'aux18' | 'aux19' | 'aux20' | 'aux21' | 'aux22' | 'aux23' | 'aux24' | 'aux25' | 'aux26' | 'aux27' | 'aux28' | 'aux29' | 'aux30' | 'aux31' | 'top-center' | 'top-front-center' | 'top-front-left' | 'top-front-right' | 'top-rear-center' | 'top-rear-left' | 'top-rear-right';

export interface Volume {
	/** Raw value. 100% corresponds to 65536. */
	raw: number;
	percentage: number;
	/** Value in decibles. Can be `-Infinity`. */
	decibels: number;
}

export type ChannelVolumeList = {
	[key in ChannelPosition]?: Volume;
} & {
	balance: number;
};

export interface Latency {
	/** Unit: usec. */
	actual: number;
	/** Unit: usec. */
	configured: number;
}

export type DevicePortType = 'Unknown' | 'Aux' | 'Speaker' | 'Headphones' | 'Line' | 'Mic' | 'Headset' | 'Handset' | 'Earpiece' | 'SPDIF' | 'HDMI' | 'TV' | 'Radio' | 'Video' | 'USB' | 'Bluetooth' | 'Portable' | 'Handsfree' | 'Car' | 'HiFi' | 'Phone' | 'Network' | 'Analog';

export interface Module {
	type: 'Module';
	id: number;
	name: string;
	argument: string;
	usageCounter: number;
	properties: Record<string, string>;
}

export type FormatEncoding = 'pcm' | 'ac3-iec61937' | 'eac3-iec61937' | 'mpeg-iec61937' | 'dts-iec61937' | 'mpeg2-aac-iec61937' | 'truehd-iec61937' | 'dtshd-iec61937' | 'any';

export interface Format {
	encoding: FormatEncoding;
	properties?: Record<string, string>;
}

export type SinkState = 'INVALID' | 'RUNNING' | 'IDLE' | 'SUSPENDED';

export type SinkFlag = 'HARDWARE' | 'NETWORK' | 'HW_MUTE_CTRL' | 'HW_VOLUME_CTRL' | 'DECIBEL_VOLUME' | 'LATENCY' | 'SET_FORMATS';

export interface Port {
	description: string;
	type?: DevicePortType;
	priority: number;
	availabilityGroup?: string;
	available: Available;
}

export interface Sink {
	type: 'Sink';
	id: number;
	state: SinkState;
	name: string;
	description: string | null;
	driver: string | null;
	sampleSpecification: SampleSpecification;
	channelMap: ChannelPosition[];
	ownerModule: number;
	mute: boolean;
	volume: ChannelVolumeList;
	baseVolume: Volume;
	monitorSource: string | null;
	latency: Latency;
	flags: SinkFlag[];
	properties: Record<string, string>;
	ports?: Record<string, Port>;
	activePort?: string;
	formats?: Format[];
}

export type SourceState = 'INVALID' | 'RUNNING' | 'IDLE' | 'SUSPENDED';

export type SourceFlag = 'HARDWARE' | 'NETWORK' | 'HW_MUTE_CTRL' | 'HW_VOLUME_CTRL' | 'DECIBEL_VOLUME' | 'LATENCY';

export interface Source {
	type: 'Source';
	id: number;
	state: SourceState;
	name: string;
	description: string | null;
	driver: string | null;
	sampleSpecification: SampleSpecification;
	channelMap: ChannelPosition[];
	ownerModule: number;
	mute: boolean;
	volume: ChannelVolumeList;
	baseVolume: Volume;
	monitorOfSink: string | null;
	latency: Latency;
	flags: SourceFlag[];
	properties: Record<string, string>;
	ports?: Record<string, Port>;
	activePort?: string;
	formats?: Format[];
}

type ResampleMethod = 'src-sinc-best-quality' | 'src-sinc-medium-quality' | 'src-sinc-fastest' | 'src-zero-order-hold' | 'src-linear' | 'trivial' | 'speex-float-0' | 'speex-float-1' | 'speex-float-2' | 'speex-float-3' | 'speex-float-4' | 'speex-float-5' | 'speex-float-6' | 'speex-float-7' | 'speex-float-8' | 'speex-float-9' | 'speex-float-10' | 'speex-fixed-0' | 'speex-fixed-1' | 'speex-fixed-2' | 'speex-fixed-3' | 'speex-fixed-4' | 'speex-fixed-5' | 'speex-fixed-6' | 'speex-fixed-7' | 'speex-fixed-8' | 'speex-fixed-9' | 'speex-fixed-10' | 'ffmpeg' | 'auto' | 'copy' | 'peaks' | 'soxr-mq' | 'soxr-hq' | 'soxr-vh';

export interface SinkInput {
	type: 'Sink Input';
	id: number;
	driver: string | null;
	ownerModule: number | null;
	client: number | null;
	sink: number;
	sampleSpecification: SampleSpecification;
	channelMap: ChannelPosition[];
	format: Format;
	corked: boolean;
	mute: boolean;
	volume: ChannelVolumeList;
	/** Unit: usec. */
	bufferLatency: number;
	/** Unit: usec. */
	sinkLatency: number;
	resampleMethod: ResampleMethod | null;
	properties: Record<string, string>;
}

export interface SourceOutput {
	type: 'Source Output';
	id: number;
	driver: string | null;
	ownerModule: number | null;
	client: number | null;
	source: number;
	sampleSpecification: SampleSpecification;
	channelMap: ChannelVolumeList;
	format: Format;
	corked: boolean;
	mute: boolean;
	volume: ChannelVolumeList;
	/** Unit: usec. */
	bufferLatency: number;
	/** Unit: usec. */
	sourceLatency: number;
	resampleMethod: ResampleMethod | null;
	properties: Record<string, string>;
}

export interface Client {
	type: 'Client';
	driver: string | null;
	ownerModule: number | null;
	properties: Record<string, string>;
}

export interface Sample {
	type: 'Sample';
	name: string;
	sampleSpecification: SampleSpecification | null;
	channelMap: ChannelPosition[] | null;
	volume: ChannelVolumeList;
	/** Unit: seconds. */
	duration: number;
	size: number;
	lazy: boolean;
	filename: string | null;
	properties: Record<string, string>;
}

export interface CardPort {
	description: string;
	type?: DevicePortType;
	priority: number;
	/** Unit: usec. */
	latencyOffset: string;
	availabilityGroup?: string;
	available: Available;
	properties: Record<string, string>;
	partOfProfiles: string[];
}

export interface Card {
	type: 'Card';
	id: number;
	name: string;
	driver: string | null;
	ownerModule: number | null;
	properties: Record<string, string>;
	profiles?: Record<string, Profile>;
	activeProfile?: string;
	ports?: Record<string, CardPort>;
}

export type Thing = Module | Sink | Source | SinkInput | SourceOutput | Client | Sample | Card;

type Reader = (lines: string[], index: number, value: string) => any;

/** Special key for list reader types. Can't use symbols because TypeScript sucks. */
const DEFAULT_READER = '\0DEFAULT_READER';

/**
 * Reader that simply returns the passed in value. This is the default.
 */
function stringReader(lines: string[], indent: number, value: string): string {
	return value;
}

function optionalStringReader(lines: string[], indent: number, value: string): string | null {
	return ['n/a', '(null)'].includes(value) ? null : value;
}

function integerReader(lines: string[], indent: number, value: string): number {
	return parseInt(value, 10);
}

/**
 * Converts value to an integer number, or `null` if the value is not a number (such as the `n/a` string).
 */
function optionalIntegerReader(lines: string[], indent: number, value: string): number | null {
	return parseInt(value, 10) || null;
}

function floatReader(lines: string[], indent: number, value: string): number {
	return parseFloat(value);
}

function booleanReader(lines: string[], indent: number, value: string): boolean {
	return value === 'yes';
}

function bytesReader(lines: string[], indent: number, value: string): number {
	return parseBytes(value);
}

/**
 * Reads a list of values in the `a, b, c` format.
 */
function commaListReader(lines: string[], indent: number, value: string): string[] {
	return value.split(/, */g).filter((v) => v.length !== 0);
}

function optionalCommaListReader(lines: string[], indent: number, value: string): string[] | null {
	if (value === 'n/a') return null;

	return commaListReader(lines, indent, value);
}

/**
 * Reads a list of values in the `a b c` format.
 */
function spaceListReader(lines: string[], indent: number, value: string): string[] {
	return value.split(/ +/g).filter((v) => v.length !== 0);
}

function sampleSpecificationReader(lines: string[], indent: number, value: string): SampleSpecification | null {
	if (value === 'n/a') return null;

	const matched = /^([^ ]+) (\d+)ch (\d+)Hz$/.exec(value);
	if (!matched) throw new Error(`Invalid sample specification: ${JSON.stringify(value)}`);

	return {
		format: matched[1] as SampleFormat,
		channels: parseInt(matched[2], 10),
		samplingRate: parseInt(matched[3], 10),
	};
}

function volumeReader(lines: string[], indent: number, value: string): Volume {
	const matched = /^(\d+) \/ +(\d+)% \/ +(-inf|-?\d+\.\d+) dB$/.exec(value);
	if (!matched) throw new Error(`Invalid volume: ${JSON.stringify(value)}`);

	return {
		raw: parseInt(matched[1], 10),
		percentage: parseFloat(matched[2]),
		decibels: matched[3] === '-inf' ? -Infinity : parseFloat(matched[3]),
	};
}

function channelVolumeListReader(lines: string[], indent: number, value: string): ChannelVolumeList {
	const balanceLine = lines.shift();
	if (!balanceLine) throw new Error('Ran out of lines while trying to read balance');

	const matched = /balance (\d+\.\d+)/.exec(balanceLine);
	if (!matched) throw new Error(`Invalid balance found while reading channel volume list: ${JSON.stringify(lines)}`);

	const volumeList: ChannelVolumeList = {
		balance: parseFloat(matched[1]),
	};

	if (value !== '(invalid)') {
		value.split(/,\s+/g).map((channelInfo) => {
			const [channel, volume] = channelInfo.split(': ', 2);

			volumeList[channel as ChannelPosition] = volumeReader(lines, indent, volume);
		});
	}

	return volumeList;
}

function latencyReader(lines: string[], indent: number, value: string): Latency {
	const matched = /^(\d+) usec, configured (\d+) usec$/.exec(value);
	if (!matched) throw new Error(`Invalid latency: ${JSON.stringify(value)}`);

	return {
		actual: parseInt(matched[1], 10),
		configured: parseInt(matched[2], 10),
	};
}

function formatReader(lines: string[], indent: number, value: string): Format | null {
	const line = value || lines[0];
	if (!line) return null;

	const matched = /^(\t*([^,]+)(, )?)/.exec(line);
	if (!matched) throw new Error(`Invalid encoding format: ${JSON.stringify(line)}`);

	if (!value) lines.shift();

	const properties = !matched[3] ? null : readInlineProplist(lines, matched[1].length, line);

	return {
		encoding: matched[2] as FormatEncoding,
		...(!properties ? {} : {properties}),
	};
}

/**
 * Read lines using the `Key Name:` or `Key Name: Value` format, normalizing all key names.
 *
 * If current line is using the wrong format or has an invalid indent, no lines are consumed and `null` is returned instead.
 *
 * If the line has no value, `null` is returned in place of the second tuple value.
 */
function readColon(lines: string[], indent: number): [string, string | null] | null {
	const line = lines[0];

	const match = /^(\t*)(.+?):(?:$| (.*)$)/.exec(line);
	if (!match || match[1].length !== indent) return null;

	lines.shift();

	// Second value is `null` if match is undefined or its length is 0.
	return [normalizeName(match[2]), !match[3] ? null : match[3]];
}

/**
 * Reads a single prop using the `key = "value"` or `key = value` format.
 */
function readInlineProp(lines: string[], value: string, startAt: number): [string, string, number] | null {
	let buffer = value;
	let i = startAt;
	let lineI = startAt;
	let escaping = false;
	let readingValue = false;
	let valueQuoted = false;
	let text = '';
	let output: string[] = [];

	if (i >= buffer.length) return null;

	while (true) {
		// A prop can only span multiple lines if it has a quoted value: we don't need to load more lines in any other case.
		if (i >= buffer.length && readingValue && valueQuoted) {
			if (lines.length === 0) throw new Error(`Ran out data trying to read a prop (startAt = ${startAt}): ${JSON.stringify(buffer)}`);
			buffer += lines.shift();
			lineI = 0;
		}

		const c = buffer[i++];
		lineI++;

		if (readingValue) {
			if (escaping) {
				escaping = false;
				text += c;
				continue;
			} else if (c === '\\') {
				escaping = true;
				continue;
			}
		}

		if (!readingValue && c === ' ') {
			// Skip whitespace before key
			if (text.length === 0) continue;

			output.push(text);
			readingValue = true;
			text = '';

			if (buffer[i] !== '=') return null;

			// Skip past the quote if needed
			valueQuoted = buffer[i + ' "'.length] === '"';
			i += valueQuoted ? 3 : 2;
			lineI += valueQuoted ? 3 : 2;

			continue;
		} else if (readingValue && (valueQuoted ? c === '"' : (c === ' ' || c === undefined))) {
			output.push(text);
			break;
		}

		text += c;
	}

	return [output[0], output[1], lineI];
}

function readProp(lines: string[], indent: number = 0): [string, string] | null {
	const match = /^(\t*)(.+?) = "(.+)$/.exec(lines[0]);
	if (!match || match[1].length !== indent) return null;

	const line = lines.shift()!;

	return (readInlineProp(lines, line, indent)?.slice(0, 2) ?? null) as ([string, string] | null);
}

/**
 * Read a list of properties in the equals format.
 */
function propertiesReader(lines: string[], indent: number): Record<string, string> {
	const list: Record<string, string> = {};

	while (lines.length > 0) {
		const item = readProp(lines, indent);
		if (!item) break;

		list[item[0]] = item[1];
	}

	return list;
}

/**
 * Read lines using the `key = "value"` format, with props separated by spaces.
 *
 * If current line is using the wrong format, no lines are consumed and `null` is returned instead.
 */
function readInlineProplist(lines: string[], startAt: number, value: string): Record<string, string> | null {
	const proplist: Record<string, string> = {};
	let lineI = startAt;

	while (true) {
		const prop = readInlineProp(lines, value, lineI);
		if (!prop) break;

		proplist[prop[0]] = prop[1];
		lineI = prop[2];
	}

	return proplist;
}

/**
 * Keeps calling the passed in reader as long as the indentation level matches and the reader returns values other than `null`.
 */
function loopReader(reader: Reader): Reader {
	return (lines: string[], indent: number, value: string): any[] => {
		const output = [];

		while (lines.length > 0) {
			const matched = /^(\t*)/.exec(lines[0]);
			if (!matched || matched[1].length !== indent) break;

			const item = reader(lines, indent, value)
			if (item === null) break;

			output.push(item);
		}

		return output;
	};
}

function readDetailedList(lines: string[], indent: number, specialTypes: Record<string, Reader>): Record<string, any> {
	const things: Record<string, any> = {};

	while (lines.length > 0) {
		const line = readColon(lines, indent);
		if (!line) break;
		if (!line[1]) throw new Error(`Detailed list item is missing details: ${JSON.stringify(line[1])}`);

		const parsedDetails = /^(.+) \((.+?)\)$/.exec(line[1]);
		if (!parsedDetails) throw new Error(`Invalid value for detailed list item: ${JSON.stringify(line[1])}`);

		const thing: Record<string, any> = {
			description: parsedDetails[1],
		};
	
		parsedDetails[2].split(', ').forEach((detail) => {
			const prop = detail.split(': ', 2);

			// Special case for ports, because they're special.
			if (prop.length === 1) {
				if (prop[0] === 'not available') thing.available = false;
				else if (prop[0] === 'available') thing.available = true;
				else if (prop[0] === 'availability unknown') thing.available = null;

				return;
			}

			const name = normalizeName(prop[0]);

			const propType = specialTypes[name] || specialTypes[DEFAULT_READER] || stringReader;
	
			// Pass control to another reader. This will probably break everything if the reader consumes any lines.
			thing[name] = propType(lines, 0, prop[1]);
		});

		things[line[0]] = readList(thing, lines, indent + 1, specialTypes);
	}

	return things;
}

function detailedListReader(specialTypes: Record<string, Reader>): Reader {
	return (lines: string[], indent: number) => readDetailedList(lines, indent, specialTypes);
}

function readList(thing: Record<string, any>, lines: string[], indent: number, specialTypes: Record<string, Reader>): Record<string, any> {
	while (lines.length > 0) {
		const line = readColon(lines, indent);
		if (!line) break;

		const lineType = specialTypes[line[0]] || specialTypes[DEFAULT_READER] || stringReader;

		// Pass control to another reader
		// This cast to string is unsafe, but I do not care enough to make TypeScript fine with that (by either doing weird type stuff nor by validating inputs for all readers).
		thing[line[0]] = lineType(lines, indent + 1, line[1] as string);
	}

	return thing;
}

// Based on https://gitlab.freedesktop.org/pulseaudio/pulseaudio/-/blob/master/src/utils/pactl.c
const THING_FORMAT: Record<string, Record<string, Reader>> = {
	Module: {
		usageCounter: optionalIntegerReader,
		properties: propertiesReader,
	},
	Sink: {
		description: optionalStringReader,
		driver: optionalStringReader,
		sampleSpecification: sampleSpecificationReader,
		channelMap: commaListReader,
		ownerModule: integerReader,
		mute: booleanReader,
		volume: channelVolumeListReader,
		baseVolume: volumeReader,
		monitorSource: optionalStringReader,
		latency: latencyReader,
		flags: spaceListReader,
		properties: propertiesReader,
		ports: detailedListReader({
			priority: integerReader,
		}),
		formats: loopReader(formatReader),
	},
	Source: {
		description: optionalStringReader,
		driver: optionalStringReader,
		sampleSpecification: sampleSpecificationReader,
		channelMap: commaListReader,
		ownerModule: integerReader,
		mute: booleanReader,
		volume: channelVolumeListReader,
		baseVolume: volumeReader,
		monitorOfSink: optionalStringReader,
		latency: latencyReader,
		flags: spaceListReader,
		properties: propertiesReader,
		ports: detailedListReader({
			priority: integerReader,
		}),
		formats: loopReader(formatReader),
	},
	'Sink Input': {
		driver: optionalStringReader,
		ownerModule: optionalIntegerReader,
		client: optionalIntegerReader,
		sink: integerReader,
		sampleSpecification: sampleSpecificationReader,
		channelMap: commaListReader,
		format: formatReader,
		corked: booleanReader,
		mute: booleanReader,
		volume: channelVolumeListReader,
		bufferLatency: integerReader,
		sinkLatency: integerReader,
		resampleMethod: optionalStringReader,
		properties: propertiesReader,
	},
	'Source Output': {
		driver: optionalStringReader,
		ownerModule: optionalIntegerReader,
		client: optionalIntegerReader,
		source: integerReader,
		sampleSpecification: sampleSpecificationReader,
		channelMap: commaListReader,
		format: formatReader,
		corked: booleanReader,
		mute: booleanReader,
		volume: channelVolumeListReader,
		bufferLatency: integerReader,
		sinkLatency: integerReader,
		resampleMethod: optionalStringReader,
		properties: propertiesReader,
	},
	Client: {
		driver: optionalStringReader,
		ownerModule: optionalIntegerReader,
		properties: propertiesReader,
	},
	Sample: {
		sampleSpecification: sampleSpecificationReader,
		channelMap: optionalCommaListReader,
		volume: channelVolumeListReader,
		duration: floatReader,
		size: bytesReader,
		lazy: booleanReader,
		filename: optionalStringReader,
		properties: propertiesReader,
	},
	Card: {
		driver: optionalStringReader,
		ownerModule: optionalIntegerReader,
		properties: propertiesReader,
		profiles: detailedListReader({
			sinks: integerReader,
			sources: integerReader,
			priority: integerReader,
			available: booleanReader,
		}),
		ports: detailedListReader({
			priority: integerReader,
			latencyOffset: integerReader, // Actual format is `\d+ usec`, but the unit is hardcoded
			properties: propertiesReader,
			partOfProfiles: commaListReader,
		}),
	},
};

export function parseOutput(output: string): Thing[] {
	// Replace all tabs followed by 8 spaces with a double tab, because the sink balance information is special.
	const lines = output.replace(/\t        /g, '\t\t').split('\n');
	const things: Thing[] = [];

	while (lines.length > 0) {
		const line = lines[0];
		const match = /([\w ]+) #(\d+)/.exec(line);

		lines.shift();

		if (!match || !THING_FORMAT[match[1]]) continue;

		const thing = readList({
			type: match[1],
			id: parseInt(match[2], 10),
		}, lines, 1, THING_FORMAT[match[1]]);

		things.push(thing as Thing);
	}

	return things;
}

export type ListType = 'modules' | 'sinks' | 'sources' | 'sink-inputs' | 'source-outputs' | 'clients' | 'samples' | 'cards';

export function list(type: 'modules'): Promise<Module[]>;
export function list(type: 'sinks'): Promise<Sink[]>;
export function list(type: 'sources'): Promise<Source[]>;
export function list(type: 'sink-inputs'): Promise<SinkInput[]>;
export function list(type: 'source-outputs'): Promise<SourceOutput[]>;
export function list(type: 'clients'): Promise<Client[]>;
export function list(type: 'samples'): Promise<Sample[]>;
export function list(type: 'cards'): Promise<Card[]>;
export function list(type?: ListType | null): Promise<Thing[]>;
export async function list(type: ListType | null = null): Promise<Thing[]> {
	const output = await getOutput(['list'].concat(type ?? []));

	return parseOutput(output);
}
