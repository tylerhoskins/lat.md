import { describe, expect, it } from 'vitest';
import { parseSourceSymbols } from '../src/source-parser.js';

describe('PHP source parser', () => {
  // @lat: [[tests/php-source-parser#PHP Source Parser#Extracts PHP declarations and members]]
  it('extracts PHP declarations and members with unqualified names', async () => {
    const symbols = await parseSourceSymbols(
      'app/Example.php',
      `<?php
namespace App;

const TOP_LEVEL = 1;
function helper() { return true; }

interface Contract { public function run(): void; }
trait Logs { protected function log(): void {} }
enum Status: string {
    case Ready = 'ready';
    public function ok(): bool { return true; }
}
class Example {
    public const VERSION = 1;
    private string $value;
    public function verifyKey(string $key): bool { return true; }
    public function __construct(private int $id) {}
}
`,
    );

    expect(
      symbols.map(({ name, kind, parent }) => ({ name, kind, parent })),
    ).toEqual([
      { name: 'TOP_LEVEL', kind: 'const', parent: undefined },
      { name: 'helper', kind: 'function', parent: undefined },
      { name: 'Contract', kind: 'interface', parent: undefined },
      { name: 'run', kind: 'method', parent: 'Contract' },
      { name: 'Logs', kind: 'interface', parent: undefined },
      { name: 'log', kind: 'method', parent: 'Logs' },
      { name: 'Status', kind: 'class', parent: undefined },
      { name: 'Ready', kind: 'const', parent: 'Status' },
      { name: 'ok', kind: 'method', parent: 'Status' },
      { name: 'Example', kind: 'class', parent: undefined },
      { name: 'VERSION', kind: 'const', parent: 'Example' },
      { name: 'value', kind: 'variable', parent: 'Example' },
      { name: 'verifyKey', kind: 'method', parent: 'Example' },
      { name: '__construct', kind: 'method', parent: 'Example' },
      { name: 'id', kind: 'variable', parent: 'Example' },
    ]);
  });

  // @lat: [[tests/php-source-parser#PHP Source Parser#Tolerates Blade PHP templates]]
  it('tolerates Blade PHP templates', async () => {
    await expect(
      parseSourceSymbols(
        'resources/views/example.blade.php',
        '<div>{{ $name }}</div>\n{{-- Blade comment --}}\n',
      ),
    ).resolves.toEqual([]);
  });
});
