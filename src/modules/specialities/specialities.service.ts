import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSpecialityDto, UpdateSpecialityDto } from '../dto/speciality.dto';

@Injectable()
export class SpecialitiesService {
    constructor(private prisma: PrismaService) { }

    async findAll(query?: any) {
        return this.prisma.speciality.findMany({
            orderBy: { id: 'asc' },
        });
    }

    async findOne(id: number) {
        const speciality = await this.prisma.speciality.findUnique({ where: { id } });
        if (!speciality) throw new NotFoundException('Speciality not found');
        return speciality;
    }

    async create(data: CreateSpecialityDto) {
        return this.prisma.speciality.create({ data });
    }

    async update(id: number, data: UpdateSpecialityDto) {
        const plan = await this.prisma.speciality.findUnique({ where: { id } });
        if (!plan) throw new NotFoundException(`Speciality with ID ${id} not found`);
        return this.prisma.speciality.update({ where: { id }, data });
    }

    async remove(id: number) {
        const plan = await this.prisma.speciality.findUnique({ where: { id } });
        if (!plan) throw new NotFoundException(`Speciality with ID ${id} not found`);
        await this.prisma.speciality.delete({ where: { id } });
        return { message: 'Speciality deleted successfully', id };
    }
}
