const { Injectable, NotFoundException, ConflictException } = require('@nestjs/common');
const bcrypt = require('bcrypt');
const { PrismaService } = require('../prisma/prisma.service');
const { decorateClass } = require('../common/utils/apply-decorators');

/**
 * Users Service
 * Business logic for user management
 * @class UsersService
 */
class UsersService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Find all users (paginated)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>}
   */
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          cedula: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find user by ID
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async findById(id) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        cedula: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async findByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Update user
   * @param {string} id
   * @param {Object} updateDto
   * @returns {Promise<Object>}
   */
  async update(id, updateDto) {
    const user = await this.findById(id);

    // Check email uniqueness if changing
    if (updateDto.email && updateDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateDto.email);
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Hash password if changing
    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 12);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateDto,
      select: {
        id: true,
        email: true,
        fullName: true,
        cedula: true,
        phone: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  /**
   * Soft delete user (deactivate)
   * @param {string} id
   * @returns {Promise<void>}
   */
  async remove(id) {
    await this.findById(id);

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

decorateClass(UsersService, [Injectable()], [PrismaService]);

module.exports = { UsersService };
