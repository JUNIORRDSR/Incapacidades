const { Module } = require('@nestjs/common');
const { decorateClass } = require('../common/utils/apply-decorators');

/**
 * Storage Module stub.
 * Keeps the application wiring intact while storage features are pending.
 */
class StorageModule {}

decorateClass(
  StorageModule,
  [
    Module({
      imports: [],
      controllers: [],
      providers: [],
      exports: [],
    }),
  ],
);

module.exports = { StorageModule };
