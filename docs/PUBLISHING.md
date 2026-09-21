# RECOMMENDATION — publishing the `evonext-js` ECDSA fix to NPM

**Date:** 2026-09-20
**Repo:** `sansbank/evonext-js`
**Package:** `@evonext/crypto` (currently `25.11.25` on the public registry)
**Blocker:** the fix MUST reach NPM, or `evonext-api` cannot verify any signature

---

## 1. Does fixing `evonext-js` require an NPM publish? — **YES**

`evonext-api` does **not** consume `evonext-js` from a local path. It pins a registry version:

```jsonc
// evonext-api/package.json
"@evonext/crypto": "25.11.25"
```

and resolves it through pnpm's store:

```
node_modules/@evonext/crypto -> ../.pnpm/@evonext+crypto@25.11.25/node_modules/@evonext/crypto
```

An exact, non-range version with no `link:`/`workspace:` protocol means a local edit has **no effect anywhere** until a new version is published and the pin is bumped.

**Verified during this investigation:** I patched the local file, ran the `evonext-api` suite, and **8 tests still failed with the original `Class constructor ECDSA cannot be invoked without 'new'`** — because Vitest bundled the *registry* copy from `node_modules/.vite/`. Only after copying the patched file into the installed package did the tests pass. That is the concrete proof the publish is load-bearing.

### Good news: the package ships raw source

`npm pack @evonext/crypto@25.11.25` contains `package/libs/ECDSA.js` **verbatim**. There is no build step, no `dist/`, no `prepare` script. So publishing is:

```
edit source -> bump version -> npm publish
```

No toolchain, no transpile, no artifacts to verify beyond the tarball contents.

---

## 2. Recommended process — Sansbank VM, least privilege

You asked to use the **Sansbank VM for all auth activities**. That is the right call, and it is feasible: the VM already runs `node v20.20.2` / `npm 10.8.2`, and already holds the Cloudflare token at `~/.cloudflare/api-token` (mode `0600`), which is a working precedent for this pattern.

**Current state of the VM:** `~/.npmrc` exists but contains only `prefix=...`. There is **no `_authToken`**, and `npm whoami` returns `ENEEDAUTH`. So authentication must be added once.

### 2.1 Use a granular, package-scoped automation token — not your account password

Do **not** run `npm login` interactively on the VM. A granular token:

- is scoped to `@evonext/crypto` only (not all your packages),
- is revocable without changing your account password,
- carries **read+write** but not account-management rights,
- does not enable 2FA bypass on anything else.

Create it at: **npmjs.com → Access Tokens → Generate New Token → Granular Access Token**

| Setting | Value |
|---|---|
| Name | `sansbank-vm-publish-crypto` |
| Expiration | 90 days (or shorter) |
| Packages and scopes | **Only** `@evonext/crypto`, permission **Read and write** |
| Organizations | none |
| IP allowlist | the Sansbank VM's egress IP (optional, stronger) |

### 2.2 Store it on the VM, mode 0600, outside the repo

```bash
# On the Sansbank VM — paste the token once, then it is never echoed again.
umask 077
mkdir -p ~/.config/npm
printf '%s' 'npm_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' > ~/.config/npm/token
chmod 600 ~/.config/npm/token
```

Then point `~/.npmrc` at it **without putting the secret in the file**:

```bash
cat >> ~/.npmrc <<'EOF'
@evonext:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
EOF
```

`npm` expands `${NPM_TOKEN}` from the environment, so the token never lands in `~/.npmrc` on disk. Export it only for the duration of a publish:

```bash
export NPM_TOKEN="$(cat ~/.config/npm/token)"
npm whoami          # -> sansbank
```

**Do not use `npm config set //registry.npmjs.org/:_authToken <token>`** — `npm config set` writes the plaintext token into `~/.npmrc`, which is the thing we are avoiding. (This is a common footgun; the env-var indirection above is the fix.)

### 2.3 Publish

**Do this in the `evonext-js` repo, on the VM, not on the dev box.**

