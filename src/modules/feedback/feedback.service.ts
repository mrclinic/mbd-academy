import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from '../dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateFeedbackDto) {
    return this.prisma.feedback.create({ data });
  }

  async findByCourse(courseId: string, query: any) {
    const page = Math.max(1, Number(query.page || 1));
    const perPage = Math.min(100, Number(query.perPage || 10));
    const where: any = { courseId };

    const total = await this.prisma.feedback.count({ where });
    const data = await this.prisma.feedback.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    });

    return { total, page, perPage, data };
  }

  async findOne(id: number) {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new NotFoundException(`Feedback with ID ${id} not found`);
    return feedback;
  }

  async update(id: number, data: UpdateFeedbackDto) {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new NotFoundException(`Feedback with ID ${id} not found`);

    return this.prisma.feedback.update({ where: { id }, data });
  }

  async remove(id: number) {
    const feedback = await this.prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new NotFoundException(`Feedback with ID ${id} not found`);

    await this.prisma.feedback.delete({ where: { id } });
    return { message: 'Feedback deleted successfully', id };
  }
  async findByUser(userId: string, query: any) {
    const page = Math.max(1, Number(query.page || 1));
    const perPage = Math.min(100, Number(query.perPage || 10));
    const where: any = { userId };

    const total = await this.prisma.feedback.count({ where });
    const data = await this.prisma.feedback.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    });

    return { total, page, perPage, data };
  }
}