"use strict";
const customizeSymbol = require("./lib");
const {afterEach, beforeEach, describe, it} = require("mocha");
const {expect} = require("chai").use( require("sinon-chai") );
const {instanceMethods, instanceProperties, staticMethods, staticProperties} = require("./lib/props");
const {restore, stub} = require("sinon");
require("symbol.prototype.description/auto");



const instanceKeys = [...instanceMethods, ...instanceProperties];

const propertyString = key => typeof key === "symbol" ? key.description : `"${key}"`;

const removeExtendableKeys = keys => keys.filter(key => unextendableKeys.includes(key));
const removeUnextendableKeys = keys => keys.filter(key => !unextendableKeys.includes(key));

const staticKeys = [...staticMethods, ...staticProperties];
const symbolString = "description";

const unextendableKeys =
[
	"constructor",
	"length",
	"toString",
	"valueOf"
];



describe("Default behavior", () =>
{
	it("is the same as the global", () =>
	{
		const IncompleteSymbol = customizeSymbol();

		const symbol = IncompleteSymbol(symbolString);

		instanceKeys.forEach(key => expect(symbol).to.have.property(key));
		staticKeys.forEach(key => expect(IncompleteSymbol).to.have.property(key));

		const args = ["arg1", "arg2"];

		instanceMethods.forEach(method =>
		{
			stub(Symbol.prototype, method);

			symbol[method](...args);

			expect(Symbol.prototype[method]).to.have.been.calledWith(...args);

			restore();
		});

		staticMethods.forEach(method =>
		{
			stub(Symbol, method);

			IncompleteSymbol[method](...args);

			expect(Symbol[method]).to.have.been.calledWith(...args);

			restore();
		});
	});
});



describe("Unavailable properties/methods", () =>
{
	const originalSymbol = Symbol;



	beforeEach(() =>
	{
		const stubbedSymbol = customizeSymbol(
		[
			"description",
			"for",
			"hasInstance",
			Symbol.toPrimitive
		]);

		stub(global, "Symbol").callsFake(stubbedSymbol);
	});

	afterEach(() => restore());



	it("does not attempt to wrap them", () =>
	{
		const IncompleteSymbol = customizeSymbol();

		const symbol = IncompleteSymbol(symbolString);

		expect(IncompleteSymbol).to.not.have.property("for");
		expect(IncompleteSymbol).to.not.have.property("hasInstance");
		expect(symbol).to.not.have.property("description");
		expect(symbol).to.not.have.property(originalSymbol.toPrimitive);
	})
});



describe("Exclusions", () =>
{
	removeUnextendableKeys(instanceKeys).forEach(key => it(propertyString(key), () =>
	{
		const IncompleteSymbol = customizeSymbol([key]);

		const symbol = IncompleteSymbol(symbolString);

		expect(symbol).to.not.have.property(key);
	}));



	removeUnextendableKeys(staticKeys).forEach(key => it(propertyString(key), () =>
	{
		const IncompleteSymbol = customizeSymbol([key]);

		expect(IncompleteSymbol).to.not.have.property(key);
	}));



	it("all methods/properties", () =>
	{
		const IncompleteSymbol = customizeSymbol([...instanceKeys, ...staticKeys]);

		const symbol = IncompleteSymbol(symbolString);

		removeExtendableKeys(instanceKeys).forEach(key => expect(symbol).to.have.property(key));
		removeExtendableKeys(staticKeys).forEach(key => expect(IncompleteSymbol).to.have.property(key));

		removeUnextendableKeys(instanceKeys).forEach(key => expect(symbol).to.not.have.property(key));
		removeUnextendableKeys(staticKeys).forEach(key => expect(IncompleteSymbol).to.not.have.property(key));
	});
});
