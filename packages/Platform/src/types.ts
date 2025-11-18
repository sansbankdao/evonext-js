export interface PlatformConfig {
  network?: 'mainnet' | 'testnet' | 'regtest';
  apiUrl?: string;
  dppProvider?: any;  // Placeholder for pshenmic-dpp instance or config
}

export interface PlatformError extends Error {
  code?: string;
  details?: any;
}
