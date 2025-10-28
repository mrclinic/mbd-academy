// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();

    /* // Correctly type the event
    this.$on('beforeExit', async () => {
      console.log('Prisma beforeExit event triggered');
      await this.$disconnect();
    }); */
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}