```bash
# 1. Land the fix on main first (PR review, normal flow).
#    packages/Crypto/libs/ECDSA.js  — ECDSA() -> new ECDSA()   (2 call sites)

# 2. Bump the version. 25.11.25 -> 26.9.20
#    The scheme is CONFIRMED by the evonext-js owner as `YY.MM.DD`
#    (non-zero-padded, because semver forbids leading zeros). Today is
#    2026-09-20, so the release version is `26.9.20`.
#    A wrong version number is permanent on NPM (a version can be unpublished
#    for only 72 hours, and unpublishing is discouraged).
cd packages/Crypto
$EDITOR package.json

# 3. Verify the tarball contains the FIX, before publishing.
npm pack --dry-run 2>&1 | grep ECDSA
#    Then actually pack and inspect the exact bytes that will ship:
npm pack
tar xzf evonext-crypto-*.tgz -O package/libs/ECDSA.js | grep -n "new ECDSA()"
#    Expect TWO matches (static sign + static verify). If you see bare
#    `ECDSA().set(`, the fix is not in the tarball — STOP.

# 4. Publish.
export NPM_TOKEN="$(cat ~/.config/npm/token)"
npm publish --access public

# 5. Clean up.
rm -f evonext-crypto-*.tgz
unset NPM_TOKEN
```

`--access public` is required: scoped packages default to private, and this one is public.

### 2.4 Verify from a different machine

```bash
# On the dev box:
npm view @evonext/crypto version          # -> the new version
cd /tmp && rm -rf c && mkdir c && cd c
npm pack @evonext/crypto@<new-version>
tar xzf *.tgz -O package/libs/ECDSA.js | grep -c "new ECDSA()"   # -> 2
```

### 2.5 Then bump `evonext-api`

```bash
cd evonext-api
# package.json: "@evonext/crypto": "<new-version>"
pnpm install
rm -rf node_modules/.vite     # REQUIRED: Vitest caches the bundled copy
pnpm test                     # expect 70/70
```

> **The `rm -rf node_modules/.vite` step is not optional.** I hit this live: Vitest pre-bundles `@evonext/crypto` into `node_modules/.vite/.../deps_ssr/@evonext_crypto.js`, and a stale bundle produced 8 phantom failures on an already-correct source tree. Treat a stale Vitest dep cache as a first-class suspect whenever a dependency change "did not take effect".

---

## 3. Recommended sequencing

| Step | Action | Gate |
|---|---|---|
| 1 | Merge the `ECDSA.js` fix on `main` in `evonext-js` | PR reviewed |
| 2 | Bump version to `26.9.20` (`YY.MM.DD`, non-zero-padded) | scheme confirmed by the owner |
| 3 | Publish from the **Sansbank VM** with a granular token | tarball greps show 2× `new ECDSA()` |
| 4 | Verify from the dev box | `npm view` + `npm pack` grep |
| 5 | Bump `evonext-api` pin, `pnpm install`, clear `.vite` | 70/70 pass |
| 6 | Deploy `evonext-api` frontend | live `/v1/push/register` returns 400 (bad body) not 401 (bad signature) |

**Step 6 is the observable success signal.** Today the endpoint returns `401 Unauthorized: signature verification failed.` for a well-formed request. After the fix, a *deliberately invalid* signature still 401s, but a valid one from a testnet identity should authenticate. There is currently no way to produce that signature from CI (no private key in the pipeline), so the final check must be a manual registration from the desktop app.

---

## 4. Things I recommend you do NOT do

| Option | Why not |
|---|---|
| Publish from the dev box | You asked for VM-only auth; the dev box has no npm auth and should not get one |
| `npm login` interactively on the VM | Writes a long-lived session credential; a granular token is narrower and revocable |
| `npm config set ..._authToken` | Persists plaintext into `~/.npmrc` |
| Use `workspace:*` / `link:` in `evonext-api` | Would fix local dev and silently diverge from what production installs |
| Publish a version range like `^25.11.25` | The exact pin is deliberate; a range would let the fix be reverted by a transitive resolution |
| `--tag next` | `evonext-api` pins an exact version, so a prerelease tag only adds a step |

---

## 5. Risk of NOT publishing

Defect 3 (`ECDSA.verify` unreachable) is in the published `25.11.25`. Every consumer of `@evonext/crypto` that calls `ECDSA.verify` is affected — not just `evonext-api`, but `evonext-mobile` and `evonext-desktop`'s tests too. The recovery-based verifier I added in `evonext-api` sidesteps `ECDSA.verify` entirely, so **`evonext-api` can be deployed without the publish** — but the library bug remains live for every other caller until it ships.

Two independent tracks:
- **Track A (unblocked now):** deploy the `evonext-api` fix. It no longer depends on `ECDSA.verify` or on the DAPI proxy changing.
- **Track B (scheduled):** publish the `evonext-js` fix so the static API is correct for everyone.

I have applied Track A's code and verified it locally. I have **not** published anything, and I have not bumped any version.

---

## 6. RULE — tag a release AFTER it is published

**Rule:** create and push the git tag **only after** `npm publish` has succeeded and
`npm view @evonext/crypto version` reports the new version.

**Tag format:** `v` + the exact package version, non-zero-padded — e.g. `v26.9.20`.

**Sequence:**

```bash
# 1. The commit that produced the published artifact is already on the remote.
# 2. Publish first, and verify the registry actually serves it.
npm view @evonext/crypto version          # -> 26.9.20

# 3. THEN tag that exact commit (never a later commit) and push only the tag.
git tag v26.9.20 <commit-sha>
git push origin v26.9.20
```

**Why after, not before:** a tag is a promise that the named commit is the source
of the published artifact. Tagging first can produce a tag whose source was never
published (if the publish fails), or a tag that points at a commit different from
the one NPM served. Publishing first makes the tag provably correct.
