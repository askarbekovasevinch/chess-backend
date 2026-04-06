import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export const typeormConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url: 'postgresql://postgres:1111@localhost:5432/dars209',
    synchronize: true,
    entities: ['dist/**/*.entity.js'],
};