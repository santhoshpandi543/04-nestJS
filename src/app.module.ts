import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { CentralizedExceptionFilter } from './common/filters/centralized-exception.filter';
import { OrderModule } from './order/order.module';
import { TracingInterceptor } from './common/interceptors/tracing.interceptor';

type Idialect = 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
    }),
    SequelizeModule.forRoot({
      dialect: (process.env.DB_DIALECT as Idialect) ?? 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: true,
      models: [],
    }),
    OrderModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CentralizedExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TracingInterceptor,
    },
  ],
})
export class AppModule {}