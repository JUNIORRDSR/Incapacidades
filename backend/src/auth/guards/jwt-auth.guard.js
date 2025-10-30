const { Injectable } = require('@nestjs/common');
const { AuthGuard } = require('@nestjs/passport');
const { decorateClass } = require('../../common/utils/apply-decorators');

/**
 * JWT Authentication Guard
 * Protects routes requiring authentication
 * @class JwtAuthGuard
 * @extends {AuthGuard('jwt')}
 */
class JwtAuthGuard extends AuthGuard('jwt') {}

decorateClass(JwtAuthGuard, [Injectable()]);

module.exports = { JwtAuthGuard };
