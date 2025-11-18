import type { EvoNextConfig, EvoNextError } from './types'
import * as dpp from 'pshenmic-dpp'  // Assuming this is the DPP library

export class EvoNext {
    private config: EvoNextConfig
    private dppInstance?: dpp.DashPlatformProtocol  // Example DPP integration

    constructor(config: EvoNextConfig = {}) {
        this.config = {
            network: 'testnet',
            apiUrl: 'https://api.evonext.test',  // Placeholder API
            ...config
        }

        this.initializeDPP()
    }

    private initializeDPP(): void {
        if (this.config.dppProvider) {
            // Initialize DPP based on provided config
            this.dppInstance = new dpp.DashPlatformProtocol(this.config.dppProvider)
        } else {
            console.warn('DPP provider not configured; some features may be unavailable.')
        }
    }

    public async connect(): Promise<void> {
        try {
            // Placeholder for connection logic (e.g., API handshake or wallet sync)
            if (this.dppInstance) {
                await this.dppInstance.start()
                console.log(`Connected to EvoNext on ${this.config.network}`)
            } else {
                throw new EvoNextError('DPP not initialized', { code: 'MISSING_DPP' })
            }
        } catch (error) {
            const err = error as EvoNextError
            err.code = err.code || 'CONNECTION_FAILED'
            throw err
        }
    }

    public getNetwork(): string {
        return this.config.network || 'testnet'
    }

    // Placeholder for future methods, e.g., wallet or contract interactions
    public async createWallet(mnemonic?: string): Promise<any> {
        // Integrate with DPP or other libs here
        if (!this.dppInstance) {
            throw new EvoNextError('Must connect first', { code: 'NOT_CONNECTED' })
        }

        // TODO: Implement wallet creation using dpp
        return { address: 'placeholder-address', mnemonic }
    }

    public disconnect(): void {
        if (this.dppInstance) {
            this.dppInstance.stop()
        }

        console.log('Disconnected from EvoNext')
    }
}
