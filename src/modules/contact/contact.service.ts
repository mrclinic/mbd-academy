import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactMessageDto } from '../dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateContactMessageDto) {
    return this.prisma.contactMessage.create({ data });
  }

  async findAll(query: any) {
    const page = Math.max(1, Number(query.page || 1));
    const perPage = Math.min(100, Number(query.perPage || 10));

    const total = await this.prisma.contactMessage.count();
    const data = await this.prisma.contactMessage.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    });

    return { total, page, perPage, data };
  }

  async findOne(id: number) {
    const message = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!message) throw new NotFoundException(`Contact message with ID ${id} not found`);
    return message;
  }

  async remove(id: number) {
    const exists = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Contact message with ID ${id} not found`);

    await this.prisma.contactMessage.delete({ where: { id } });
    return { message: 'Contact message deleted successfully', id };
  }

  async markRead(id: number, read: boolean) {
    const message = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!message) throw new NotFoundException(`Contact message with ID ${id} not found`);

    const updated = await this.prisma.contactMessage.update({
      where: { id },
      data: { read },
    });

    return { message: 'Contact message status updated', data: updated };
  }
}
