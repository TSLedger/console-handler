import type { GraphResponse } from './interface/graph.ts';

export async function request<T>(q: string, remote: string = 'https://api.tcgdex.net/v2/graphql'): Promise<T> {
  const body = JSON.stringify({
    query: (await Deno.readTextFile(new URL(`../template/${q}.ql`, import.meta.url))).trim(),
  });
  const request = await fetch(remote, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  return (await request.json() as GraphResponse).data as T;
}
