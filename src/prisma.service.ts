
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService {
  private prisma: PrismaClient;
  user: any;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Returns an instance of the PrismaClient.
   * @returns PrismaClient
   */
  public getPrismaClient(): PrismaClient {
    return this.prisma;
  }
}
