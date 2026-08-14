import {
  INSTANCE_METHODS,
  INSTANCE_PROPERTIES,
  STATIC_METHODS,
  STATIC_PROPERTIES,
} from './constants.ts';

type IncompleteSymbol = ((description?: string) => Partial<Symbol>) &
  Partial<
    Pick<SymbolConstructor, (typeof STATIC_METHODS)[number] | (typeof STATIC_PROPERTIES)[number]>
  >;

/**
 * Custom-remove features of a [`Symbol`](https://mdn.io/Symbol) implementation.
 * @param exclusions The properties/methods to hide/remove from the output `Symbol` function and any instances created with it.
 */
export default (exclusions: PropertyKey[] = []) => {
  // For tests: uses the global value when this function is called instead of when instances are created
  const globalSymbol = Symbol;

  class IncompleteSymbolInstance {
    #symbol: symbol;

    constructor(description?: string) {
      this.#symbol = globalSymbol(description);

      // Forward instance methods to `#symbol`
      INSTANCE_METHODS.filter(
        method => !(exclusions.includes(method) || typeof this.#symbol[method] !== 'function')
      ).forEach(method =>
        Object.defineProperty(this, method, {
          value: (...args: unknown[]) =>
            (this.#symbol[method] as (...args: unknown[]) => unknown)(...args),
        })
      );

      // Forward instance properties to `#symbol`
      INSTANCE_PROPERTIES.filter(
        property => !(exclusions.includes(property) || !(property in Object(this.#symbol)))
      ).forEach(property =>
        Object.defineProperty(this, property, {
          get: () => this.#symbol[property],
        })
      );
    }
  }

  // The default value (of undefined) makes the function's `length === 0` just like that of `Symbol`
  const IncompleteSymbol = ((description: string | undefined = undefined) =>
    new IncompleteSymbolInstance(description) as unknown as Partial<Symbol>) as IncompleteSymbol;

  // Forward static methods to `globalSymbol`
  STATIC_METHODS.filter(
    method => !(exclusions.includes(method) || typeof globalSymbol[method] !== 'function')
  ).forEach(method =>
    Object.defineProperty(IncompleteSymbol, method, {
      value: (...args: unknown[]) =>
        (globalSymbol[method] as (...args: unknown[]) => unknown)(...args),
    })
  );

  // Forward static properties to `globalSymbol`
  STATIC_PROPERTIES.filter(
    property => !(exclusions.includes(property) || !(property in globalSymbol))
  ).forEach(property =>
    Object.defineProperty(IncompleteSymbol, property, {
      get: () => globalSymbol[property],
    })
  );

  return IncompleteSymbol;
};
