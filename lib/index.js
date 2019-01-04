"use strict";
const {instanceMethods, instanceProperties, staticMethods, staticProperties} = require("./props");



const customizeSymbol = (exclusions=[]) =>
{
	// For testing: uses the global value when this function is called
	// instead of when instances are created
	const globalSymbol = Symbol;

	function IncompleteSymbolInstance(description)
	{
		this._symbol = globalSymbol(description);

		instanceMethods
		.filter(method => !exclusions.includes(method) && typeof this._symbol[method]==="function")
		.forEach(method => this[method] = (...args) => this._symbol[method](...args));

		instanceProperties
		.filter(property => !exclusions.includes(property) && this._symbol[property]!==undefined)
		.forEach(property => Object.defineProperty(this, property,
		{
			get: () => this._symbol[property]
		}));
	}

	const IncompleteSymbol = (...args) => new IncompleteSymbolInstance(...args);

	staticMethods
	.filter(method => !exclusions.includes(method) && typeof globalSymbol[method]==="function")
	.forEach(method => IncompleteSymbol[method] = (...args) => globalSymbol[method](...args));

	staticProperties
	.filter(property => !exclusions.includes(property) && property in globalSymbol)
	.forEach(property => Object.defineProperty(IncompleteSymbol, property,
	{
		get: () => globalSymbol[property]
	}));

	return IncompleteSymbol;
};



module.exports = customizeSymbol;
