import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
    CreateFrequentQuestionDto,
    UpdateFrequentQuestionDto,
} from '../dto/frequent-question.dto';

@Injectable()
export class FrequentQuestionsService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: any) {
        const page = Math.max(1, Number(query.page || 1));
        const perPage = Math.min(100, Number(query.perPage || 10));
        const where: any = {};

        if (query.search)
            where.OR = [
                { titleEn: { contains: query.search, mode: 'insensitive' } },
                { titleAr: { contains: query.search, mode: 'insensitive' } },
                { answerEn: { contains: query.search, mode: 'insensitive' } },
                { answerAr: { contains: query.search, mode: 'insensitive' } },
            ];

        const total = await this.prisma.frequentQuestion.count({ where });
        const data = await this.prisma.frequentQuestion.findMany({
            where,
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { createdAt: 'desc' },
        });

        return { total, page, perPage, data };
    }

    async findOne(id: number) {
        const item = await this.prisma.frequentQuestion.findUnique({
            where: { id },
        });

        if (!item)
            throw new NotFoundException(`Frequent question with ID ${id} not found`);

        return item;
    }

    async create(data: CreateFrequentQuestionDto) {
        return this.prisma.frequentQuestion.create({ data });
    }

    async update(id: number, data: UpdateFrequentQuestionDto) {
        const item = await this.prisma.frequentQuestion.findUnique({
            where: { id },
        });

        if (!item)
            throw new NotFoundException(`Frequent question with ID ${id} not found`);

        return this.prisma.frequentQuestion.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        const item = await this.prisma.frequentQuestion.findUnique({
            where: { id },
        });

        if (!item)
            throw new NotFoundException(`Frequent question with ID ${id} not found`);

        await this.prisma.frequentQuestion.delete({ where: { id } });

        return { message: 'Frequent Question deleted successfully', id };
    }
}
