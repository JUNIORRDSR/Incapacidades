const { Injectable } = require('@nestjs/common');
const { AuthGuard } = require('@nestjs/passport');
const { decorateClass } = require('../../common/utils/apply-decorators');

/**
 * Local Authentication Guard
 * Used for login endpoint
 * @class LocalAuthGuard
 * @extends {AuthGuard('local')}
 */
class LocalAuthGuard extends AuthGuard('local') {}

decorateClass(LocalAuthGuard, [Injectable()]);

module.exports = { LocalAuthGuard };
