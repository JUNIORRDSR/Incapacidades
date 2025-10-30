const { Injectable, OnModuleInit, OnModuleDestroy } = require('@nestjs/common');
const { PrismaClient } = require('@prisma/client');
const { decorateClass } = require('../common/utils/apply-decorators');

/**
 * Prisma Service for database operations
 * @class PrismaService
 * @extends {PrismaClient}
 * @implements {OnModuleInit}
 * @implements {OnModuleDestroy}
 */
class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  /**
   * Connect to database when module initializes
   */
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  /**
   * Disconnect from database when module is destroyed
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('👋 Database disconnected');
  }

  /**
   * Clean database (for testing purposes only)
   * WARNING: This will delete all data!
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase can only be used in test environment');
    }

    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    return Promise.all(
      models.map((modelKey) => {
        if (this[modelKey] && typeof this[modelKey].deleteMany === 'function') {
          return this[modelKey].deleteMany();
        }
      }),
    );
  }
}

decorateClass(PrismaService, [Injectable()]);

module.exports = { PrismaService };
