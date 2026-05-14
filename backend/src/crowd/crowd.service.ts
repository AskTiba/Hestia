import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VibeStatus } from '@prisma/client';

@Injectable()
export class CrowdService {
  constructor(private prisma: PrismaService) {}

  async reportStatus(userId: string, placeId: string, status: VibeStatus) {
    return this.prisma.crowdReport.create({
      data: {
        userId,
        placeId,
        status,
      },
      include: {
        place: { select: { name: true } },
        user: { select: { name: true } },
      },
    });
  }

  async getLatestStatus(placeId: string) {
    return this.prisma.crowdReport.findFirst({
      where: { placeId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
