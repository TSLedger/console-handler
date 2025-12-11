// Suite
import { expect } from 'expect';

// Internal
import { serialize } from '../lib/util.ts';

Deno.test({
  name: 'util:stringify',
  fn: () => {
    const struct = {
      k1: 'hello, world',
      k2: {
        hello: 'world',
      },
      k3: {
        number: 10,
        boolean: true,
        date: new Date('2025'),
      },
      k4: {
        deeply: {
          nested: {
            hello: 'world',
          },
        },
      },
    };

    expect(serialize(struct).replaceAll('\n', ' ')).toBe('{   k1: "hello, world",   k2: { hello: "world" },   k3: { number: 10, boolean: true, date: 1735689600000 },   k4: { deeply: { nested: { hello: "world" } } } }');
  },
});
