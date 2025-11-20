// src/shims.ts
export function setupBrowserShims() {
  if (typeof window === 'undefined') return;

  // 🔥 FIX #1: module is not defined
  ;(window as any).module = { exports: {} };

  // 🔥 FIX #2: crypto.randomUUID polyfill
  if (!crypto.randomUUID) {
    ;(crypto as any).randomUUID = () =>
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
  }

  // 🔥 FIX #3: Node.js globals for dash-platform-sdk
  ;(window as any).Buffer = (window as any).Buffer || Uint8Array;
  ;(window as any).process = {
    env: {
      NODE_ENV: 'production',
      DEBUG: ''
    }
  };

  // 🔥 FIX #4: Global scope
  ;(window as any).global = window;

  console.log('🛡️ Browser shims loaded');
}
