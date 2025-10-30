const { Module, Global } = require('@nestjs/common');
const { PrismaService } = require('./prisma.service');
const { decorateClass } = require('../common/utils/apply-decorators');

/**
 * Global Prisma Module - Available throughout the application
 * @class PrismaModule
 */
class PrismaModule {}

decorateClass(
  PrismaModule,
  [
    Global(),
    Module({
      providers: [PrismaService],
      exports: [PrismaService],
    }),
  ],
);

module.exports = { PrismaModule };
