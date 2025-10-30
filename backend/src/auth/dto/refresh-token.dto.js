const { IsString, IsNotEmpty } = require('class-validator');
const { ApiProperty } = require('@nestjs/swagger');
const { decorateProperty } = require('../../common/utils/apply-decorators');

/**
 * Refresh Token DTO
 * @class RefreshTokenDto
 */
class RefreshTokenDto {
  refreshToken;
}

decorateProperty(
  RefreshTokenDto,
  'refreshToken',
  [ApiProperty({ description: 'Refresh token JWT' }), IsString(), IsNotEmpty()],
  String,
);

module.exports = { RefreshTokenDto };
