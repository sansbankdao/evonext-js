// import type { ProviderOptions } from 'pshenmic-dpp'  // Adjust based on actual DPP types

export interface PlatformConfig {
    network?: 'mainnet' | 'testnet' | 'regtest'
    apiUrl?: string  // Primary RPC endpoint (default: 'https://dashqt.org/v1/dapi')
    rpcTimeout?: number  // RPC timeout in ms (default: 5000)
    // dppProvider?: dpp.Provider | ProviderOptions | null  // Typed for DPP integration
}

export interface PlatformError extends Error {
    code?: number;
    message: string;
    details?: Record<string, any> | null;
}

// From your earlier shared types (merged/updated for this package)
export interface Identity {
    idx: number
    publicKeys: [PublicKey]  // Assuming array of 1 for simplicity; adjust if needed
}

export interface PublicKey {
    type: number
    keyType: string  // enumeration
    purpose: string
    securityLevel: string
    contractBounds: any  // FIXME: Define proper type
    readOnly: boolean
    disabledAt: boolean  // Optional, as per earlier types
}

// Add other types from your shared file as needed (e.g., IApp, IUser, etc.)
// ...
