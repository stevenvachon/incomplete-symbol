# incomplete-symbol [![NPM Version][npm-image]][npm-url] ![Build Status][ghactions-image] [![Coverage Status][codecov-image]][codecov-url]

> Custom-remove features of a [`Symbol`](https://mdn.io/Symbol) implementation.

This is useful when simulating the incomplete `Symbol` implementations available in some web browsers from 2019.

> [!NOTE]
>
> If you need to support older versions of Node.js (going back to `8.x`), use `1.x` of this package.

## Install

```shell
npm install incomplete-symbol
```

## Usage

```js
import customizeSymbol from 'incomplete-symbol';

const exclusions = ['description', 'toStringTag'];
const IncompleteSymbol = customizeSymbol(exclusions);
const symbol = IncompleteSymbol('foo');

console.log(IncompleteSymbol.toStringTag); //-> undefined
console.log(symbol.description); //-> undefined
```

[npm-image]: https://img.shields.io/npm/v/incomplete-symbol
[npm-url]: https://npmjs.com/package/incomplete-symbol
[ghactions-image]: https://img.shields.io/github/actions/workflow/status/stevenvachon/incomplete-symbol/test.yml
[codecov-image]: https://img.shields.io/codecov/c/github/stevenvachon/incomplete-symbol
[codecov-url]: https://app.codecov.io/github/stevenvachon/incomplete-symbol
