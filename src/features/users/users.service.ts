import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/user.dto';
import { Role} from "@/core/enums";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll(page = 1, limit = 20) {
    return this.repo.findAndCount({
      select: ['id', 'fullName', 'login', 'loginType', 'role', 'isActive', 'isVerified', 'createdAt'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({
      where: { id },
      select: ['id', 'fullName', 'login', 'loginType', 'role', 'profileImage', 'birthDate', 'isActive', 'isVerified', 'createdAt'],
    });
    if (!user) throw new NotFoundException(`Foydalanuvchi #${id} topilmadi`);
    return user;
  }

  async getMe(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    const { password, refreshToken, ...result } = user as any;
    return result;
  }

  async update(id: number, currentUser: User, dto: UpdateUserDto) {
    if (currentUser.id !== id && currentUser.role !== Role.ADMIN && currentUser.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Boshqa foydalanuvchini o\'zgartira olmaysiz');
    }
    await this.findOne(id);
    await this.repo.update(id, {
      ...dto,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
    });
    return this.findOne(id);
  }

  async updateRole(id: number, dto: UpdateUserRoleDto) {
    await this.findOne(id);
    await this.repo.update(id, { role: dto.role });
    return this.findOne(id);
  }

  async deactivate(id: number) {
    await this.findOne(id);
    await this.repo.update(id, { isActive: false });
    return { message: 'Foydalanuvchi deaktivatsiya qilindi' };
  }
}
