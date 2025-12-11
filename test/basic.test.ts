// Suite
import { delay } from 'async';
import { expect } from 'expect';

// Internal
import { Ledger } from 'ledger';
import { Level } from 'ledger/struct';
import type { ConsoleHandlerOptions } from '../lib/option.ts';

Deno.test({
  name: 'mod.ts',
  fn: async (suite) => {
    let ledger: Ledger | null = null;

    await suite.step({
      name: 'mod.ts:setup',
      fn: async () => {
        ledger = new Ledger({
          service: 'test-suite',
          useAsyncDispatchQueue: true,
        });
        ledger.register<ConsoleHandlerOptions>({
          definition: new URL('../mod.ts', import.meta.url).href,
          level: Level.SEVERE,
        });
        await ledger.alive();
        ledger.trace('Debuggy!');
        ledger.information('Test, suite.');
        ledger.severe('Uh oh!');
        await delay(250);
        ledger.terminate();
        await delay(250);
        expect('').toBe('');
      },
    });
  },
});
