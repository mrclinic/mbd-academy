
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from '../dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) { }

  async findAll(query: { page?: number; perPage?: number; search?: string; categoryId?: number; levelId?: number; trainerId?: string; minPrice?: number; maxPrice?: number; published?: boolean }) {
    const page = Math.max(1, query.page || 1);
    const perPage = Math.min(100, query.perPage || 10);
    const where: any = {};
    if (query.search) {
      where.OR = [
        { nameEn: { contains: query.search, mode: 'insensitive' } },
        { nameAr: { contains: query.search, mode: 'insensitive' } },
        { descriptionEn: { contains: query.search, mode: 'insensitive' } },
        { descriptionAr: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.categoryId) where.categoryId = Number(query.categoryId);
    if (query.levelId) where.levelId = query.levelId;
    if (query.trainerId) where.trainerId = query.trainerId;
    if (typeof query.published !== 'undefined') where.published = query.published;
    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = Number(query.minPrice);
      if (query.maxPrice) where.price.lte = Number(query.maxPrice);
    }
    const total = await this.prisma.course.count({ where });
    const data = await this.prisma.course.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: { category: true, trainer: true, level: true },
    });
    return { total, page, perPage, data };
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id }, include: { category: true, trainer: true, level: true } });
    if (!course) throw new NotFoundException(`Course with ID ${id} not found`);
    return course;
  }

  async create(data: any) {
    return this.prisma.course.create({ data });
  }

  async update(id: string, dto: any) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException(`Course with ID ${id} not found`);
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException(`Course with ID ${id} not found`);
    return this.prisma.course.delete({ where: { id } });
  }
}
