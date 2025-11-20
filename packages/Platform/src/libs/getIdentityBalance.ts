// src/libs/getIdentityBalance.ts

/* Initialize Web API endpoint. */
const WEB_API_ENDPOINT = 'https://dashqt.org/v1/dapi'

interface ApiResponse<T = any> {
    result?: T
    error?: {
        message: string
        type: string
        validationErrors?: string[]
    }
}

interface IdentityBalanceResult {
    balance: string
}

/**
 * Web API Query
 *
 * Wrapper for DAPI web service calls.
 */
const queryWebAPI = async <T = any>(
    method: string,
    params: any[]
): Promise<ApiResponse<T>> => {
    try {
        const response = await fetch(WEB_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method,
                params,
            }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: ApiResponse<T> = await response.json()
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
 */
export default async (identityId: string): Promise<string | null> => {
    try {
        const response = await queryWebAPI<IdentityBalanceResult>('get_identity_balance', [identityId])

        // Check for API-level errors
        if (response.error) {
            console.error('API returned error:', response.error)
            throw new Error(
                `API Error: ${response.error.message}${response.error.validationErrors ? ` - ${response.error.validationErrors.join(', ')}` : ''}`
            )
        }

        // Validate successful response structure
        if (response.result && typeof response.result.balance === 'string') {
            return response.result.balance
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
