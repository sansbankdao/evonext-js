# EvoNext

EvoNext is a lightweight TypeScript library for building applications on the EvoNext ecosystem, leveraging the Dash Platform Protocol (DPP) for decentralized data management, wallet operations, and blockchain interactions. It provides a simple, configurable client for developers working with Dash-based applications.

Built on top of the officialdash-platform-sdk and custom DPP extensions (pshenmic-dpp), EvoNext simplifies connection setup, network management, and basic operations like wallet creation.


## Features

- Easy DPP Integration: Initialize and connect to Dash networks (mainnet, testnet, regtest) with minimal setup.
- Configurable Client: Supports custom API endpoints and DPP providers.
- TypeScript-First: Full type definitions for IntelliSense and compile-time safety.
- Dual Format: ESM and CommonJS support for modern and legacy environments.
- Lightweight: Minimal footprint (~5kB unpacked) for fast installation and bundling.


## Installation

Install EvoNext via your preferred package manager. It requires Node.js >=18.

```sh
pnpm add evonext
# or
npm install evonext
# or
yarn add evonext
```

Note: EvoNext depends ondash-platform-sdk andpshenmic-dpp, which will be installed automatically. If using private registries (e.g., for dev versions), ensure your auth is configured.


## Quick Start

### TypeScript/ESM Usage

Create a basic EvoNext client and connect:

```ts
import { EvoNext, EvoNextConfig } from 'evonext';

const config: EvoNextConfig = {
  network: 'testnet',
  apiUrl: 'https://api.evonext.test',  // Optional custom endpoint
  dppProvider: { /* Your DPP config */ }  // Optional
};

const client = new EvoNext(config);
async function main() {
  try {
    await client.connect();  // Initializes DPP and logs connection
    console.log('Connected to:', client.getNetwork());

    // Example: Create a wallet
    const wallet = await client.createWallet('your-mnemonic-phrase');
    console.log('Wallet:', wallet);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.disconnect();  // Clean up
  }
}

main();
```

### JavaScript/CommonJS Usage

```js
const { EvoNext } = require('evonext');

const config = {
  network: 'testnet'
};

const client = new EvoNext(config);
client.connect().then(() => {
  console.log('Connected to:', client.getNetwork());
  client.disconnect();
}).catch(console.error);
```

Expected output:

```
Connected to EvoNext on testnet
DPP provider not configured; some features may be unavailable.  // If no dppProvider
```


## API Reference

### EvoNext Class

The main entry point for EvoNext interactions.

#### Constructor

```ts
new EvoNext(config?: EvoNextConfig)
```

- Defaults tonetwork: 'testnet'.

#### Methods

- connect(): Promise<void>: Establishes a connection to the network and initializes DPP. ThrowsEvoNextError if failed.
- getNetwork(): string: Returns the configured network ('mainnet', 'testnet', or 'regtest').
- createWallet(mnemonic?: string): Promise<any>: Creates a new wallet instance. Requires connection first. (Placeholder for full implementation; integrates with DPP.)
- disconnect(): void: Stops the DPP instance and cleans up resources.

#### Types

- EvoNextConfig: Interface for configuration.

```ts
{
  network?: 'mainnet' | 'testnet' | 'regtest';
  apiUrl?: string;
  dppProvider?: any;  // DPP instance or config
}
```

- EvoNextError extends Error: Custom errors with optionalcode anddetails.

For full types, see the generateddist/index.d.ts or install and use@types/evonext (auto-included).


## Configuration

Customize your EvoNext instance via the config object:

- network: Specifies the Dash network. Defaults to'testnet'.
- apiUrl: Base URL for EvoNext APIs (e.g., for queries or events).
- dppProvider: Pass a pre-initialized DPP instance or config for advanced use. Without it, some features (like wallet ops) will warn but won't fail.


## Development

Clone the repo and get started:

```sh
git clone https://github.com/sansbankdao/evonext-js.git
cd evonext-js
pnpm install
pnpm build  # Compiles to dist/
pnpm dev    # Watch mode for development
```

- Testing: Run examples withnpx tsx example.ts (tsx is a dev dependency).
- Building: Usestsup for CJS/ESM bundles and types.
- Linting/Formatting: Not configured by default—add ESLint/Prettier as needed.
- Releasing: Bump version withpnpm version, thenpnpm publish.

Report bugs or suggest features on GitHub Issues.


## Contributing

Pull requests welcome!
Focus on adding DPP features, error handling, or tests.
See the repository for guidelines.


## License

MIT © EvoNext Team.
See LICENSE for details.
