const { Injectable, UnauthorizedException, ConflictException } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');
const { ConfigService } = require('@nestjs/config');
const bcrypt = require('bcrypt');
const { PrismaService } = require('../prisma/prisma.service');
const { decorateClass } = require('../common/utils/apply-decorators');

/**
 * Authentication Service
 * Handles user registration, login, and token management
 * @class AuthService
 */
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

decorateClass(AuthService, [Injectable()], [JwtService, PrismaService, ConfigService]);

module.exports = { AuthService };
