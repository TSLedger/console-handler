// deno-lint-ignore-file no-console
// import { color, type DispatchMessageContext, format, Level, type ServiceHandlerOption, type WorkerHandler } from './deps.ts';
import { format } from '@std/datetime/format';
import * as color from '@std/fmt/colors';
import { type DispatchMessageContext, Level, type ServiceHandlerOption, type WorkerHandler } from 'ledger/struct';
import type { ConsoleHandlerOptions } from './lib/option.ts';
import { serialize } from './lib/util.ts';

/** Handler Exported Class. */
export class Handler implements WorkerHandler {
  private readonly options: ConsoleHandlerOptions & ServiceHandlerOption;

  public constructor(options: ServiceHandlerOption) {
    this.options = options as ConsoleHandlerOptions & ServiceHandlerOption;

    // Set Default Options
    this.options.colors = this.options.colors ?? color.getColorEnabled();
    this.options.template = this.options.template ?? '[{{timestamp}}] ({{service}}) {{level}}: {{message}} {{args}}';
    color.setColorEnabled(this.options.colors);
  }

  // deno-lint-ignore require-await
  public async receive({ context }: DispatchMessageContext): Promise<void> {
    // Level
    const level = Level[context.level];

    // Filter Level
    if (!(context.level <= (this.options.level ?? Level.LEDGER_ERROR))) {
      return;
    }

    // Message
    let message = context.q ?? '';
    if (message instanceof Error) {
      message = color.red(message.stack ?? message.message);
    } else {
      message = color.white(serialize(message));
    }

    // Arguments
    let args = serialize(context.args);
    if (args.trim() === '[]') args = '';

    // Variables
    const variables: [string, string][] = [
      ['service', color.gray(this.options.service)],
      ['timestamp', color.white(format(context.date, 'yyyy-MM-dd HH:mm:ss.SSS'))],
      ['message', message],
      ['args', args],
    ];

    // Write to Output
    switch (context.level) {
      case Level.TRACE: {
        console.info(
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
      default: {
        console.info(
          this.variable(...variables, ['level', `${color.brightGreen(level)}`]),
        );
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
