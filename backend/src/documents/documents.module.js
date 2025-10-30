const { Module } = require('@nestjs/common');
const { decorateClass } = require('../common/utils/apply-decorators');

/**
 * Documents Module stub.
 * Provides a NestJS module placeholder until document features are implemented.
 */
class DocumentsModule {}

decorateClass(
  DocumentsModule,
  [
    Module({
      imports: [],
      controllers: [],
      providers: [],
      exports: [],
    }),
  ],
);

module.exports = { DocumentsModule };
