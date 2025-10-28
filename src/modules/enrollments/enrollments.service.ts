
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEnrollmentDto } from '../dto/enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) { }

  async enroll(data: CreateEnrollmentDto) {
    // Ensure user and course exist
    const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) throw new NotFoundException('User not found');
    const course = await this.prisma.course.findUnique({ where: { id: data.courseId } });
    if (!course) throw new NotFoundException('Course not found');
    return this.prisma.enrollment.create({ data });
  }

  async findByUser(userId: string, query: any) {
    const page = Math.max(1, Number(query.page || 1));
    const perPage = Math.min(100, Number(query.perPage || 10));
    const where: any = { userId };
    const total = await this.prisma.enrollment.count({ where });
    const data = await this.prisma.enrollment.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      include: { course: true },
      orderBy: { enrolledAt: 'desc' },
    });
    return { total, page, perPage, data };
  }
}
