import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async createReview(data: {
    placeId: string;
    userId: string;
    rating: number;
    comment?: string;
    vibeTags?: string[];
  }) {
    return this.prisma.review.create({
      data: {
        placeId: data.placeId,
        userId: data.userId,
        rating: data.rating,
        comment: data.comment,
        vibeTags: data.vibeTags as any, // Prisma handles JSON conversion
      },
      include: {
        user: { select: { name: true } },
        place: { select: { name: true } },
      },
    });
  }

  async getPlaceReviews(placeId: string) {
    return this.prisma.review.findMany({
      where: { placeId },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPlaceAverageRating(placeId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { placeId },
      _avg: { rating: true },
      _count: { id: true },
    });

    return {
      averageRating: aggregate._avg.rating || 0,
      totalReviews: aggregate._count.id,
    };
  }
}
