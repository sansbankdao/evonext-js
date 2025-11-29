// index.ts

/* Import (local) modules. */
import base58ToBin from './src/base58ToBin'
import bigIntToBinUint16LE from './src/bigIntToBinUint16LE'
import bigIntToBinUint32LE from './src/bigIntToBinUint32LE'
import bigIntToBinUint64LE from './src/bigIntToBinUint64LE'
import bigIntToBitcoinVarInt from './src/bigIntToBitcoinVarInt'
import bigIntToCompactUint from './src/bigIntToCompactUint'
import binToBase58 from './src/binToBase58'
import binToHex from './src/binToHex'
import binToUtf8 from './src/binToUtf8'
import flattenBinArray from './src/flattenBinArray'
import hexToBase64 from './src/hexToBase64'
import hexToBin from './src/hexToBin'
import isHex from './src/isHex'
import isJson from './src/isJson'
import numberToBinUint16BE from './src/numberToBinUint16BE'
import numberToBinUint16LE from './src/numberToBinUint16LE'
import numberToBinUint32BE from './src/numberToBinUint32BE'
import numberToBinUint32LE from './src/numberToBinUint32LE'
import numberToBinUintLE from './src/numberToBinUintLE'
import reverseHex from './src/reverseHex'
import shuffle from './src/shuffle'
import sleep from './src/sleep'
import utf8ToBin from './src/utf8ToBin'

/* Export (local) modules. */
export {
    base58ToBin,
    bigIntToBinUint16LE,
    bigIntToBinUint32LE,
    bigIntToBinUint64LE,
    bigIntToBitcoinVarInt,
    bigIntToCompactUint,
    binToBase58,
    binToHex,
    binToUtf8,
    flattenBinArray,
    hexToBase64,
    hexToBin,
    isHex,
    isJson,
    numberToBinUint16BE,
    numberToBinUint16LE,
    numberToBinUint32BE,
    numberToBinUint32LE,
    numberToBinUintLE,
    reverseHex,
    shuffle,
    sleep,
    utf8ToBin
}

/**
 * Utils Class
 *
 * A suite of useful utilities.
 */
export class Utils {
    // NOTE: We won't use a constructor, as this is a "pure" class.

    static reverseHex(_bytes: string): string {
        return reverseHex(_bytes)
    }

    static sleep(_milliseconds: number): Promise<void> {
        return sleep(_milliseconds)
    }
}

/* Define EvoNext interface for better typing */
interface EvoNextGlobal {
    Utils: typeof Utils
    base58ToBin: typeof base58ToBin
    bigIntToBinUint16LE: typeof bigIntToBinUint16LE
    bigIntToBinUint32LE: typeof bigIntToBinUint32LE
    bigIntToBinUint64LE: typeof bigIntToBinUint64LE
    bigIntToBitcoinVarInt: typeof bigIntToBitcoinVarInt
    bigIntToCompactUint: typeof bigIntToCompactUint
    binToBase58: typeof binToBase58
    binToHex: typeof binToHex
    binToUtf8: typeof binToUtf8
    flattenBinArray: typeof flattenBinArray
    hexToBase64: typeof hexToBase64
    hexToBin: typeof hexToBin
    isHex: typeof isHex
    isJson: typeof isJson
    numberToBinUint16BE: typeof numberToBinUint16BE
    numberToBinUint16LE: typeof numberToBinUint16LE
    numberToBinUint32BE: typeof numberToBinUint32BE
    numberToBinUint32LE: typeof numberToBinUint32LE
    numberToBinUintLE: typeof numberToBinUintLE
    reverseHex: typeof reverseHex
    shuffle: typeof shuffle
    sleep: typeof sleep
    utf8ToBin: typeof utf8ToBin
}

/* Initialize (globalThis) EvoNext class. */
const EvoNext: EvoNextGlobal = {} as EvoNextGlobal

/* Initialize Utilities class. */
EvoNext.Utils = Utils

/* Initialize Utilities modules. */
EvoNext.base58ToBin = base58ToBin
EvoNext.bigIntToBinUint16LE = bigIntToBinUint16LE
EvoNext.bigIntToBinUint32LE = bigIntToBinUint32LE
EvoNext.bigIntToBinUint64LE = bigIntToBinUint64LE
EvoNext.bigIntToBitcoinVarInt = bigIntToBitcoinVarInt
EvoNext.bigIntToCompactUint = bigIntToCompactUint
EvoNext.binToBase58 = binToBase58
EvoNext.binToHex = binToHex
EvoNext.binToUtf8 = binToUtf8
EvoNext.flattenBinArray = flattenBinArray
EvoNext.hexToBase64 = hexToBase64
EvoNext.hexToBin = hexToBin
EvoNext.isHex = isHex
EvoNext.isJson = isJson
EvoNext.numberToBinUint16BE = numberToBinUint16BE
EvoNext.numberToBinUint16LE = numberToBinUint16LE
EvoNext.numberToBinUint32BE = numberToBinUint32BE
EvoNext.numberToBinUint32LE = numberToBinUint32LE
EvoNext.numberToBinUintLE = numberToBinUintLE
EvoNext.reverseHex = reverseHex
EvoNext.shuffle = shuffle
EvoNext.sleep = sleep
EvoNext.utf8ToBin = utf8ToBin

/* Export EvoNext to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
;(globalThis as any).EvoNext = {
    ...(globalThis as any).EvoNext, // preserve EvoNext object
    ...EvoNext, // extend EvoNext object
}
