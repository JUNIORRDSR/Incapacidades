require('reflect-metadata');

/**
 * Apply class decorators and optional dependency metadata to emulate TypeScript behavior in plain JS.
 * @param {Function} target - Class to decorate
 * @param {Function[]} decorators - Decorators to apply
 * @param {Function[]} [paramTypes] - Constructor dependencies for Reflect metadata
 */
function decorateClass(target, decorators, paramTypes = []) {
  const metadataDecorator = paramTypes.length > 0 && Reflect.metadata ? Reflect.metadata('design:paramtypes', paramTypes) : null;
  const allDecorators = metadataDecorator ? [...decorators, metadataDecorator] : decorators;
  Reflect.decorate(allDecorators, target);
}

/**
 * Apply method decorators in JavaScript environment.
 * @param {Object} target - Prototype containing the method
 * @param {string} propertyKey - Method name
 * @param {Function[]} decorators - Decorators to apply
 */
function decorateMethod(target, propertyKey, decorators, paramTypes = [], returnType) {
  const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
  const metadataDecorators = [];

  if (Array.isArray(paramTypes) && paramTypes.length > 0 && Reflect.metadata) {
    metadataDecorators.push(Reflect.metadata('design:paramtypes', paramTypes));
  }

  if (typeof returnType !== 'undefined' && Reflect.metadata) {
    metadataDecorators.push(Reflect.metadata('design:returntype', returnType));
  }

  const allDecorators = [...decorators, ...metadataDecorators];

  const decoratedDescriptor = Reflect.decorate(allDecorators, target, propertyKey, descriptor) || descriptor;
  Object.defineProperty(target, propertyKey, decoratedDescriptor);
}

/**
 * Apply a parameter decorator at the desired index.
 * @param {Object} target - Prototype containing the method
 * @param {string} propertyKey - Method name
 * @param {number} parameterIndex - Parameter position (0-based)
 * @param {Function} decorator - Decorator factory invocation
 */
function decorateParameter(target, propertyKey, parameterIndex, decorator) {
  decorator(target, propertyKey, parameterIndex);
}

/**
 * Apply property decorators optionally including design type metadata.
 * @param {Function} target - Class constructor
 * @param {string} propertyKey - Property name
 * @param {Function[]} decorators - Decorators to apply
 * @param {Function} [designType] - Native constructor for Reflect metadata (e.g., String)
 */
function decorateProperty(target, propertyKey, decorators, designType) {
  const metadataDecorator = designType && Reflect.metadata ? Reflect.metadata('design:type', designType) : null;
  const allDecorators = metadataDecorator ? [...decorators, metadataDecorator] : decorators;
  Reflect.decorate(allDecorators, target.prototype, propertyKey);
}

module.exports = {
  decorateClass,
  decorateMethod,
  decorateParameter,
  decorateProperty,
};
