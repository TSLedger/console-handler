// deno-lint-ignore-file no-console
import {
  type BinderOption,
  color,
  type DispatchMessageContext,
  format,
  Level,
  type WorkerHandler,
} from "./deps.ts";
import type { ConsoleHandlerOptions } from "./lib/option.ts";
import { serialize } from "./lib/util.ts";

/** Handler Exported Class. */
export class Handler implements WorkerHandler {
  private readonly options: ConsoleHandlerOptions;

  public constructor(options: BinderOption) {
    this.options = options as ConsoleHandlerOptions;

    // Set Default Options
    this.options.colors = this.options.colors ?? color.getColorEnabled();
    this.options.template = this.options.template ??
      "[{{timestamp}}] {{level}}: {{message}} {{args}}";
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

    // Timestamp
    const timestamp = `${
      color.white(format(context.date, "yyyy-MM-dd HH:mm:ss.SSS"))
    }`;

    // Message
    let message = context.q ?? "";
    if (message instanceof Error) {
      message = color.red(message.stack ?? message.message);
    } else {
      message = color.white(message);
    }

    // Arguments
    let args = serialize(context.args);
    if (args.trim() === "[]") args = "";

    // Variables
    const variables: [string, string][] = [
      ["timestamp", timestamp],
      ["message", message],
      ["args", args],
    ];

    // Write to Output
    switch (context.level) {
      case Level.TRACE: {
        console.info(
          this.variable(...variables, ["level", `${color.brightCyan(level)}`]),
        );
        break;
      }
      case Level.INFORMATION: {
        console.info(
          this.variable(...variables, ["level", `${color.brightBlue(level)}`]),
        );
        break;
      }
      case Level.WARNING: {
        console.info(
          this.variable(...variables, [
            "level",
            `${color.brightYellow(level)}`,
          ]),
        );
        break;
      }
      case Level.SEVERE: {
        console.info(
          this.variable(...variables, ["level", `${color.brightRed(level)}`]),
        );
        break;
      }
      default: {
        console.info(
          this.variable(...variables, ["level", `${color.brightGreen(level)}`]),
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
