"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  EvoNext: () => EvoNext
});
module.exports = __toCommonJS(index_exports);

// src/evonext.ts
var EvoNext = class {
  config;
  // private dppInstance?: dpp.DashPlatformProtocol  // Example DPP integration
  constructor(config = {}) {
    this.config = {
      network: "testnet",
      apiUrl: "https://api.evonext.test",
      // Placeholder API
      ...config
    };
    this.initializeDPP();
  }
  initializeDPP() {
    if (this.config.dppProvider) {
    } else {
      console.warn("DPP provider not configured; some features may be unavailable.");
    }
  }
  async connect() {
    try {
    } catch (error) {
      const err = error;
      err.code = err.code || "CONNECTION_FAILED";
      throw err;
    }
  }
  getNetwork() {
    return this.config.network || "testnet";
  }
  // Placeholder for future methods, e.g., wallet or contract interactions
  async createWallet(mnemonic) {
    return { address: "placeholder-address", mnemonic };
  }
  disconnect() {
    console.log("Disconnected from EvoNext");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EvoNext
});
