import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscoveryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Haversine Formula: Calculates the distance between two GPS coordinates in kilometers.
   * This is a senior-level optimization to avoid expensive database/API calls for simple 
   * distance checks.
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async createPlace(data: { name: string; description?: string; latitude: number; longitude: number; address?: string }) {
    return this.prisma.place.create({
      data: {
        name: data.name,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
      },
    });
  }

  async findNearby(userLat: number, userLng: number, radiusKm: number = 5) {
    const allPlaces = await this.prisma.place.findMany({
      include: {
        activities: { include: { activity: true } },
        crowdReports: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // Filter by distance using Haversine
    return allPlaces
      .map((place) => ({
        ...place,
        distanceKm: this.calculateDistance(
          userLat,
          userLng,
          Number(place.latitude),
          Number(place.longitude),
        ),
      }))
      .filter((place) => place.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async addActivityToPlace(placeId: string, activityName: string) {
    // Ensure activity exists or create it
    const activity = await this.prisma.activity.upsert({
      where: { name: activityName },
      update: {},
      create: { name: activityName },
    });

    return this.prisma.placeActivity.create({
      data: {
        placeId,
        activityId: activity.id,
      },
    });
  }
}
