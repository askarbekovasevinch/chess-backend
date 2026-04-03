import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DifficultiesController} from './difficulties.controller';
import {DifficultiesService} from './difficulties.service';
import {Difficulty} from './difficulty.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Difficulty])],
    controllers: [DifficultiesController],
    providers: [DifficultiesService],
    exports: [DifficultiesService]
})
export class DifficultiesModule {
}
