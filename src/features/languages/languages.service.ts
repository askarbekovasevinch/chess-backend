import {Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Language} from './language.entity';
import {CreateLanguageDto, UpdateLanguageDto} from './dto/language.dto';

@Injectable()
export class LanguagesService {
    constructor(@InjectRepository(Language) private repo: Repository<Language>) {
    }

    findAll() {
        return this.repo.find();
    }

    async findOne(id: number) {
        const item = await this.repo.findOne({where: {id}});
        if (!item) throw new NotFoundException(`Til #${id} topilmadi`);
        return item;
    }

    async create(dto: CreateLanguageDto) {
        const exists = await this.repo.findOne({where: {code: dto.code}});
        if (exists) throw new ConflictException('Bu til kodi allaqachon mavjud');
        return this.repo.save(this.repo.create(dto));
    }

    async update(id: number, dto: UpdateLanguageDto) {
        await this.findOne(id);
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.repo.delete(id);
        return {message: 'O\'chirildi'};
    }
}
