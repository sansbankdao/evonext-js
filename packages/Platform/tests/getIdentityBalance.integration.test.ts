// tests/getIdentityBalance.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EvoNext } from '../src'

const mockFetch = vi.fn()

beforeEach(() => {
    vi.clearAllMocks()
    ;(globalThis.fetch as any) = mockFetch
})

describe('EvoNext.getIdentityBalance', () => {
    it('should work with positional args (testnet)', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ balance: '1000000' })
        } as Response)

        const balance = await EvoNext.getIdentityBalance('testnet', 'mock-identity-123')
        expect(balance).toBe('1000000')
        expect(mockFetch).toHaveBeenCalledWith(
            'https://dashqt.org/v1/dapi',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    method: 'get_identity_balance',
                    params: ['mock-identity-123'],
                    network: 'testnet'
                })
            })
        )
    })

    it('should work with positional args (mainnet)', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ balance: '5000000' })
        } as Response)

        const balance = await EvoNext.getIdentityBalance('mainnet', 'mock-identity-456')
        expect(balance).toBe('5000000')
        expect(mockFetch).toHaveBeenCalledWith(
            'https://dashqt.org/v1/dapi',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    method: 'get_identity_balance',
                    params: ['mock-identity-456'],
                    network: 'mainnet'
                })
            })
        )
    })

    it('should work with object param (testnet default)', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ balance: '2500000' })
        } as Response)

        const balance = await EvoNext.getIdentityBalance({ identityId: 'mock-identity-789' })
        expect(balance).toBe('2500000')
        expect(mockFetch).toHaveBeenCalledWith(
            'https://dashqt.org/v1/dapi',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    method: 'get_identity_balance',
                    params: ['mock-identity-789'],
                    network: 'testnet'
                })
            })
        )
    })

    it('should work with object param (mainnet)', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ balance: '7500000' })
        } as Response)

        const balance = await EvoNext.getIdentityBalance({
            network: 'mainnet',
            identityId: 'mock-identity-101'
        })
        expect(balance).toBe('7500000')
    })

    it('should throw on invalid positional args (missing 2nd param)', async () => {
        expect.assertions(1)
        try {
            // @ts-expect-error Testing invalid args
            await EvoNext.getIdentityBalance('testnet')
        } catch (error: any) {
            expect(error.message).toMatch('exactly 2 positional params required')
        }
    })

    it('should throw on invalid positional args (too many params)', async () => {
        expect.assertions(1)
        try {
            // @ts-expect-error Testing invalid args
            await EvoNext.getIdentityBalance('testnet', 'id1', 'extra')
        } catch (error: any) {
            expect(error.message).toMatch('exactly 2 positional params required')
        }
    })

    it('should throw on missing identityId in object param', async () => {
        expect.assertions(1)
        try {
            await EvoNext.getIdentityBalance({ network: 'testnet' } as any)
        } catch (error: any) {
            expect(error).toBeDefined()
        }
    })

    it('should handle API error response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                error: {
                    message: 'Identity not found',
                    type: 'NOT_FOUND',
                    validationErrors: ['Invalid ID format']
                }
            })
        } as Response)

        await expect(EvoNext.getIdentityBalance('testnet', 'invalid-id')).rejects.toThrow('API Error: Identity not found - Invalid ID format')
    })

    it('should handle HTTP error', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error'
        } as Response)

        await expect(EvoNext.getIdentityBalance('testnet', 'mock-id')).rejects.toThrow('HTTP error! status: 500')
    })

    it('should handle network error', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network timeout'))

        await expect(EvoNext.getIdentityBalance('testnet', 'mock-id')).rejects.toThrow('API request failed')
    })

    it('should return null on unexpected API response format', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ unexpected: 'data' })
        } as Response)

        const balance = await EvoNext.getIdentityBalance('testnet', 'mock-id')
        expect(balance).toBeNull()
    })
})
