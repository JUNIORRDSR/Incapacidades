const { Injectable, UnauthorizedException } = require('@nestjs/common');
const { PassportStrategy } = require('@nestjs/passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const { ConfigService } = require('@nestjs/config');
const { PrismaService } = require('../../prisma/prisma.service');
const { decorateClass } = require('../../common/utils/apply-decorators');

/**
 * JWT Strategy for Passport
 * Validates JWT tokens and attaches user to request
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService, prisma) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
    this.prisma = prisma;
  }

  /**
   * Validate JWT payload and return user
   * @param {Object} payload - JWT payload
   * @returns {Promise<Object>} User object
   */
  async validate(payload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    return user;
  }
}

decorateClass(JwtStrategy, [Injectable()], [ConfigService, PrismaService]);

module.exports = { JwtStrategy };
