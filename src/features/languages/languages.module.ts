import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LanguagesController} from './languages.controller';
import {LanguagesService} from './languages.service';
import {Language} from './language.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Language])],
    controllers: [LanguagesController],
    providers: [LanguagesService],
    exports: [LanguagesService]
})
export class LanguagesModule {
}
