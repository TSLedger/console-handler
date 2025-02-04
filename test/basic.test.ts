// deno-lint-ignore-file no-external-import
// Suite
import { delay } from "jsr:@std/async";
import { expect } from "jsr:@std/expect";

// Internal
import { Ledger } from "../deps.ts";

Deno.test({
  name: "mod.ts",
  fn: async (suite) => {
    let ledger: Ledger | null = null;

    await suite.step({
      name: "mod.ts:setup",
      fn: async () => {
        ledger = new Ledger({
          useAsyncDispatchQueue: true,
        });
        ledger.register({
          definition: new URL("../mod.ts", import.meta.url).pathname,
        });
        await ledger.alive();
        ledger.information("Test, suite.");
        await delay(250);
        ledger.terminate();
        await delay(250);
        expect("").toBe("");
      },
    });
  },
});
