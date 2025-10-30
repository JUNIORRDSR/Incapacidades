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
