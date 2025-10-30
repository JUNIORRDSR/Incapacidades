const { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } = require('@nestjs/common');
const { ApiTags, ApiOperation, ApiResponse } = require('@nestjs/swagger');
const { AuthService } = require('./auth.service');
const { RegisterDto } = require('./dto/register.dto');
const { LoginDto } = require('./dto/login.dto');
const { RefreshTokenDto } = require('./dto/refresh-token.dto');
const { LocalAuthGuard } = require('./guards/local-auth.guard');
const { GetUser } = require('../common/decorators/get-user.decorator');
const { decorateClass, decorateMethod, decorateParameter } = require('../common/utils/apply-decorators');

/**
 * Authentication Controller
 * Handles registration, login, and token refresh
 * @class AuthController
 */
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * Register new user
   * @param {RegisterDto} registerDto
   * @returns {Promise<Object>}
   */
  async register(registerDto) {
    const result = await this.authService.register(registerDto);
    return {
      success: true,
      data: result,
      message: 'Usuario registrado exitosamente',
    };
  }

  /**
   * Login user
   * @param {LoginDto} loginDto
   * @param {Object} user
   * @returns {Promise<Object>}
   */
  async login(loginDto, user) {
    const result = await this.authService.login(user);
    return {
      success: true,
      data: result,
      message: 'Login exitoso',
    };
  }

  /**
   * Refresh access token
   * @param {RefreshTokenDto} refreshTokenDto
   * @returns {Promise<Object>}
   */
  async refreshToken(refreshTokenDto) {
    const result = await this.authService.refreshToken(refreshTokenDto.refreshToken);
    return {
      success: true,
      data: result,
      message: 'Token refrescado exitosamente',
    };
  }
}

decorateClass(AuthController, [ApiTags('auth'), Controller('auth')], [AuthService]);

decorateMethod(
  AuthController.prototype,
  'register',
  [
    Post('register'),
    ApiOperation({ summary: 'Registrar nuevo usuario' }),
    ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' }),
    ApiResponse({ status: 409, description: 'Email o cédula ya registrados' }),
    ApiResponse({ status: 400, description: 'Datos de entrada inválidos' }),
  ],
  [RegisterDto],
  Promise,
);
decorateParameter(AuthController.prototype, 'register', 0, Body());

decorateMethod(
  AuthController.prototype,
  'login',
  [
    Post('login'),
    UseGuards(LocalAuthGuard),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Iniciar sesión' }),
    ApiResponse({ status: 200, description: 'Login exitoso' }),
    ApiResponse({ status: 401, description: 'Credenciales inválidas' }),
  ],
  [LoginDto, Object],
  Promise,
);
decorateParameter(AuthController.prototype, 'login', 0, Body());
decorateParameter(AuthController.prototype, 'login', 1, GetUser());

decorateMethod(
  AuthController.prototype,
  'refreshToken',
  [
    Post('refresh'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Refrescar token de acceso' }),
    ApiResponse({ status: 200, description: 'Token refrescado exitosamente' }),
    ApiResponse({ status: 401, description: 'Token de refresco inválido' }),
  ],
  [RefreshTokenDto],
  Promise,
);
decorateParameter(AuthController.prototype, 'refreshToken', 0, Body());

module.exports = { AuthController };
