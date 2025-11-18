/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
import _copyToClipboard from './src/copyToClipboard.js'

/* Export (local) modules. */
export const copyToClipboard = _copyToClipboard


/**
 * App Class
 *
 * Manages app functions.
 */
export class App extends EventEmitter {
    constructor(_params) {
        /* Initialize App class. */
        // console.info('Initializing App...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'App (Instance) is working!'
    }
    static test() {
        return 'App (Static) is working!'
    }
}


/* Initialize (globalThis) EvoNext class. */
const EvoNext = {}

/* Initialize App class. */
EvoNext.App = App

/* Initialize App modules. */
EvoNext.copyToClipboard = copyToClipboard

/* Export EvoNext to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.EvoNext = {
    ...globalThis.EvoNext, // preserve EvoNext object
    ...EvoNext, // extend EvoNext object
}
