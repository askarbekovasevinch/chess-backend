import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Difficulty} from './difficulty.entity';
import {CreateDifficultyDto, UpdateDifficultyDto} from './dto/difficulty.dto';

@Injectable()
export class DifficultiesService {
    constructor(@InjectRepository(Difficulty) private repo: Repository<Difficulty>) {
    }

    findAll() {
        return this.repo.find();
    }

    async findOne(id: number) {
        const item = await this.repo.findOne({where: {id}});
        if (!item) throw new NotFoundException(`Qiyinlik #${id} topilmadi`);
        return item;
    }

    create(dto: CreateDifficultyDto) {
        return this.repo.save(this.repo.create(dto));
    }

    async update(id: number, dto: UpdateDifficultyDto) {
        await this.findOne(id);
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.repo.delete(id);
        return {message: "O'chirildi"};
    }
}
