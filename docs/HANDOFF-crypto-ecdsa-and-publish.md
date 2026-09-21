# HANDOFF — `evonext-js` team: unreachable `ECDSA` statics + NPM release

**Date:** 2026-09-20
**Prepared by:** desktop/API engineer (not the `evonext-js` owner)
**Repo:** `sansbank/evonext-js`
**Package:** `@evonext/crypto`
**Installed version everywhere:** `25.11.25`
**Status:** fix is **written, tested, mutation-proven — NOT published**

---

## 0. READ THIS FIRST

The bug is fixed in the working tree. What remains is a **publish**. Before you publish, you must decide the version number, because **only one version has ever been published to NPM** (`25.11.25`) and a bad version number cannot be cleanly undone.

```bash
npm view @evonext/crypto versions --json
# -> ["25.11.25"]   (exactly one version)
```

`25.11.25` reads as `YY.MM.DD` (2025-11-25). The scheme has since been **confirmed by the repo owner** as `YY.MM.DD` with **no zero-padding** (semver forbids leading zeros, so `26.09.20` is invalid).

---

## 1. The bug

### 1.1 Symptom

`ECDSA.sign(...)` and `ECDSA.verify(...)` throw on **every** call:

```
TypeError: Class constructor ECDSA cannot be invoked without 'new'
```

while `typeof ECDSA.verify === 'function'` is `true`. No type check, no linter, and no import error catches this. It only surfaces at runtime, and every existing caller wrapped it in a `try/catch` that swallowed the throw.

### 1.2 Cause

`packages/Crypto/libs/ECDSA.js:27` declares an ES `class`:

```js
class ECDSA {
```

but the static methods call it as a **function**:

```js
static sign(hashbuf, privkey, endian) {
    return ECDSA().set({ ... })      // line 136 (pre-fix)
}

static verify(hashbuf, sig, pubkey, endian) {
    return ECDSA().set({ ... })      // line 144 (pre-fix)
}
```

A native `class` cannot be invoked without `new`. This is legal for a `function`-based module, so this file cannot be called as a function.

### 1.3 Corroborating evidence

Line 29 still contains:

```js
if (!(this instanceof ECDSA)) return new ECDSA(_obj)
```

That guard is **dead code** for a `class` — the function-call form throws before the constructor body ever runs. Its presence is evidence the guard was written for a callable form. `git log` shows the earliest commit that contains this file (`136630d`, 2025-11-18) **already** declares `class ECDSA` with bare `ECDSA()` call sites, so there is **no local evidence** of a prior `function ECDSA(...)` form.

### 1.4 Scope of impact

`ECDSA.verify` and `ECDSA.sign` are unusable for **every** consumer of `@evonext/crypto@25.11.25`:

| Consumer | Affected? |
|---|---|
| `evonext-api` | yes — verification always failed (see §3). Worked around by not using `ECDSA.verify` at all |
| `evonext-mobile` | yes — any path calling the statics |
| `evonext-desktop` | Rust signs natively; the JS statics are used only in tests |

---

## 2. The fix (already applied in the working tree)

`packages/Crypto/libs/ECDSA.js` — **exactly two functional lines** plus comments:

```diff
-        return ECDSA().set({
+        return new ECDSA().set({
-        return ECDSA().set({
+        return new ECDSA().set({
```

Line numbers in the fixed file:

| Location | Line |
|---|---|
| `class ECDSA` | 27 |
| `static sign` | 141 |
| `new ECDSA().set(...)` in `static sign` | 150 |
| `static verify` | 157 |
| `new ECDSA().set(...)` in `static verify` | 159 |

### 2.1 Instance-form callers are unaffected

`new ECDSA().set({...}).verify()` always worked. Only the **static** wrappers were broken. Downstream code that uses the instance form needs no change.

```bash
# Verified working, end-to-end:
node -e "
  const { ECDSA, PrivateKey } = require('@evonext/crypto');
  const p = PrivateKey.fromRandom();
  const h = Buffer.alloc(32,7);
  const s = new ECDSA().set({ hashbuf:h, privkey:p }).sign().sig;
  const ok = new ECDSA().set({ hashbuf:h, sig:s, pubkey:p.publicKey }).verify().verified;
  console.log('verify:', ok);   // -> true
"
```

### 2.2 Regression test added

`packages/Crypto/tests/ecdsa.static.test.mjs` — 8 tests, standalone ESM, no runner config: `node packages/Crypto/tests/ecdsa.static.test.mjs`

**Mutation-proven:** with the fix, **8/8 pass**. Reverting `new` → **1 passed / 7 failed**. The single intentional survivor is the test that pins *"bare `ECDSA()` still throws"*, which must keep passing either way.

> **Note for you:** there is no test infrastructure in `evonext-js` — no root `package.json`, and the CI config references scripts that do not exist. This test is deliberately runnable with bare `node`, so it needs no infrastructure to be useful. Adopting a real runner is a separate decision.

---

## 3. Why this blocked the API

`evonext-api` calls `ECDSA.verify(...)` to authenticate a device. With the bug, the call threw, and the surrounding handler caught and continued:

