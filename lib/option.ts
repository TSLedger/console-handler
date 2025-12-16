export interface ConsoleHandlerOptions {
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
