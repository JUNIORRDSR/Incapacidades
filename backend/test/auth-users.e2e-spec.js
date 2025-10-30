require('reflect-metadata');
require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const { Test } = require('@nestjs/testing');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('../src/app.module');
const { PrismaService } = require('../src/prisma/prisma.service');

describe('Auth & Users API (e2e)', () => {
  let app;
  let httpServer;
  let prisma;

  const credentials = {
    email: 'admin.e2e@example.com',
    password: 'AdminPass123',
    fullName: 'Administrador E2E',
    cedula: '123456789',
    phone: '3000000000',
  };

  let accessToken;
  let refreshToken;
  let userId;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await prisma.cleanDatabase();
    await app.close();
  });

  it('registers a new user', async () => {
    const response = await request(httpServer)
      .post('/api/v1/auth/register')
      .send(credentials)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(credentials.email);

    userId = response.body.data.user.id;

    // escalate role to ADMIN for subsequent protected routes
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' },
    });
  });

  it('logs in and returns access and refresh tokens', async () => {
    const response = await request(httpServer)
      .post('/api/v1/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(credentials.email);
    expect(response.body.data.user.role).toBe('ADMIN');
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();

    accessToken = response.body.data.accessToken;
    refreshToken = response.body.data.refreshToken;
  });

  it('returns the authenticated user profile', async () => {
    const response = await request(httpServer)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(credentials.email);
  });

  it('lists users with admin privileges', async () => {
    const response = await request(httpServer)
      .get('/api/v1/users')
      .query({ page: 1, limit: 10 })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.meta.total).toBeGreaterThanOrEqual(1);
  });

  it('updates user information', async () => {
    const updatedPhone = '3011111111';

    const response = await request(httpServer)
      .put(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ phone: updatedPhone })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.phone).toBe(updatedPhone);
  });

  it('refreshes the access token', async () => {
    const response = await request(httpServer)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
  });

  it('performs a soft delete on the user', async () => {
    const response = await request(httpServer)
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Usuario eliminado exitosamente');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user.isActive).toBe(false);
  });
});
