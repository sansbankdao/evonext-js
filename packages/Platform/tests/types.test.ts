import { describe, it } from 'vitest'
import type { PlatformConfig, PlatformError } from '../src'

describe('Types', () => {
  it('should compile without errors', () => {
    const config: PlatformConfig = {
      network: 'mainnet',
      dppProvider: null
    }

    const error: PlatformError = new Error('Test') as PlatformError
    error.code = 'TEST_CODE'
    error.details = { foo: 'bar' }

    expect(config).toBeDefined()
    expect(error).toBeDefined()
  })
})
