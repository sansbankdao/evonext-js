// src/base58ToBin.ts

const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const undefinedValue = 255
const uint8ArrayBase = 256

const BaseConversionError = {
    tooLong: 'An alphabet may be no longer than 254 characters.',
    ambiguousCharacter: 'A character code may only appear once in a single alphabet.',
    unknownCharacter: 'Encountered an unknown character for this alphabet.',
} as const

const alphabetMap = new Uint8Array(uint8ArrayBase).fill(undefinedValue)

for (let index = 0; index < alphabet.length; index++) {
    const characterCode = alphabet.charCodeAt(index)

    if (alphabetMap[characterCode] !== undefinedValue) {
        throw new Error('fail') // BaseConversionError.ambiguousCharacter
    }

    alphabetMap[characterCode] = index
}

const base = alphabet.length
const paddingCharacter = alphabet.charAt(0)
const factor = Math.log(base) / Math.log(uint8ArrayBase)

export default (input: string): Uint8Array => {
    if (input.length === 0) return Uint8Array.of()

    const firstNonZeroIndex = input
        .split('')
        .findIndex((character) => character !== paddingCharacter)

    if (firstNonZeroIndex === -1) {
        return new Uint8Array(input.length)
    }

    const requiredLength = Math.floor(
        (input.length - firstNonZeroIndex) * factor + 1
    )

    const decoded = new Uint8Array(requiredLength)

    let nextByte = firstNonZeroIndex
    let remainingBytes = 0

    while ((input[nextByte]) !== undefined) {
        let carry = alphabetMap[input.charCodeAt(nextByte)]
        if (carry === undefinedValue) {
            throw new Error(BaseConversionError.unknownCharacter)
        }

        let digit = 0

        for (
            let steps = requiredLength - 1;
            (carry !== 0 || digit < remainingBytes) && steps !== -1;
            steps--, digit++
        ) {
            carry += Math.floor(base * decoded[steps])
            decoded[steps] = Math.floor(carry % uint8ArrayBase)
            carry = Math.floor(carry / uint8ArrayBase)
        }

        remainingBytes = digit
        nextByte++
    }

    const firstNonZeroResultDigit = decoded.findIndex((value) => value !== 0)

    const bin = new Uint8Array(
        firstNonZeroIndex + (requiredLength - firstNonZeroResultDigit)
    )
    bin.set(decoded.slice(firstNonZeroResultDigit), firstNonZeroIndex)

    return bin
}
