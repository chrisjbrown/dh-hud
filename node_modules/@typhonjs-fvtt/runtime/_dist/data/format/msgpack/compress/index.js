import { unpack, pack } from '@typhonjs-fvtt/runtime/data/format/msgpack';
import { inflateSync, deflateSync } from '@typhonjs-fvtt/runtime/data/compress';
import { toUint8Array, fromUint8Array } from '@typhonjs-fvtt/runtime/data/format/base64';

/**
 * Inflates given data then unpacks with MessagePack. This function is the inverse of `packAndDeflate`.
 *
 * @param {Uint8Array}  data - Any data.
 *
 * @param {object}   [opts] - Optional parameters.
 *
 * @param {import('#runtime/data/compress').InflateOptions} [opts.inflateOptions] - Inflate options.
 *
 * @returns {any} Inflated and unpacked data.
 */
function inflateAndUnpack(data, { inflateOptions } = {})
{
   return unpack(inflateSync(data, inflateOptions));
}

/**
 * Converts Base64 string to Uint8Array / inflates then unpacks with MessagePack. This function is the inverse of
 * `packAndDeflateB64`.
 *
 * @param {string}  data - Any Base64 data that has been compressed with
 *
 * @param {object}   [opts] - Optional parameters.
 *
 * @param {import('#runtime/data/compress').InflateOptions} [opts.inflateOptions] - Inflate options.
 *
 * @returns {any} Inflated and unpacked data.
 */
function inflateAndUnpackB64(data, { inflateOptions } = {})
{
   return unpack(inflateSync(toUint8Array(data), inflateOptions));
}

/**
 * Packs given data with MessagePack then deflates / compresses with Zlib. The inverse function to inflate is
 * `inflateAndUnpack`.
 *
 * @param {any}   data - Any data.
 *
 * @param {object}   [opts] - Optional parameters.
 *
 * @param {import('#runtime/data/compress').DeflateOptions} [opts.deflateOptions] - Deflate options.
 *
 * @returns {Uint8Array} Packed and compressed data.
 */
function packAndDeflate(data, { deflateOptions } = {})
{
   return deflateSync(pack(data), deflateOptions);
}

/**
 * Packs given data with MessagePack then deflates / compresses with Zlib then converts the Uint8Array to a Base64
 * string. The inverse function to inflate is `inflateAndUnpackB64`.
 *
 * @param {any}   data - Any data.
 *
 * @param {object}   [opts] - Optional parameters.
 *
 * @param {import('#runtime/data/compress').DeflateOptions} [opts.deflateOptions] - Deflate options.
 *
 * @param {boolean}  [opts.urlsafe] - Base64 string is URL-and-filename-safe a la `RFC4648 §5`.
 *
 * @returns {string} Packed / compressed / Base64 string.
 */
function packAndDeflateB64(data, { deflateOptions, urlsafe } = {})
{
   return fromUint8Array(deflateSync(pack(data), deflateOptions), urlsafe);
}

export { inflateAndUnpack, inflateAndUnpackB64, packAndDeflate, packAndDeflateB64 };
//# sourceMappingURL=index.js.map
