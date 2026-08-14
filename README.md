# incomplete-symbol [![NPM Version][npm-image]][npm-url] ![Build Status][ghactions-image] [![Coverage Status][codecov-image]][codecov-url]

> Custom-remove features of a [`Symbol`](https://mdn.io/Symbol) implementation.


This is useful when simulating the incomplete `Symbol` implementations available in some web browsers from 2019.


## Installation

[Node.js](http://nodejs.org/) `>= 8` is required. To install, type this at the command line:
```shell
npm install incomplete-symbol
```


## Usage

```js
const customizeSymbol = require('incomplete-symbol');

const exclusions = ['description', 'toStringTag'];
const IncompleteSymbol = customizeSymbol(exclusions);
const symbol = new IncompleteSymbol('foo');

console.log(IncompleteSymbol.toStringTag); //-> undefined
console.log(symbol.description); //-> undefined
```


## Arguments

### `exclusions`
Type: `Array`  
Default value: `[]`  
The output `Symbol` function and any instances created with it will not expose each listed property/method.


[npm-image]: https://img.shields.io/npm/v/incomplete-symbol
[npm-url]: https://npmjs.com/package/incomplete-symbol
[ghactions-image]: https://img.shields.io/github/actions/workflow/status/stevenvachon/incomplete-symbol/test.yml?branch=1.x.x
[codecov-image]: https://img.shields.io/codecov/c/github/stevenvachon/incomplete-symbol/1.x.x
[codecov-url]: https://app.codecov.io/github/stevenvachon/incomplete-symbol/tree/1.x.x

