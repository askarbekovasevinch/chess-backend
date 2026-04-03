import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {APP_GUARD, APP_FILTER} from '@nestjs/core';


import {JwtAuthGuard} from './features/common/guards/jwt-auth.guard';
import {RolesGuard} from './features/common/guards/roles.guard';
import {AllExceptionsFilter} from './features/common/filters/http-exception.filter';

import {AuthModule} from './features/authentication/authentication.module';
import {UsersModule} from './features/users/users.module';
import {LanguagesModule} from './features/languages/languages.module';
import {AuthorsModule} from './features/authors/authors.module';
import {DifficultiesModule} from './features/difficulties/difficulties.module';
import {CoursesModule} from './features/courses/courses.module';
import {BooksModule} from './features/books/books.module';
import {MatchesModule} from './features/matches/matches.module';
import {ReportsModule} from './features/reports/reports.module';
import {TempModule} from "@/features/temp/temp.module";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DB_HOST', 'localhost'),
                port: config.get<number>('DB_PORT', 5432),
                username: config.get('DB_USERNAME', 'postgres'),
                password: config.get('DB_PASSWORD', '1111'),
                database: config.get('DB_NAME', 'dars209'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: config.get('NODE_ENV') !== 'production',
                logging: config.get('NODE_ENV') === 'development',
            }),
            inject: [ConfigService],
        }),

        AuthModule,
        UsersModule,
        LanguagesModule,
        AuthorsModule,
        DifficultiesModule,
        CoursesModule,
        BooksModule,
        MatchesModule,
        ReportsModule,
        TempModule,
    ],
    providers: [
        {provide: APP_GUARD, useClass: JwtAuthGuard},
        {provide: APP_GUARD, useClass: RolesGuard},
        {provide: APP_FILTER, useClass: AllExceptionsFilter},
    ],
})
export class AppModule {
}
