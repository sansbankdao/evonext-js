interface EvoNextConfig {
    network?: 'mainnet' | 'testnet' | 'regtest';
    apiUrl?: string;
    dppProvider?: any;
}
interface EvoNextError extends Error {
    code?: string;
    details?: any;
}

declare class EvoNext {
    private config;
    constructor(config?: EvoNextConfig);
    private initializeDPP;
    connect(): Promise<void>;
    getNetwork(): string;
    createWallet(mnemonic?: string): Promise<any>;
    disconnect(): void;
}

export { EvoNext, type EvoNextConfig, type EvoNextError };
