const { Module } = require('@nestjs/common');
const { UsersController } = require('./users.controller');
const { UsersService } = require('./users.service');
const { decorateClass } = require('../common/utils/apply-decorators');

/**
 * Users Module
 * Handles user management (CRUD operations)
 * @class UsersModule
 */
class UsersModule {}

decorateClass(UsersModule, [
  Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
  }),
]);

module.exports = { UsersModule };
