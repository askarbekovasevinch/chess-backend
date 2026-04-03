import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  findAll(page = 1, limit = 20, onlyPending = false) {
    const qb = this.repo.createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'user')
      .orderBy('r.createdAt', 'DESC')
      .skip((page - 1) * limit).take(limit);
    if (onlyPending) qb.where('r.isReviewed = false');
    return qb.getManyAndCount();
  }

  async findOne(id: number) {
    const report = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!report) throw new NotFoundException(`Shikoyat #${id} topilmadi`);
    return report;
  }

  create(userId: number, dto: CreateReportDto) {
    return this.repo.save(this.repo.create({ ...dto, userId }));
  }

  async markReviewed(id: number) {
    await this.findOne(id);
    await this.repo.update(id, { isReviewed: true });
    return { message: 'Shikoyat ko\'rib chiqildi deb belgilandi' };
  }
}
