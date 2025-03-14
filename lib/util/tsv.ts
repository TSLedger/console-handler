export class TSV {
  public static async write(path: URL, table: string[][]): Promise<void> {
    const tsv = table.map((v) => v.join('\t'));
    await Deno.writeTextFile(path, tsv.join('\n'));
  }
}
