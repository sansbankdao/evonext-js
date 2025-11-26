/* Import Buffer class (FIRST!!). */
// FIXME REMOVE THIS GLOBAL INJECTION, AFTER REFACTORING BITCORE IMPORTS.
// NOTE: THIS ONLY INJECTS IF `window.Buffer` IS MISSING.
import './libs/Buffer.js'

/* Import (local) modules. */
import _decrypt from './src/decrypt.js'
import _decryptForPubkey from './src/decryptForPubkey.js'
import _derivePublicKeyCompressed from './src/derivePublicKeyCompressed.js'
import _encrypt from './src/encrypt.js'
import _encryptForPubkey from './src/encryptForPubkey.js'
// import _passwordToSafu from './src/passwordToSafu.js'
import _getHmac from './src/getHmac.js'
import _hash160 from './src/hash160.js'
import _hash256 from './src/hash256.js'
import _ripemd160 from './src/ripemd160.js'
import _sha256 from './src/sha256.js'
import _sha512 from './src/sha512.js'
import _signMessageHashEcdsa from './src/signMessageHashEcdsa.js'
import _signMessageHashSchnorr from './src/signMessageHashSchnorr.js'
import _validateSecp256k1PrivateKey from './src/validateSecp256k1PrivateKey.js'

/* Import (local) libraries. */
import _Base58Check from './libs/Base58Check.js'
import _BN from './libs/BN.js'
import _ECDSA from './libs/ECDSA.js'
import _Hash from './libs/Hash.js'
import _HDPrivateKey from './libs/HDPrivateKey.js'
import _HDPublicKey from './libs/HDPublicKey.js'
import _Point from './libs/Point.js'
import _PrivateKey from './libs/PrivateKey.js'
import _PublicKey from './libs/PublicKey.js'

/* Import (Network) settings. */
import { defaultNetwork as _defaultNetwork } from './libs/Network.js'

/* Export (local) modules. */
export const decrypt = _decrypt
export const decryptForPubkey = _decryptForPubkey
export const derivePublicKeyCompressed = _derivePublicKeyCompressed
export const encrypt = _encrypt
export const encryptForPubkey = _encryptForPubkey
// export const passwordToSafu = _passwordToSafu
export const getHmac = _getHmac
export const hash160 = _hash160
export const hash256 = _hash256
export const ripemd160 = _ripemd160
export const sha256 = _sha256
export const sha512 = _sha512
export const signMessageHashEcdsa = _signMessageHashEcdsa
export const signMessageHashSchnorr = _signMessageHashSchnorr
export const validateSecp256k1PrivateKey = _validateSecp256k1PrivateKey

/* Export (local) libraries. */
export const Base58Check = _Base58Check
export const BN = _BN
export const ECDSA = _ECDSA
export const Hash = _Hash
export const HDPrivateKey = _HDPrivateKey
export const HDPublicKey = _HDPublicKey
export const Point = _Point
export const PrivateKey = _PrivateKey
export const PublicKey = _PublicKey

/* Export (Network) settings. */
export const defaultNetwork = _defaultNetwork

/* Provide Ether.js helpers. */
import { randomBytes as _randomBytes } from '@ethersproject/random'
export const randomBytes = _randomBytes

/**
 * Crypto Class
 *
 * Manages crypto functions.
 */
export class Crypto {
    // NOTE: We won't use a constructor, as this is a "pure" class.

    test() {
        return 'Crypto (Instance) is working!'
    }
    static test() {
        return 'Crypto (Static) is working!'
    }
}


/* Initialize (globalThis) EvoNext class. */
const EvoNext = {}

/* Initialize Crypto class. */
EvoNext.Crypto = Crypto

/* Initialize Crypto libraries. */
EvoNext.Base58Check = Base58Check
EvoNext.BN = BN
EvoNext.ECDSA = ECDSA
EvoNext.Hash = Hash
EvoNext.HDPrivateKey = HDPrivateKey
EvoNext.HDPublicKey = HDPublicKey
EvoNext.Point = Point
EvoNext.PrivateKey = PrivateKey
EvoNext.PublicKey = PublicKey

/* Initialize Crypto modules. */
EvoNext.decrypt = decrypt
EvoNext.decryptForPubkey = decryptForPubkey
EvoNext.derivePublicKeyCompressed = derivePublicKeyCompressed
EvoNext.encrypt = encrypt
EvoNext.encryptForPubkey = encryptForPubkey
// EvoNext.passwordToSafu = passwordToSafu
EvoNext.getHmac = getHmac
EvoNext.hash160 = hash160
EvoNext.hash256 = hash256
EvoNext.randomBytes = randomBytes
EvoNext.ripemd160 = ripemd160
EvoNext.sha256 = sha256
EvoNext.sha512 = sha512
EvoNext.signMessageHashEcdsa = signMessageHashEcdsa
EvoNext.signMessageHashSchnorr = signMessageHashSchnorr
EvoNext.validateSecp256k1PrivateKey = validateSecp256k1PrivateKey

/* Initialize Crypto settings. */
EvoNext.defaultNetwork = defaultNetwork

/* Export EvoNext to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.EvoNext = {
    ...globalThis.EvoNext, // preserve EvoNext object
    ...EvoNext, // extend EvoNext object
}