```js
try {
    const pubkey = PublicKey.fromString(publicKeys[i])
    if (ECDSA.verify(Buffer.from(hashbuf), sigBytes, pubkey)) { return true }
} catch (err) {
    continue        // <- the throw vanished here
}
```

The API has since removed its dependency on `ECDSA.verify` entirely (it verifies by signature **recovery** instead), so the API is unblocked. **This library bug is still live for every other consumer.**

---

## 4. Publishing — the remaining work

**Full procedure, including token scoping and rollback considerations:** `docs/PUBLISHING-recommendation.md` (192 lines, in this repo).

Summary of the recommendation:

1. Use a **granular NPM token scoped to `@evonext/crypto` only**, read+write. Not an account password, not `npm login`.
2. Store it **on the Sansbank VM** at `~/.config/npm/token`, mode `0600`.
3. Reference it as `${NPM_TOKEN}` in `~/.npmrc` so the plaintext token is never written to disk.
4. **Verify the tarball contains the fix before publishing:**

```bash
cd packages/Crypto
npm pack
tar xzf evonext-crypto-*.tgz -O package/libs/ECDSA.js | grep -c "new ECDSA()"
# MUST print 2. If it prints 0, STOP — you are about to publish the bug.
```

5. `npm publish --access public` — the `--access public` flag is required, since scoped packages default to private and this one is public.

### 4.1 The package ships raw source — no build step

`npm pack @evonext/crypto@25.11.25` contains `package/libs/ECDSA.js` **verbatim**. There is no `dist/`, no `prepare` script, no transpile. So publish is: edit → bump → publish. Nothing to compile and no build output to verify beyond the tarball grep above.

### 4.2 Current auth state on the Sansbank VM (verified)

| Item | State |
|---|---|
| `node` | `v20.20.2` |
| `npm` | `10.8.2` |
| `~/.npmrc` | exists, contains **only** `prefix=...` |
| `_authToken` | **absent** |
| `npm whoami` | `ENEEDAUTH` |

Authentication must be added once. There is a working precedent on that VM for this pattern: `~/.cloudflare/api-token`, mode `0600`.

---

## 5. What NOT to do

| Don't | Why |
|---|---|
| Publish from the dev box | dev box has no npm auth and should not get one |
| `npm login` interactively | writes a broad, long-lived session credential |
| `npm config set ..._authToken <token>` | persists plaintext into `~/.npmrc` |
| Consume `evonext-js` via `workspace:*` / `link:` from `evonext-api` | fixes local dev, silently diverges from what production installs |
| Change the `evonext-api` pin to a range like `^25.11.x` | the exact pin is deliberate; a range could let the fix be reverted by transitive resolution |
| Assume `25.11.26` is correct | confirm the scheme first (see §0) |

---

## 6. Post-publish verification (run from a different machine)

```bash
npm view @evonext/crypto version                 # -> the new version

cd /tmp && rm -rf verify && mkdir verify && cd verify
npm pack @evonext/crypto@<new-version>
tar xzf *.tgz -O package/libs/ECDSA.js | grep -c "new ECDSA()"    # -> 2
```

Then, in `evonext-api`:

```bash
# package.json: "@evonext/crypto": "<new-version>"
pnpm install
rm -rf node_modules/.vite   # REQUIRED — see below
pnpm test                   # expect 70/70
```

> **Why `rm -rf node_modules/.vite` is mandatory:** Vitest pre-bundles `@evonext/crypto` into `node_modules/.vite/.../deps_ssr/@evonext_crypto.js`. During this investigation, patching the local source left **8 tests failing** because Vitest kept using the stale bundled registry copy. Any time a dependency change appears not to take effect, treat the Vitest dep cache as the first suspect.

---

## 7. Notes for the `evonext-js` owner (pre-existing, not from this work)

`git status` in this repo currently shows changes in `packages/Platform/` that date to **2025-11-28** and are unrelated to the ECDSA fix:

```
D  packages/Platform/src/libs/findTransferKeys.ts
M  packages/Platform/src/libs/getIdentities.ts
A  packages/Platform/src/libs/searchTransferKeys.ts
?? packages/Platform/src/libs/getTokenBalances.ts
```

Flagging these so the ECDSA fix is not bundled into an unrelated commit during review. Decide their fate separately.

---

## 8. Checklist for the `evonext-js` owner

- [ ] Review the 2-line `ECDSA.js` diff (`new` at both call sites)
- [ ] Confirm the intended version scheme (only `25.11.25` exists — §0)
- [ ] Decide whether to keep the explanatory comments (recommended: they document a real historical footgun)
- [ ] Decide the fate of the 4 pre-existing `Platform/` changes (§7)
- [ ] Create a granular `@evonext/crypto` token
- [ ] Store it on the Sansbank VM, mode `0600` (`docs/PUBLISHING-recommendation.md`)
- [ ] `npm pack` → **grep the tarball for 2× `new ECDSA()`** → publish
- [ ] Verify from the dev box with `npm view` + a fresh `npm pack`
- [ ] Bump the `evonext-api` pin and clear its Vitest cache
- [ ] Consider a CI publish workflow (none exists today — publishing has been manual)