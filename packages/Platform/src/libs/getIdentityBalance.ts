// src/libs/getIdentityBalance.ts

export type SupportedNetwork = 'testnet' | 'mainnet'

export interface NetworkOptions {
    network?: SupportedNetwork
    identityId: string
}

export type GetIdentityBalanceParams =
    | [network: SupportedNetwork, identityId: string]
    | [options: NetworkOptions]

/* Initialize Web API endpoint. */
const WEB_API_ENDPOINT = 'https://dashqt.org/v1/dapi'

interface ApiResponse {
    balance?: string
    error?: {
        message: string
        type: string
        validationErrors?: string[]
    }
}

/**
 * Web API Query
 *
 * Wrapper for DAPI web service calls.
 */
const queryWebAPI = async (
    network: SupportedNetwork = 'testnet',
    method: string,
    params: any[]
): Promise<ApiResponse> => {
    try {
        const response = await fetch(WEB_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method,
                params,
                network,
            }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: ApiResponse = await response.json()
        return result

    } catch (error) {
        console.error(`Web API query failed for ${method}:`, error)
        throw new Error(
            `API request failed for ${method}: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
    }
}

/**
 * Get Identity Balance
 *
 * Queries the Web API for the balance of the given identity.
 *
 * Supports positional args: `getIdentityBalance(network, identityId)`
 * Supports object arg: `getIdentityBalance({ network?: 'mainnet'|'testnet', identityId: string })`
 */
export default async (...args: GetIdentityBalanceParams): Promise<string | null> => {
    let network: SupportedNetwork = 'testnet'
    let identityId: string

    // Handle object parameter first (takes precedence)
    if (args.length === 1 && args[0] !== null && typeof args[0] === 'object') {
        const options = args[0] as NetworkOptions
        network = options.network || 'testnet'
        identityId = options.identityId
    } else {
        // Handle positional arguments - require EXACTLY 2 params
        if (args.length !== 2) {
            throw new Error('Invalid arguments: if not using object param, exactly 2 positional params required (network, identityId)')
        }
        network = args[0] as SupportedNetwork
        identityId = args[1] as string
    }

    try {
        const response = await queryWebAPI(network, 'get_identity_balance', [identityId])

        // Check for API-level errors
        if (response.error) {
            console.error('API returned error:', response.error)
            throw new Error(
                `API Error: ${response.error.message}${response.error.validationErrors ? ` - ${response.error.validationErrors.join(', ')}` : ''}`
            )
        }

        // Handle the actual response format: {balance: "12761934343"}
        if (response && typeof response.balance === 'string') {
            return response.balance
        }

        console.warn('Unexpected API response format:', response)
        return null

    } catch (error) {
        console.error(`Failed to get balance for identity ${identityId}:`, error)

        // Re-throw with context for the caller to handle
        throw new Error(
            `Failed to retrieve identity balance: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
    }
}
