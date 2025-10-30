const { Controller, Get, Put, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } = require('@nestjs/common');
const { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } = require('@nestjs/swagger');
const { UsersService } = require('./users.service');
const { JwtAuthGuard } = require('../auth/guards/jwt-auth.guard');
const { RolesGuard } = require('../common/guards/roles.guard');
const { Roles } = require('../common/decorators/roles.decorator');
const { GetUser } = require('../common/decorators/get-user.decorator');
const { decorateClass, decorateMethod, decorateParameter } = require('../common/utils/apply-decorators');

/**
 * Users Controller
 * Handles user management endpoints
 * @class UsersController
 */
class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  /**
   * Get all users (Admin only)
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<Object>}
   */
  async findAll(page = 1, limit = 10) {
    const result = await this.usersService.findAll(Number(page), Number(limit));
    return {
      success: true,
      ...result,
    };
  }

  /**
   * Get current user profile
   * @param {Object} user
   * @returns {Promise<Object>}
   */
  async getProfile(user) {
    const userData = await this.usersService.findById(user.id);
    return {
      success: true,
      data: userData,
    };
  }

  /**
   * Get user by ID
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async findOne(id) {
    const user = await this.usersService.findById(id);
    return {
      success: true,
      data: user,
    };
  }

  /**
   * Update user
   * @param {string} id
   * @param {Object} updateDto
   * @returns {Promise<Object>}
   */
  async update(id, updateDto) {
    const user = await this.usersService.update(id, updateDto);
    return {
      success: true,
      data: user,
      message: 'Usuario actualizado exitosamente',
    };
  }

  /**
   * Delete user (soft delete)
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async remove(id) {
    await this.usersService.remove(id);
    return {
      success: true,
      message: 'Usuario eliminado exitosamente',
    };
  }
}

decorateClass(
  UsersController,
  [ApiTags('users'), Controller('users'), UseGuards(JwtAuthGuard, RolesGuard), ApiBearerAuth()],
  [UsersService],
);

decorateMethod(
  UsersController.prototype,
  'findAll',
  [Get(), Roles('ADMIN'), ApiOperation({ summary: 'Obtener todos los usuarios (Admin)' }), ApiResponse({ status: 200, description: 'Lista de usuarios' })],
  [Number, Number],
  Promise,
);
decorateParameter(UsersController.prototype, 'findAll', 0, Query('page'));
decorateParameter(UsersController.prototype, 'findAll', 1, Query('limit'));

decorateMethod(
  UsersController.prototype,
  'getProfile',
  [Get('profile'), ApiOperation({ summary: 'Obtener perfil del usuario actual' }), ApiResponse({ status: 200, description: 'Perfil del usuario' })],
  [Object],
  Promise,
);
decorateParameter(UsersController.prototype, 'getProfile', 0, GetUser());

decorateMethod(
  UsersController.prototype,
  'findOne',
  [
    Get(':id'),
    ApiOperation({ summary: 'Obtener usuario por ID' }),
    ApiResponse({ status: 200, description: 'Usuario encontrado' }),
    ApiResponse({ status: 404, description: 'Usuario no encontrado' }),
  ],
  [String],
  Promise,
);
decorateParameter(UsersController.prototype, 'findOne', 0, Param('id'));

decorateMethod(
  UsersController.prototype,
  'update',
  [Put(':id'), ApiOperation({ summary: 'Actualizar usuario' }), ApiResponse({ status: 200, description: 'Usuario actualizado' })],
  [String, Object],
  Promise,
);
decorateParameter(UsersController.prototype, 'update', 0, Param('id'));
decorateParameter(UsersController.prototype, 'update', 1, Body());

decorateMethod(
  UsersController.prototype,
  'remove',
  [
    Delete(':id'),
    Roles('ADMIN'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Eliminar usuario (Admin)' }),
    ApiResponse({ status: 200, description: 'Usuario eliminado' }),
  ],
  [String],
  Promise,
);
decorateParameter(UsersController.prototype, 'remove', 0, Param('id'));

module.exports = { UsersController };
