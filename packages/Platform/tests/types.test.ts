// tests/types.test.ts
import { describe, it, expect } from 'vitest'
import type { IIdentity, IPublicKey } from '../src/types'

describe('Types', () => {
    it('should compile without errors', () => {
        const publicKey: IPublicKey = {
            type: 0,
            keyType: 'ECDSA_SECP256K1',
            purpose: 'SIGNING',
            securityLevel: 'MASTER',
            contractBounds: null,
            dataBytes: null,
            readOnly: false,
            disabledAt: false
        }

        const identity: IIdentity = {
            idx: 1337,
            publicKeys: [publicKey]
        }

        expect(publicKey).toBeDefined()
        expect(identity).toBeDefined()
    })
})
