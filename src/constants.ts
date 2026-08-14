export const INSTANCE_METHODS = ['toString', 'valueOf', Symbol.toPrimitive] as const;

export const INSTANCE_PROPERTIES = ['constructor', 'description'] as const;

export const STATIC_METHODS = ['for', 'keyFor'] as const;

export const STATIC_PROPERTIES = [
  'asyncDispose',
  'asyncIterator',
  'dispose',
  'hasInstance',
  'isConcatSpreadable',
  'iterator',
  // 'length' excluded because `Function::length` exists
  'match',
  'matchAll',
  'metadata',
  'replace',
  'search',
  'species',
  'split',
  'toPrimitive',
  'toStringTag',
  'unscopables',
] as const;
