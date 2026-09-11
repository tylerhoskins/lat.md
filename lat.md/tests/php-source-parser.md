---
lat:
  require-code-mention: true
---

# PHP Source Parser

PHP source analysis and code-reference scanning cover Laravel application and test files without treating Blade attributes as code references.

## Extracts PHP declarations and members

PHP source analysis resolves unqualified classes, interfaces, traits, enums, enum cases, methods, constants, properties, constructor-promoted properties, and top-level functions and constants.

## Tolerates Blade PHP templates

Files ending in `.blade.php` parse without errors and do not require Blade comment syntax support when they contain template markup.

## Scans PHP line comments without matching attributes

PHP `//` and `#` comments produce code-reference backlinks, while PHP 8 attributes such as `#[Attribute]` do not produce false `@lat:` references.
