// deno-lint-ignore-file no-console
import { format } from '@std/datetime/format';
import * as color from '@std/fmt/colors';
import { type DispatchMessageContext, Level, type ServiceHandlerOption, type WorkerHandler } from 'ledger/struct';
import { NJSON } from 'next-json';
import type { ConsoleHandlerOptions } from './lib/option.ts';

/** Handler Exported Class. */
export class Handler implements WorkerHandler {
  private readonly options: ConsoleHandlerOptions & ServiceHandlerOption;

  public constructor(options: ServiceHandlerOption) {
    this.options = options as ConsoleHandlerOptions & ServiceHandlerOption;

    // Set Default Options
    this.options.colors = this.options.colors ?? color.getColorEnabled();
    this.options.template = this.options.template ?? '[{{timestamp}}] ({{service}}) {{level}}: {{message}} {{args}}';
    color.setColorEnabled(this.options.colors ?? color.getColorEnabled);
  }

  // deno-lint-ignore require-await
  public async receive({ context }: DispatchMessageContext): Promise<void> {
    // Level
    const level = Level[context.level];

    // Detect context.q type for stringification.
    if (context.q instanceof Error || typeof context.q !== 'string') {
      context.q = NJSON.stringify(context.q, null, 2);
    }

    // Variables
    const variables: [string, string][] = [
      ['service', color.gray(this.options.service)],
      ['timestamp', color.white(format(context.date, 'yyyy-MM-dd HH:mm:ss.SSS'))],
      ['message', context.q],
      ['args', NJSON.stringify([...(context.args ?? [])], null, 2)],
    ];

    // Write to Output
    switch (context.level) {
      case Level.TRACE: {
        console.debug(
          this.variable(...variables, ['level', `${color.brightCyan(level)}`]),
        );
        break;
      }
      case Level.INFORMATION: {
        console.info(
          this.variable(...variables, ['level', `${color.brightBlue(level)}`]),
        );
        break;
      }
      case Level.WARNING: {
        console.warn(
          this.variable(...variables, [
            'level',
            `${color.brightYellow(level)}`,
          ]),
        );
        break;
      }
      case Level.SEVERE: {
        console.error(
          this.variable(...variables, ['level', `${color.brightRed(level)}`]),
        );
        break;
      }
    }
  }

  /**
   * Substitute Template with Tupled Variables.
   *
   * @param tuples A '[string, string][]' variable.
   * @returns The substituted string.
   */
  private variable(...tuples: [string, string][]): string {
    let event = `${this.options.template}`;
    tuples.forEach(([k, v]) => {
      event = event.replaceAll(`{{${k}}}`, v);
    });
    return event;
  }
}

export type { ConsoleHandlerOptions };
