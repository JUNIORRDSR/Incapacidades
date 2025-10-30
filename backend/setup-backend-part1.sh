#!/bin/bash

# Script para crear todos los archivos del backend del Sistema de Incapacidades
# Este script genera la estructura completa del proyecto NestJS

echo "🚀 Creando estructura completa del backend..."

cd "$(dirname "$0")"

# ============================================================================
# AUTH MODULE - DTOs
# ============================================================================

cat > src/auth/dto/login.dto.js << 'EOF'
const { IsEmail, IsString, MinLength } = require('class-validator');
const { ApiProperty } = require('@nestjs/swagger');

/**
 * Login DTO
 * @class LoginDto
 */
class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email del usuario' })
  @IsEmail({}, { message: 'Email inválido' })
  email;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña del usuario' })
  @IsString()
  @MinLength(8, { message: 'Contraseña debe tener mínimo 8 caracteres' })
  password;
}

module.exports = { LoginDto };
EOF

cat > src/auth/dto/register.dto.js << 'EOF'
const { IsEmail, IsString, MinLength, Matches, IsOptional } = require('class-validator');
const { ApiProperty } = require('@nestjs/swagger');

/**
 * Register DTO
 * @class RegisterDto
 */
class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email del usuario' })
  @IsEmail({}, { message: 'Email inválido' })
  email;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña (mínimo 8 caracteres)' })
  @IsString()
  @MinLength(8, { message: 'Contraseña debe tener mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Contraseña debe incluir mayúsculas, minúsculas y números',
  })
  password;

  @ApiProperty({ example: 'Juan Pérez García', description: 'Nombre completo del usuario' })
  @IsString()
  fullName;

  @ApiProperty({ example: '1234567890', description: 'Cédula de ciudadanía (6-10 dígitos)' })
  @Matches(/^\d{6,10}$/, { message: 'Cédula inválida (debe tener entre 6 y 10 dígitos)' })
  cedula;

  @ApiProperty({ example: '3001234567', description: 'Número de teléfono', required: false })
  @IsOptional()
  @IsString()
  phone;
}

module.exports = { RegisterDto };
EOF

cat > src/auth/dto/refresh-token.dto.js << 'EOF'
const { IsString, IsNotEmpty } = require('class-validator');
const { ApiProperty } = require('@nestjs/swagger');

/**
 * Refresh Token DTO
 * @class RefreshTokenDto
 */
class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token JWT' })
  @IsString()
  @IsNotEmpty()
  refreshToken;
}

module.exports = { RefreshTokenDto };
EOF

# ============================================================================
# AUTH MODULE - Strategies
# ============================================================================

cat > src/auth/strategies/jwt.strategy.js << 'EOF'
const { Injectable, UnauthorizedException } = require('@nestjs/common');
const { PassportStrategy } = require('@nestjs/passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const { ConfigService } = require('@nestjs/config');
const { PrismaService } = require('../../prisma/prisma.service');

/**
 * JWT Strategy for Passport
 * Validates JWT tokens and attaches user to request
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
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

module.exports = { JwtStrategy };
EOF

cat > src/auth/strategies/local.strategy.js << 'EOF'
const { Injectable, UnauthorizedException } = require('@nestjs/common');
const { PassportStrategy } = require('@nestjs/passport');
const { Strategy } = require('passport-local');
const { AuthService } = require('../auth.service');

/**
 * Local Strategy for Passport
 * Validates username (email) and password
 * @class LocalStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
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

module.exports = { LocalStrategy };
EOF

# ============================================================================
# AUTH MODULE - Guards
# ============================================================================

cat > src/auth/guards/jwt-auth.guard.js << 'EOF'
const { Injectable } = require('@nestjs/common');
const { AuthGuard } = require('@nestjs/passport');

/**
 * JWT Authentication Guard
 * Protects routes requiring authentication
 * @class JwtAuthGuard
 * @extends {AuthGuard('jwt')}
 */
@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') {}

module.exports = { JwtAuthGuard };
EOF

cat > src/auth/guards/local-auth.guard.js << 'EOF'
const { Injectable } = require('@nestjs/common');
const { AuthGuard } = require('@nestjs/passport');

/**
 * Local Authentication Guard
 * Used for login endpoint
 * @class LocalAuthGuard
 * @extends {AuthGuard('local')}
 */
@Injectable()
class LocalAuthGuard extends AuthGuard('local') {}

module.exports = { LocalAuthGuard };
EOF

echo "✅ Archivos de autenticación creados"

# ============================================================================
# COMMON - Decorators
# ============================================================================

cat > src/common/decorators/roles.decorator.js << 'EOF'
const { SetMetadata } = require('@nestjs/common');

const ROLES_KEY = 'roles';
const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);

module.exports = { Roles, ROLES_KEY };
EOF

cat > src/common/decorators/get-user.decorator.js << 'EOF'
const { createParamDecorator, ExecutionContext } = require('@nestjs/common');

/**
 * Get User decorator
 * Extracts user from request object
 */
const GetUser = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

