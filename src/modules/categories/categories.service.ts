import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async findAll(query: any) {
    const page = Math.max(1, Number(query.page || 1));
    const perPage = Math.min(100, Number(query.perPage || 10));

    const where: any = {};
    if (query.search) {
      where.OR = [
        { nameEn: { contains: query.search, mode: 'insensitive' } },
        { nameAr: { contains: query.search, mode: 'insensitive' } },
        { descriptionEn: { contains: query.search, mode: 'insensitive' } },
        { descriptionAr: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.category.count({ where });
    const data = await this.prisma.category.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    });

    return { total, page, perPage, data };
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const exists = await this.prisma.category.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Category with ID ${id} not found`);

    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const exists = await this.prisma.category.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Category with ID ${id} not found`);

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully', id };
  }
}