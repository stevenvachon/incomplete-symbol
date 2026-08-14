import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import customizeSymbol from './index.ts';
import {
  INSTANCE_METHODS,
  INSTANCE_PROPERTIES,
  STATIC_METHODS,
  STATIC_PROPERTIES,
} from './constants.ts';

const INSTANCE_KEYS = [...INSTANCE_METHODS, ...INSTANCE_PROPERTIES] as const;
const STATIC_KEYS = [...STATIC_METHODS, ...STATIC_PROPERTIES] as const;
const SYMBOL_DESCRIPTION = 'description';
const UNEXCLUDABLE_KEYS = ['constructor', 'length', 'toString', 'valueOf'] as const;

const isUnexcludableKey = (key: PropertyKey) =>
  (UNEXCLUDABLE_KEYS as readonly PropertyKey[]).includes(key);

/**
 * Add encapsulating quotes to a string or number, but not a `Symbol`.
 */
const quoteProperty = (key: PropertyKey) =>
  typeof key === 'symbol' ? String(key.description) : `"${key}"`;

const removeExcludableKeys = (keys: readonly PropertyKey[]) => keys.filter(isUnexcludableKey);

const removeUnexcludableKeys = (keys: readonly PropertyKey[]) =>
  keys.filter(key => !isUnexcludableKey(key));

describe('Default behavior', () => {
  it('is the same as the global', () => {
    const args = ['arg1', 'arg2'];
    const IncompleteSymbol = customizeSymbol();
    const describedSymbol = IncompleteSymbol(SYMBOL_DESCRIPTION);
    const nativeDescribedSymbol = Symbol(SYMBOL_DESCRIPTION);
    const nativeUndescribedSymbol = Symbol();
    const undescribedSymbol = IncompleteSymbol();

    INSTANCE_KEYS.forEach(key =>
      expect(key in describedSymbol).toBe(key in Object(nativeDescribedSymbol))
    );

    STATIC_KEYS.forEach(key => expect(key in IncompleteSymbol).toBe(key in Symbol));

    INSTANCE_PROPERTIES.forEach(property => {
      expect(describedSymbol[property]).toBe(nativeDescribedSymbol[property]);
      expect(undescribedSymbol[property]).toBe(nativeUndescribedSymbol[property]);
    });

    ([...STATIC_PROPERTIES, 'length'] as const).forEach(property =>
      expect(IncompleteSymbol[property]).toBe(Symbol[property])
    );

    INSTANCE_METHODS.forEach(method => {
      const spy = vi.spyOn(Symbol.prototype, method).mockReturnValue('');

      (describedSymbol[method] as (...args: unknown[]) => unknown)(...args);

      expect(spy).toHaveBeenCalledWith(...args);
      spy.mockRestore();
    });

    STATIC_METHODS.forEach(method => {
      const spy = vi.spyOn(Symbol, method).mockReturnValue(undefined);

      (IncompleteSymbol[method] as (...args: unknown[]) => unknown)(...args);

      expect(spy).toHaveBeenCalledWith(...args);
      spy.mockRestore();
    });
  });
});

describe('Unavailable properties/methods', () => {
  const originalSymbol = Symbol;

  beforeEach(() =>
    vi.stubGlobal(
      'Symbol',
      customizeSymbol(['description', 'for', 'hasInstance', Symbol.toPrimitive])
    )
  );

  afterEach(() => vi.unstubAllGlobals());

  it('does not attempt to wrap them', () => {
    const IncompleteSymbol = customizeSymbol();
    const symbol = IncompleteSymbol(SYMBOL_DESCRIPTION);
    expect('for' in IncompleteSymbol).toBe(false);
    expect('hasInstance' in IncompleteSymbol).toBe(false);
    expect('description' in symbol).toBe(false);
    expect(originalSymbol.toPrimitive in symbol).toBe(false);
  });
});

describe('Exclusions', () => {
  removeUnexcludableKeys(INSTANCE_KEYS).forEach(key =>
    it(quoteProperty(key), () => {
      const IncompleteSymbol = customizeSymbol([key]);
      const symbol = IncompleteSymbol(SYMBOL_DESCRIPTION);
      expect(key in symbol).toBe(false);
    })
  );

  removeUnexcludableKeys(STATIC_KEYS).forEach(key =>
    it(quoteProperty(key), () => {
      const IncompleteSymbol = customizeSymbol([key]);
      expect(key in IncompleteSymbol).toBe(false);
    })
  );

  it('all known methods/properties', () => {
    const IncompleteSymbol = customizeSymbol([...INSTANCE_KEYS, ...STATIC_KEYS]);
    const symbol = IncompleteSymbol(SYMBOL_DESCRIPTION);
    removeExcludableKeys(INSTANCE_KEYS).forEach(key => expect(key in symbol).toBe(true));
    removeExcludableKeys(STATIC_KEYS).forEach(key => expect(key in IncompleteSymbol).toBe(true));
    removeUnexcludableKeys(INSTANCE_KEYS).forEach(key => expect(key in symbol).toBe(false));
    removeUnexcludableKeys(STATIC_KEYS).forEach(key => expect(key in IncompleteSymbol).toBe(false));
  });

  it('unsupported', () =>
    expect(() => {
      const IncompleteSymbol = customizeSymbol(['non-existent']);
      IncompleteSymbol(SYMBOL_DESCRIPTION);
    }).not.toThrow());
});
