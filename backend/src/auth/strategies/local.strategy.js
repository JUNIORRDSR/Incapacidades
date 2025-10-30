const { Injectable, UnauthorizedException } = require('@nestjs/common');
const { PassportStrategy } = require('@nestjs/passport');
const { Strategy } = require('passport-local');
const { AuthService } = require('../auth.service');
const { decorateClass } = require('../../common/utils/apply-decorators');

/**
 * Local Strategy for Passport
 * Validates username (email) and password
 * @class LocalStrategy
 * @extends {PassportStrategy(Strategy)}
 */
class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(authService) {
    super({ usernameField: 'email' });
    this.authService = authService;
  }

  /**
   * Validate user credentials
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} User object
   */
  async validate(email, password) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }
}

decorateClass(LocalStrategy, [Injectable()], [AuthService]);

module.exports = { LocalStrategy };
