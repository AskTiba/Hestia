import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Connect to the database when the module initializes.
   * Senior Pattern: Handling the connection lifecycle explicitly ensures the app 
   * doesn't start if the database is unreachable.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnect from the database when the module is destroyed.
   * This prevents connection leaks in professional production environments.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
