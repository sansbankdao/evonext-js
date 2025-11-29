// src/binToBAse58.ts

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
const inverseFactor = Math.log(uint8ArrayBase) / Math.log(base)

export default (input: Uint8Array): string => {
    if (input.length === 0) return ''

    const firstNonZeroIndex = input.findIndex((byte) => byte !== 0)

    if (firstNonZeroIndex === -1) {
        return paddingCharacter.repeat(input.length)
    }

    const requiredLength = Math.floor(
        (input.length - firstNonZeroIndex) * inverseFactor + 1
    )

    const encoded = new Uint8Array(requiredLength)

    let nextByte = firstNonZeroIndex
    let remainingBytes = 0

    while (nextByte !== input.length) {
        let carry = input[nextByte]
        let digit = 0

        for (
            let steps = requiredLength - 1;
            (carry !== 0 || digit < remainingBytes) && steps !== -1;
            steps--, digit++
        ) {
            carry += Math.floor(uint8ArrayBase * encoded[steps])
            encoded[steps] = Math.floor(carry % base)
            carry = Math.floor(carry / base)
        }

        remainingBytes = digit
        nextByte++
    }

    const firstNonZeroResultDigit = encoded.findIndex((value) => value !== 0)

    const padding = paddingCharacter.repeat(firstNonZeroIndex)

    return encoded
        .slice(firstNonZeroResultDigit)
        .reduce((all, digit) => all + alphabet.charAt(digit), padding)
}
