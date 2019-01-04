# incomplete-symbol [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Custom-remove features of a [`Symbol`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol) implementation.


This is useful when simulating the incomplete `Symbol` implementations available in some of today's modern web browsers.


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


[npm-image]: https://img.shields.io/npm/v/incomplete-symbol.svg
[npm-url]: https://npmjs.com/package/incomplete-symbol
[travis-image]: https://img.shields.io/travis/stevenvachon/incomplete-symbol.svg
[travis-url]: https://travis-ci.org/stevenvachon/incomplete-symbol
[coveralls-image]: https://img.shields.io/coveralls/stevenvachon/incomplete-symbol.svg
[coveralls-url]: https://coveralls.io/github/stevenvachon/incomplete-symbol
