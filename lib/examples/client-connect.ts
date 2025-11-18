/* Import modules. */
import { EvoNext, EvoNextConfig } from '../src/index.js' // use evonext in production

;(async () => {
    const config: EvoNextConfig = { network: 'testnet' }
    const client = new EvoNext(config)

    client.connect().then(() => {
        console.log('EvoNext client ready!')
        client.disconnect()
    }).catch(console.error)
})()
