import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Platform, type PlatformConfig, type PlatformError } from '../src'

vi.mock('pshenmic-dpp', () => ({
  DashPlatformProtocol: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn()
  }))
}))

describe('Platform', () => {
  let platform: Platform
  const mockConfig: PlatformConfig = {
    network: 'testnet',
    dppProvider: {} as any
  }

  beforeEach(() => {
    platform = new Platform(mockConfig)
  })

  it('should initialize with default config', () => {
    expect(platform.getNetwork()).toBe('testnet')
  })

  it('should connect successfully', async () => {
    await expect(platform.connect()).resolves.not.toThrow()
    expect(platform['isConnected']).toBe(true)  // Private, but testable for demo
  })

  it('should throw error if DPP provider is missing', () => {
    const noProvider = new Platform({ network: 'testnet' })
    expect(() => noProvider.connect()).toThrowError('DPP provider not configured')
  })

  it('should fail createWallet if not connected', async () => {
    const error = await platform.createWallet('test-mnemonic').then(
      () => null,
      (err: PlatformError) => err
    )
    expect(error.code).toBe('NOT_CONNECTED')
  })
})
