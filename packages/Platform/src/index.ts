// src/index.ts
export * from './platform'
export * from './types'

// Export your 3 new functions
export { default as getPrivateKeys } from './libs/getPrivateKeys'
export { default as getIdentities } from './libs/getIdentities'
export { default as getIdentityBalance } from './libs/getIdentityBalance'
