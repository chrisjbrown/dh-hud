import { Transform } from 'stream';

declare enum FLOAT32_OPTIONS {
  NEVER = 0,
  ALWAYS = 1,
  DECIMAL_ROUND = 3,
  DECIMAL_FIT = 4,
}

interface Options {
  useFloat32?: FLOAT32_OPTIONS;
  useRecords?: boolean | ((value: any) => boolean);
  structures?: {}[];
  moreTypes?: boolean;
  sequential?: boolean;
  structuredClone?: boolean;
  mapsAsObjects?: boolean;
  variableMapSize?: boolean;
  coercibleKeyAsNumber?: boolean;
  copyBuffers?: boolean;
  bundleStrings?: boolean;
  useTimestamp32?: boolean;
  largeBigIntToFloat?: boolean;
  largeBigIntToString?: boolean;
  useBigIntExtension?: boolean;
  encodeUndefinedAsNil?: boolean;
  maxSharedStructures?: number;
  maxOwnStructures?: number;
  mapAsEmptyObject?: boolean;
  setAsEmptyObject?: boolean;
  writeFunction?: () => any;
  /** @deprecated use int64AsType: 'number' */
  int64AsNumber?: boolean;
  int64AsType?: 'bigint' | 'number' | 'string';
  shouldShareStructure?: (keys: string[]) => boolean;
  getStructures?(): {}[];
  saveStructures?(structures: {}[]): boolean | void;
  onInvalidDate?: () => any;
}
interface Extension {
  Class?: Function;
  type?: number;
  pack?(value: any): Buffer | Uint8Array;
  unpack?(messagePack: Buffer | Uint8Array): any;
  read?(datum: any): any;
  write?(instance: any): any;
}
type UnpackOptions = { start?: number; end?: number; lazy?: boolean } | number;
declare class Unpackr {
  constructor(options?: Options);
  unpack(messagePack: Buffer | Uint8Array, options?: UnpackOptions): any;
  decode(messagePack: Buffer | Uint8Array, options?: UnpackOptions): any;
  unpackMultiple(messagePack: Buffer | Uint8Array): any[];
  unpackMultiple(messagePack: Buffer | Uint8Array, forEach: (value: any, start?: number, end?: number) => any): void;
}
declare class Decoder extends Unpackr {}
declare function unpack(messagePack: Buffer | Uint8Array, options?: UnpackOptions): any;
declare function unpackMultiple(messagePack: Buffer | Uint8Array): any[];
declare function unpackMultiple(
  messagePack: Buffer | Uint8Array,
  forEach: (value: any, start?: number, end?: number) => any,
): void;
declare function decode(messagePack: Buffer | Uint8Array, options?: UnpackOptions): any;
declare function addExtension(extension: Extension): void;
declare function clearSource(): void;
declare function roundFloat32(float32Number: number): number;
declare const C1: {};
declare let isNativeAccelerationEnabled: boolean;

declare class Packr extends Unpackr {
  offset: number;
  position: number;
  pack(value: any, encodeOptions?: number): Buffer;
  encode(value: any, encodeOptions?: number): Buffer;
  useBuffer(buffer: Buffer | Uint8Array): void;
  clearSharedData(): void;
}
declare class Encoder extends Packr {}
declare function pack(value: any, encodeOptions?: number): Buffer;
declare function encode(value: any, encodeOptions?: number): Buffer;

declare const REUSE_BUFFER_MODE: number;
declare const RESET_BUFFER_MODE: number;
declare const RESERVE_START_SPACE: number;

declare class UnpackrStream extends Transform {
  constructor(options?: Options | { highWaterMark: number; emitClose: boolean; allowHalfOpen: boolean });
}
declare class PackrStream extends Transform {
  constructor(options?: Options | { highWaterMark: number; emitClose: boolean; allowHalfOpen: boolean });
}

export {
  C1,
  Decoder,
  Encoder,
  FLOAT32_OPTIONS,
  type Options,
  Packr,
  PackrStream,
  RESERVE_START_SPACE,
  RESET_BUFFER_MODE,
  REUSE_BUFFER_MODE,
  type UnpackOptions,
  Unpackr,
  UnpackrStream,
  addExtension,
  clearSource,
  decode,
  encode,
  isNativeAccelerationEnabled,
  pack,
  roundFloat32,
  unpack,
  unpackMultiple,
};
