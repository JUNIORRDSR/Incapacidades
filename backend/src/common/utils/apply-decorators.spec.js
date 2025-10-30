require('reflect-metadata');

const { Controller, Get } = require('@nestjs/common');
const {
  decorateClass,
  decorateMethod,
  decorateParameter,
  decorateProperty,
} = require('./apply-decorators');

describe('apply-decorators helpers', () => {
  it('applies class decorators and preserves Reflect metadata', () => {
    class Sample {}

    decorateClass(Sample, [Controller('sample')]);

    const controllerPath = Reflect.getMetadata('path', Sample);
    expect(controllerPath).toBe('sample');
  });

  it('applies method decorators without throwing', () => {
    class Handler {
      handler() {}
    }

    expect(() => decorateMethod(Handler.prototype, 'handler', [Get()])).not.toThrow();
  });

  it('applies parameter decorators by executing decorator factory', () => {
    class Target {
      action() {}
    }

    const paramDecorator = jest.fn((target, propertyKey, parameterIndex) => {
      Reflect.defineMetadata('test:param', parameterIndex, target, propertyKey);
    });

    decorateParameter(Target.prototype, 'action', 0, paramDecorator);

    expect(paramDecorator).toHaveBeenCalledWith(Target.prototype, 'action', 0);
    expect(Reflect.getMetadata('test:param', Target.prototype, 'action')).toBe(0);
  });

  it('applies property decorators and emits design:type metadata', () => {
    class WithProp {
      value;
    }

    const propertyDecorator = jest.fn((target, propertyKey) => {
      Reflect.defineMetadata('test:prop', propertyKey, target, propertyKey);
    });

    decorateProperty(WithProp, 'value', [propertyDecorator], String);

  expect(propertyDecorator).toHaveBeenCalledWith(WithProp.prototype, 'value', undefined);
    expect(Reflect.getMetadata('test:prop', WithProp.prototype, 'value')).toBe('value');
    expect(Reflect.getMetadata('design:type', WithProp.prototype, 'value')).toBe(String);
  });
});
