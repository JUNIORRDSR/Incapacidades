const { SetMetadata } = require('@nestjs/common');

const ROLES_KEY = 'roles';
const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);

module.exports = { Roles, ROLES_KEY };
