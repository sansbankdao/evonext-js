// src/libs/getTokenBalances.ts

/* Import modules. */
import { DashPlatformSDK } from 'dash-platform-sdk'

/* Initialize SDK. */
const sdk = new DashPlatformSDK({ network: 'mainnet' })

const IDENTIFIER = 'BkEqcgfmNFY5TEy2atDhhFsDY1NZ6oPa4XPrDGuuWLVT'
const DUSD_CONTRACT_ID = 'DYqxCsuDgYsEAJ2ADnimkwNdL7C4xbe4No4so19X9mmd'
const SANS_CONTRACT_ID = 'AxAYWyXV6mrm8Sq7vc7wEM18wtL8a8rgj64SM3SDmzsB'

/* Create a new document. */
const tokensIdentityBalance = await sdk.tokens
    .getIdentityTokensBalances(IDENTIFIER, [DUSD_CONTRACT_ID, SANS_CONTRACT_ID]);

console.log('TOKEN BALANCE', tokensIdentityBalance)
console.log('TOKEN #1', tokensIdentityBalance[0].tokenId.base58(), tokensIdentityBalance[0].balance)
console.log('TOKEN #2', tokensIdentityBalance[1].tokenId.base58(), tokensIdentityBalance[1].balance)
