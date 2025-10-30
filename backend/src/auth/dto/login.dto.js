const { IsEmail, IsString, MinLength } = require('class-validator');
const { ApiProperty } = require('@nestjs/swagger');
const { decorateProperty } = require('../../common/utils/apply-decorators');

/**
 * Login DTO
 * @class LoginDto
 */
class LoginDto {
  email;
  password;
}

decorateProperty(
  LoginDto,
  'email',
  [
    ApiProperty({ example: 'user@example.com', description: 'Email del usuario' }),
    IsEmail({}, { message: 'Email inválido' }),
  ],
  String,
);

decorateProperty(
  LoginDto,
  'password',
  [
    ApiProperty({ example: 'Password123!', description: 'Contraseña del usuario' }),
    IsString(),
    MinLength(8, { message: 'Contraseña debe tener mínimo 8 caracteres' }),
  ],
  String,
);

module.exports = { LoginDto };
