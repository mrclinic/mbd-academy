import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePricingPlanDto, UpdatePricingPlanDto } from '../dto/pricing.dto';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) { }

  async findAll(query: any) {
    const page = Math.max(1, Number(query.page || 1));
    const perPage = Math.min(100, Number(query.perPage || 10));
    const where: any = {};

    // Filter by search keyword
    if (query.search) {
      where.OR = [
        { nameEn: { contains: query.search, mode: 'insensitive' } },
        { nameAr: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Filter by active status
    if (typeof query.active !== 'undefined') {
      where.active = query.active === 'true';
    } else {
      // Default: only show active pricing plans
      where.active = true;
    }

    const total = await this.prisma.pricingPlan.count({ where });
    const data = await this.prisma.pricingPlan.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    });

    return { total, page, perPage, data };
  }


  async findOne(id: number) {
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException(`Pricing plan with ID ${id} not found`);
    return plan;
  }

  async create(data: CreatePricingPlanDto) {
    return this.prisma.pricingPlan.create({ data });
  }

  async update(id: number, data: UpdatePricingPlanDto) {
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException(`Pricing plan with ID ${id} not found`);
    return this.prisma.pricingPlan.update({ where: { id }, data });
  }

  async remove(id: number) {
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException(`Pricing plan with ID ${id} not found`);
    await this.prisma.pricingPlan.delete({ where: { id } });
    return { message: 'Pricing plan deleted successfully', id };
  }

  async toggleActive(id: number) {
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException(`Pricing plan with ID ${id} not found`);
    const updated = await this.prisma.pricingPlan.update({
      where: { id },
      data: { active: !plan.active },
    });
    return {
      id: updated.id,
      active: updated.active,
      message: 'Pricing plan active status updated successfully',
    };
  }
}