import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTrainerDto, UpdateTrainerDto } from '../dto/trainer.dto';

@Injectable()
export class TrainersService {
  constructor(private prisma: PrismaService) { }

  // ---------------------------
  // Get all trainers
  // ---------------------------
  async findAll(query: any) {
    const page = Math.max(1, Number(query.page || 1));
    const perPage = Math.min(100, Number(query.perPage || 10));

    const where: any = {};

    if (query.search) {
      where.OR = [
        { nameEn: { contains: query.search, mode: 'insensitive' } },
        { nameAr: { contains: query.search, mode: 'insensitive' } },
        { bioEn: { contains: query.search, mode: 'insensitive' } },
        { bioAr: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (typeof query.active !== 'undefined') {
      where.active = query.active === 'true';
    }

    const total = await this.prisma.trainer.count({ where });
    const data = await this.prisma.trainer.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      include: { speciality: true, user: true },
      orderBy: { createdAt: 'desc' },
    });

    return { total, page, perPage, data };
  }

  // ---------------------------
  // Get single trainer
  // ---------------------------
  async findOne(id: string) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { id },
      include: { speciality: true, user: true },
    });
    if (!trainer) throw new NotFoundException(`Trainer with ID ${id} not found`);
    return trainer;
  }

  // ---------------------------
  // Create trainer
  // ---------------------------
  async create(data: CreateTrainerDto) {
    return this.prisma.trainer.create({ data });
  }

  // ---------------------------
  // Update trainer
  // ---------------------------
  async update(id: string, dto: UpdateTrainerDto) {
    const trainer = await this.prisma.trainer.findUnique({ where: { id } });
    if (!trainer) throw new NotFoundException(`Trainer with ID ${id} not found`);
    return this.prisma.trainer.update({ where: { id }, data: dto });
  }

  // ---------------------------
  // Delete trainer
  // ---------------------------
  async remove(id: string) {
    const trainer = await this.prisma.trainer.findUnique({ where: { id } });
    if (!trainer) throw new NotFoundException(`Trainer with ID ${id} not found`);
    await this.prisma.trainer.delete({ where: { id } });
    return { message: 'Trainer deleted successfully', id };
  }

  // ---------------------------
  // Update trainer image
  // ---------------------------
  async updateImage(trainerId: string, imageUrl: string) {
    const trainer = await this.prisma.trainer.findUnique({ where: { id: trainerId } });
    if (!trainer) throw new NotFoundException(`Trainer with ID ${trainerId} not found`);
    return this.prisma.trainer.update({ where: { id: trainerId }, data: { imageUrl } });
  }

  // ---------------------------
  // Toggle trainer active status
  // ---------------------------
  async toggleActive(id: string) {
    const trainer = await this.prisma.trainer.findUnique({ where: { id } });
    if (!trainer) throw new NotFoundException(`Trainer with ID ${id} not found`);

    const updated = await this.prisma.trainer.update({
      where: { id },
      data: { active: !trainer.active },
    });

    return {
      id: updated.id,
      active: updated.active,
      message: 'Trainer active status updated successfully',
    };
  }
}