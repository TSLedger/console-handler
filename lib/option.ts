import type { HandlerOption, Level } from '../deps.ts';

export interface ConsoleHandlerOptions extends HandlerOption {
  /** If level is less than or equal to this specified level, the even will be logged. */
  level?: Level;
  /**
   * The template for formatting messages.
   *
   * Available Variables:
   * - {{timestamp}}
   * - {{level}}
   * - {{message}}
   * - {{args}}
   *
   * Default:
   * '[{{timestamp}}] {{level}}: {{message}} {{args}}'
   */
  template?: string;
  /** If colors should be enabled. Overrides "NO_COLOR" environment variable. */
  colors?: boolean;
}
