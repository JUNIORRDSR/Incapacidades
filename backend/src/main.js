const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { AppModule } = require('./app.module');
const { PrismaService } = require('./prisma/prisma.service');
const { ensureDefaultAdmin } = require('./prisma/ensure-admin');

require('dotenv').config();

/**
 * Bootstrap the NestJS application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Sistema de Incapacidades API')
    .setDescription('API REST para gestión digital de incapacidades laborales y pensiones - Barranquilla, Colombia')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer(process.env.SWAGGER_SERVER_URL || '/api/v1')
    .addTag('auth', 'Autenticación y autorización')
    .addTag('users', 'Gestión de usuarios')
    .addTag('documents', 'Gestión de documentos')
    .addTag('storage', 'Almacenamiento de archivos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.init();

  // Ensure default admin exists before serving requests
  const prismaService = app.get(PrismaService);
  await ensureDefaultAdmin(prismaService);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                                ║
  ║   🚀 Sistema de Incapacidades API                             ║
  ║                                                                ║
  ║   📍 Server running on: http://localhost:${port}                  ║
  ║   📚 API Documentation: http://localhost:${port}/api/docs         ║
  ║   🌐 Environment: ${process.env.NODE_ENV || 'development'}                        ║
  ║   🇨🇴 Made in Barranquilla, Colombia                           ║
  ║                                                                ║
  ╚═══════════════════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting application:', error);
  process.exit(1);
});
