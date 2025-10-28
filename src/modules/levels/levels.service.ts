import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLevelDto, UpdateLevelDto } from '../dto/level.dto';

@Injectable()
export class LevelsService {
  constructor(private prisma: PrismaService) { }

  async findAll(query: any) {
    const page = Math.max(1, Number(query.page || 1));
    const perPage = Math.min(100, Number(query.perPage || 10));
    const where: any = {};

    if (query.search)
      where.OR = [
        { nameEn: { contains: query.search, mode: 'insensitive' } },
        { nameAr: { contains: query.search, mode: 'insensitive' } },
        { descriptionEn: { contains: query.search, mode: 'insensitive' } },
        { descriptionAr: { contains: query.search, mode: 'insensitive' } },
      ];

    const total = await this.prisma.level.count({ where });
    const data = await this.prisma.level.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    });

    return { total, page, perPage, data };
  }

  async findOne(id: number) {
    const level = await this.prisma.level.findUnique({ where: { id } });
    if (!level) throw new NotFoundException(`Level with ID ${id} not found`);
    return level;
  }

  async create(data: CreateLevelDto) {
    return this.prisma.level.create({ data });
  }

  async update(id: number, data: UpdateLevelDto) {
    const level = await this.prisma.level.findUnique({ where: { id } });
    if (!level) throw new NotFoundException(`Level with ID ${id} not found`);
    return this.prisma.level.update({ where: { id }, data });
  }

  async remove(id: number) {
    const level = await this.prisma.level.findUnique({ where: { id } });
    if (!level) throw new NotFoundException(`Level with ID ${id} not found`);
    await this.prisma.level.delete({ where: { id } });
    return { message: 'Level deleted successfully', id };
  }
}