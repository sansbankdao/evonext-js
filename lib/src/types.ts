export interface EvoNextConfig {
  network?: 'mainnet' | 'testnet' | 'regtest';
  apiUrl?: string;
  dppProvider?: any;  // Placeholder for pshenmic-dpp instance or config
}

export interface EvoNextError extends Error {
  code?: string;
  details?: any;
}
