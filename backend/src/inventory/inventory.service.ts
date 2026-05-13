import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // --- Product Management ---

  async createProduct(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  async findAllProducts() {
    return this.prisma.product.findMany({
      include: {
        locations: {
          include: {
            shelf: {
              include: { location: true }
            }
          }
        }
      }
    });
  }

  async findProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        locations: {
          include: {
            shelf: {
              include: { location: true }
            }
          }
        }
      }
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // --- Location (Wall) Management ---

  async createLocation(name: string, description?: string) {
    return this.prisma.location.create({
      data: { name, description }
    });
  }

  async findAllLocations() {
    return this.prisma.location.findMany({
      include: { shelves: true }
    });
  }

  // --- Shelf Management ---

  async createShelf(locationId: string, name: string) {
    return this.prisma.shelf.create({
      data: {
        name,
        locationId
      }
    });
  }

  // --- Mapping (Assign Product to Shelf) ---

  async assignProductToShelf(productId: string, shelfId: string) {
    return this.prisma.productLocation.upsert({
      where: {
        productId_shelfId: { productId, shelfId }
      },
      update: {},
      create: { productId, shelfId }
    });
  }
}
