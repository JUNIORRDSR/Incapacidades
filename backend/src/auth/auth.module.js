const { Module } = require('@nestjs/common');
const { JwtModule } = require('@nestjs/jwt');
const { PassportModule } = require('@nestjs/passport');
const { ConfigModule, ConfigService } = require('@nestjs/config');
const { AuthService } = require('./auth.service');
const { AuthController } = require('./auth.controller');
const { JwtStrategy } = require('./strategies/jwt.strategy');
const { LocalStrategy } = require('./strategies/local.strategy');
const { UsersModule } = require('../users/users.module');
const { decorateClass } = require('../common/utils/apply-decorators');

/**
 * Authentication Module
 * Handles JWT authentication, login, register, refresh tokens
 * @class AuthModule
 */
class AuthModule {}

decorateClass(
  AuthModule,
  [
    Module({
      imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get('JWT_EXPIRES_IN') || '1h',
            },
          }),
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, LocalStrategy],
      exports: [AuthService, JwtModule],
    }),
  ],
);

module.exports = { AuthModule };
