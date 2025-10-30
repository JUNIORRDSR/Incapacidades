const { Injectable, CanActivate, ExecutionContext } = require('@nestjs/common');
const { Reflector } = require('@nestjs/core');
const { ROLES_KEY } = require('../decorators/roles.decorator');
const { decorateClass } = require('../utils/apply-decorators');

/**
 * Roles Guard
 * Checks if user has required role(s)
 * @class RolesGuard
 * @implements {CanActivate}
 */
class RolesGuard {
  constructor(reflector) {
    this.reflector = reflector;
  }

  canActivate(context) {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

decorateClass(RolesGuard, [Injectable()], [Reflector]);

module.exports = { RolesGuard };
