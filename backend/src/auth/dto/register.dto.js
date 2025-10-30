const { IsEmail, IsString, MinLength, Matches, IsOptional } = require('class-validator');
const { ApiProperty } = require('@nestjs/swagger');
const { decorateProperty } = require('../../common/utils/apply-decorators');

/**
 * Register DTO
 * @class RegisterDto
 */
class RegisterDto {
  email;
  password;
  fullName;
  cedula;
  phone;
}

decorateProperty(
  RegisterDto,
  'email',
  [
    ApiProperty({ example: 'user@example.com', description: 'Email del usuario' }),
    IsEmail({}, { message: 'Email inválido' }),
  ],
  String,
);

decorateProperty(
  RegisterDto,
  'password',
  [
    ApiProperty({ example: 'Password123!', description: 'Contraseña (mínimo 8 caracteres)' }),
    IsString(),
    MinLength(8, { message: 'Contraseña debe tener mínimo 8 caracteres' }),
    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Contraseña debe incluir mayúsculas, minúsculas y números',
    }),
  ],
  String,
);

decorateProperty(
  RegisterDto,
  'fullName',
  [
    ApiProperty({ example: 'Juan Pérez García', description: 'Nombre completo del usuario' }),
    IsString(),
  ],
  String,
);

decorateProperty(
  RegisterDto,
  'cedula',
  [
    ApiProperty({ example: '1234567890', description: 'Cédula de ciudadanía (6-10 dígitos)' }),
    Matches(/^\d{6,10}$/, { message: 'Cédula inválida (debe tener entre 6 y 10 dígitos)' }),
  ],
  String,
);

decorateProperty(
  RegisterDto,
  'phone',
  [
    ApiProperty({ example: '3001234567', description: 'Número de teléfono', required: false }),
    IsOptional(),
    IsString(),
  ],
  String,
);

module.exports = { RegisterDto };
