"use strict";



const instanceMethods =
[
	"toString",
	"valueOf",
	Symbol.toPrimitive
];



const instanceProperties =
[
	"constructor",
	"description"
];



const staticMethods =
[
	"for",
	"keyFor"
];



const staticProperties =
[
	"hasInstance",
	"isConcatSpreadable",
	"iterator",
	"length",
	"match",
	"replace",
	"search",
	"species",
	"split",
	"toPrimitive",
	"toStringTag",
	"unscopables"
];



module.exports =
{
	instanceMethods,
	instanceProperties,
	staticMethods,
	staticProperties
};