module.exports = { GetUser };
EOF

# ============================================================================
# COMMON - Guards
# ============================================================================

cat > src/common/guards/roles.guard.js << 'EOF'
const { Injectable, CanActivate, ExecutionContext } = require('@nestjs/common');
const { Reflector } = require('@nestjs/core');
const { ROLES_KEY } = require('../decorators/roles.decorator');

/**
 * Roles Guard
 * Checks if user has required role(s)
 * @class RolesGuard
 * @implements {CanActivate}
 */
@Injectable()
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

module.exports = { RolesGuard };
EOF

# ============================================================================
# COMMON - Filters
# ============================================================================

cat > src/common/filters/http-exception.filter.js << 'EOF'
const { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } = require('@nestjs/common');

/**
 * Global HTTP Exception Filter
 * Handles all exceptions and formats error responses
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 */
@Catch()
class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Error interno del servidor';

    const errorResponse = {
      success: false,
      error: {
        statusCode: status,
        message: typeof message === 'string' ? message : message.message || message,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    // Log error for debugging
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('❌ Internal Server Error:', exception);
    }

    response.status(status).json(errorResponse);
  }
}

module.exports = { HttpExceptionFilter };
EOF

echo "✅ Archivos comunes (decorators, guards, filters) creados"

# ============================================================================
# AUTH MODULE - Service & Controller
# ============================================================================

cat > src/auth/auth.service.js << 'EOF'
const { Injectable, UnauthorizedException, ConflictException } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');
const { ConfigService } = require('@nestjs/config');
const bcrypt = require('bcrypt');
const { PrismaService } = require('../prisma/prisma.service');

/**
 * Authentication Service
 * Handles user registration, login, and token management
 * @class AuthService
 */
@Injectable()
class AuthService {
  constructor(jwtService, prisma, configService) {
    this.jwtService = jwtService;
    this.prisma = prisma;
    this.configService = configService;
  }

  /**
   * Register new user
   * @param {Object} registerDto
   * @returns {Promise<Object>} User data with tokens
   */
  async register(registerDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Check if cedula already exists
    const existingCedula = await this.prisma.user.findUnique({
      where: { cedula: registerDto.cedula },
    });

    if (existingCedula) {
      throw new ConflictException('La cédula ya está registrada');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        fullName: registerDto.fullName,
        cedula: registerDto.cedula,
        phone: registerDto.phone,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        cedula: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  /**
   * Login user
   * @param {Object} user
   * @returns {Promise<Object>} User data with tokens
   */
  async login(user) {
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      ...tokens,
    };
  }

  /**
   * Validate user credentials
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object|null>} User object or null
   */
  async validateUser(email, password) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken(refreshToken) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Token de refresco inválido');
    }
  }

  /**
   * Generate access and refresh tokens
   * @param {Object} user
   * @returns {Promise<Object>} Tokens
   */
  async generateTokens(user) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN') || '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = { AuthService };
EOF

cat > src/auth/auth.controller.js << 'EOF'
const { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } = require('@nestjs/common');
const { ApiTags, ApiOperation, ApiResponse } = require('@nestjs/swagger');
const { AuthService } = require('./auth.service');
const { RegisterDto } = require('./dto/register.dto');
const { LoginDto } = require('./dto/login.dto');
const { RefreshTokenDto } = require('./dto/refresh-token.dto');
const { LocalAuthGuard } = require('./guards/local-auth.guard');
const { GetUser } = require('../common/decorators/get-user.decorator');

/**
 * Authentication Controller
 * Handles registration, login, and token refresh
 * @class AuthController
 */
@ApiTags('auth')
@Controller('auth')
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * Register new user
   * @param {RegisterDto} registerDto
   * @returns {Promise<Object>}
   */
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email o cédula ya registrados' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async register(@Body() registerDto) {
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
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto, @GetUser() user) {
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
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  @ApiResponse({ status: 200, description: 'Token refrescado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token de refresco inválido' })
  async refreshToken(@Body() refreshTokenDto) {
    const result = await this.authService.refreshToken(refreshTokenDto.refreshToken);
    return {
      success: true,
      data: result,
      message: 'Token refrescado exitosamente',
    };
  }
}

module.exports = { AuthController };
EOF

echo "✅ Servicio y controlador de autenticación creados"

echo "
╔═══════════════════════════════════════════════════════════════╗
║                                                                ║
║   ✅ ESTRUCTURA DE BACKEND PARCIALMENTE CREADA                ║
║                                                                ║
║   📁 Módulos creados:                                         ║
║      - Prisma Service & Module                                ║
║      - Authentication Module (completo)                       ║
║      - Common utilities (decorators, guards, filters)         ║
║                                                                ║
║   ⏭️  Siguiente: Ejecutar este script y continuar con:        ║
║      - Users Module                                           ║
║      - Documents Module                                       ║
║      - Storage Module                                         ║
║      - Testing configuration                                  ║
║                                                                ║
╚═══════════════════════════════════════════════════════════════╝
"

chmod +x "$0"
