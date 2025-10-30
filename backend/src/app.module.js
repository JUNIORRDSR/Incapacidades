const { Module } = require('@nestjs/common');
const { ConfigModule } = require('@nestjs/config');
const { MongooseModule } = require('@nestjs/mongoose');
const { PrismaModule } = require('./prisma/prisma.module');
const { AuthModule } = require('./auth/auth.module');
const { UsersModule } = require('./users/users.module');
const { DocumentsModule } = require('./documents/documents.module');
const { StorageModule } = require('./storage/storage.module');
const { decorateClass } = require('./common/utils/apply-decorators');

/**
 * Root Application Module
 * @class AppModule
 */
class AppModule {}

decorateClass(
  AppModule,
  [
    Module({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/incapacidades', {
          connectionFactory: (connection) => {
            console.log('✅ MongoDB connected successfully');
            return connection;
          },
        }),
        PrismaModule,
        AuthModule,
        UsersModule,
        DocumentsModule,
        StorageModule,
      ],
    }),
  ],
);

module.exports = { AppModule };
