/* Import modules. */
import { utf8ToBin } from '@evonext/utils'

/* Import (local) modules. */
import _sign from './src/sign.js'
import _verify from './src/verify.js'

/* Export (local) modules. */
export const sign = _sign
export const verify = _verify

export const MAGIC_BYTES = utf8ToBin('Bitcoin Signed Message:\n')

/**
 * Message Class
 *
 * Manages message functions.
 */
export class Message {
    static sign(_wif, _message) {
        return sign(_wif, _message)
    }

    static verify(_address, _message, _signature) {
        return verify(_address, _message, _signature)
    }
}


/* Initialize (globalThis) EvoNext class. */
const EvoNext = {}

/* Initialize Message class. */
EvoNext.Message = Message

/* Initialize Message modules. */
EvoNext.signMessage = sign
EvoNext.verifyMessage = verify

/* Export EvoNext to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.EvoNext = {
    ...globalThis.EvoNext, // preserve EvoNext object
    ...EvoNext, // extend EvoNext object
}
