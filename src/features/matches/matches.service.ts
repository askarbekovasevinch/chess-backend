import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { User } from '../users/user.entity';
import { CreateMatchDto, FinishMatchDto } from './dto/match.dto';

@Injectable()
export class MatchesService {
  constructor(@InjectRepository(Match) private repo: Repository<Match>) {}

  async findAll(page = 1, limit = 20, type?: string) {
    const qb = this.repo.createQueryBuilder('m')
      .leftJoinAndSelect('m.firstUser', 'fu')
      .leftJoinAndSelect('m.secondUser', 'su')
      .orderBy('m.playedAt', 'DESC')
      .skip((page - 1) * limit).take(limit);
    if (type) qb.where('m.type = :type', { type });
    const [matches, total] = await qb.getManyAndCount();
    return { matches, total, page, limit };
  }

  async findOne(id: number) {
    const match = await this.repo.findOne({ where: { id }, relations: ['firstUser', 'secondUser'] });
    if (!match) throw new NotFoundException(`O'yin #${id} topilmadi`);
    return match;
  }

  async findByUser(userId: number, page = 1, limit = 20) {
    const [matches, total] = await this.repo.findAndCount({
      where: [{ firstUserId: userId }, { secondUserId: userId }],
      relations: ['firstUser', 'secondUser'],
      order: { playedAt: 'DESC' },
      skip: (page - 1) * limit, take: limit,
    });
    return { matches, total, page, limit };
  }

  async create(user: User, dto: CreateMatchDto) {
    const match = this.repo.create({ firstUserId: user.id, secondUserId: dto.secondUserId, type: dto.type });
    return this.repo.save(match);
  }

  async finish(id: number, user: User, dto: FinishMatchDto) {
    const match = await this.findOne(id);
    if (match.firstUserId !== user.id && match.secondUserId !== user.id) {
      throw new ForbiddenException('Bu o\'yinga tegishli emassiz');
    }
    await this.repo.update(id, dto);
    return this.findOne(id);
  }
}
