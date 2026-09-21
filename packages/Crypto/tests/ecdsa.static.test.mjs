// packages/Crypto/tests/ecdsa.static.test.mjs
//
// Regression test for the ECDSA static API.
//
// HISTORY: `static sign` and `static verify` used to call `ECDSA()` — a bare
// invocation of an ES `class`. That throws
//
//     TypeError: Class constructor ECDSA cannot be invoked without 'new'
//
// on EVERY call, while `typeof ECDSA.verify` still reported `'function'`. The
// consequence was that every server-side signature verification in `evonext-api`
// failed silently (the throw was swallowed by a `catch { continue }`), so
// `POST /v1/push/register` returned 401 for every identity and the WebSocket
// handshake could not authenticate anyone.
//
// This test must CALL the methods. A `typeof` assertion does NOT catch the bug.
//
// Run: node packages/Crypto/tests/ecdsa.static.test.mjs

import assert from 'node:assert/strict'
import { test } from 'node:test'

import { ECDSA, Hash, PrivateKey, PublicKey, sha256 } from '../index.js'

/**
 * Build Test Hash
 *
 * A deterministic 32-byte digest. `ECDSA.verify` requires exactly 32 bytes
 * (`sigError()` returns 'hashbuf must be a 32 byte buffer' otherwise).
 */
const testHash = (seed = 7) => Buffer.alloc(32, seed)

/** Rebuild the Dash Signed Message digest, matching verifySignature.ts. */
const dashHash = (message) => {
    const msgbuf = Buffer.from(message, 'utf8')
    const prefixed = Buffer.concat([
        Buffer.from([0x19]), // 25 — the spec constant, NOT the magic's length
        Buffer.from('Dash Signed Message:\n', 'utf8'),
        Buffer.from([msgbuf.length]),
        msgbuf,
    ])
    return Buffer.from(sha256(sha256(prefixed)))
}

test('static sign does not throw', () => {
    const priv = PrivateKey.fromRandom()
    // The bug under test: this used to throw
    // "Class constructor ECDSA cannot be invoked without 'new'".
    const sig = ECDSA.sign(testHash(), priv)
    assert.ok(sig, 'sign must return a signature object')
    assert.ok(sig.r, 'signature must carry r')
    assert.ok(sig.s, 'signature must carry s')
})

test('static verify accepts a signature produced by static sign', () => {
    const priv = PrivateKey.fromRandom()
    const hash = testHash()
    const sig = ECDSA.sign(hash, priv)
    assert.equal(
        ECDSA.verify(hash, sig, priv.publicKey),
        true,
        'a valid signature must verify',
    )
})

test('static verify rejects a signature over a different hash', () => {
    const priv = PrivateKey.fromRandom()
    const sig = ECDSA.sign(testHash(7), priv)
    assert.equal(
        ECDSA.verify(testHash(8), sig, priv.publicKey),
        false,
        'a mismatched hash must not verify',
    )
})

test('static verify rejects a signature from a different key', () => {
    const signer = PrivateKey.fromRandom()
    const other = PrivateKey.fromRandom()
    const hash = testHash()
    const sig = ECDSA.sign(hash, signer)
    assert.equal(
        ECDSA.verify(hash, sig, other.publicKey),
        false,
        'a foreign public key must not verify',
    )
})

test('static API and instance API agree', () => {
    const priv = PrivateKey.fromRandom()
    const hash = testHash()
    const sig = ECDSA.sign(hash, priv)

    const viaInstance = new ECDSA()
        .set({ hashbuf: hash, sig, pubkey: priv.publicKey })
        .verify().verified

    assert.equal(
        ECDSA.verify(hash, sig, priv.publicKey),
        viaInstance,
        'the static wrapper must return exactly what the instance API returns',
    )
})

test('Dash Signed Message round-trip (the production path)', () => {
    // This mirrors what evonext-api/src/libs/verifySignature.ts does, but via
    // the library rather than the broken PublicKey.fromString(hash160) path.
    const priv = PrivateKey.fromRandom()
    const hash = dashHash(
        'action:ws_connect\nidentityId:X\nsessionId:Y\ntimestamp:1',
    )
    assert.equal(hash.length, 32, 'Dash Signed Message hash must be 32 bytes')

    const sig = ECDSA.sign(hash, priv)
    assert.equal(ECDSA.verify(hash, sig, priv.publicKey), true)
})

test('ECDSA() without new still throws (behaviour is unchanged)', () => {
    // Pins the platform fact that motivated the fix. If this ever stops
    // throwing, the `new` calls are still correct — but the reason documented
    // in the source comment would no longer apply.
    assert.throws(
        () => ECDSA(),
        /Class constructor ECDSA cannot be invoked without 'new'/,
        'a native class must not be callable without `new`',
    )
})

test('recoverable signature: hash160 of the signer is reproducible', () => {
    // This is the property the new server-side verifier relies on: recover the
    // point from (hash, r, s, i), then hash160 it and compare against the
    // identity's stored ECDSA_HASH160 digest.
    const priv = PrivateKey.fromRandom()
    const target = Buffer.from(
        Hash.sha256ripemd160(priv.publicKey.toBuffer()),
    ).toString('hex')

    const hash = dashHash('action:ws_connect\nidentityId:X\nsessionId:Y\ntimestamp:1')
    const sig = ECDSA.sign(hash, priv)

    let matched = false
    for (let i = 0; i < 4; i++) {
        const e = new ECDSA().set({ hashbuf: hash, sig, endian: 'big' })
        e.sig.i = i
        try {
            const recovered = e.toPublicKey()
            const digest = Buffer.from(
                Hash.sha256ripemd160(recovered.toBuffer()),
            ).toString('hex')
            if (digest === target) {
                matched = true
                break
            }
        } catch (_) {
            // Wrong recovery id — not a curve point. Try the next one.
        }
    }

    assert.equal(
        matched,
        true,
        'exactly one recovery id must reproduce the signer hash160',
    )
})
