import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { LocationModule } from './location/location.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Add the Apollo driver
      autoSchemaFile: true, // Automatically generate schema
      path: '/graphql', // Default path for GraphQL endpoint
      playground: true, // Enable GraphQL Playground
    }),
    SharedModule,
    UserModule,
    AuthModule,
    ArticleModule,
    LocationModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
