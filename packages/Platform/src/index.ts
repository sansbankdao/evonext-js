// src/index.ts
import { setupBrowserShims } from './shims'
import getIdentityBalance from './libs/getIdentityBalance'

// 🔥 Browser shims FIRST
setupBrowserShims()

// 🔥 Create API object (works for both ESM + IIFE)
const EvoNextAPI = {
    getIdentityBalance
} as const

// Global for IIFE
if (typeof window !== 'undefined') {
    (window as any).EvoNext = EvoNextAPI
}

// Export for ESM users
export const EvoNext = EvoNextAPI

// Re-exports for tree-shaking
export * from './platform'
export * from './types'
export { getIdentityBalance }
