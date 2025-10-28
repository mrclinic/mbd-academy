import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from '../dto/article.dto';

@Injectable()
export class ArticlesService {
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
        { contentEn: { contains: query.search, mode: 'insensitive' } },
        { contentAr: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (typeof query.published !== 'undefined') {
      where.published = query.published === 'true';
    }

    const total = await this.prisma.article.count({ where });
    const data = await this.prisma.article.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { publishDate: 'desc' },
      include: { category: true, trainer: true },
    });

    return { total, page, perPage, data };
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { category: true, trainer: true },
    });
    if (!article) throw new NotFoundException(`Article with ID ${id} not found`);
    return article;
  }

  async create(dto: CreateArticleDto) {
    return this.prisma.article.create({ data: dto });
  }

  async update(id: string, dto: UpdateArticleDto) {
    const existing = await this.prisma.article.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Article with ID ${id} not found`);

    return this.prisma.article.update({
      where: { id },
      data: dto,
    });
  }

  async togglePublish(id: string, published: boolean) {
    const existing = await this.prisma.article.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Article with ID ${id} not found`);

    return this.prisma.article.update({
      where: { id },
      data: { published, publishDate: published ? new Date() : null },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.article.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Article with ID ${id} not found`);

    return this.prisma.article.delete({ where: { id } });
  }
}
