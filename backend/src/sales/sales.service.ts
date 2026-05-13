import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Process a sale.
   * Senior Pattern: Use a Prisma Transaction to ensure that stock reduction 
   * and sale logging either both succeed or both fail.
   */
  async createSale(userId: string, items: { productId: string; quantity: number }[]) {
    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const saleItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        if (product.currentStock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
        }

        // Calculate item total
        const itemTotal = Number(product.sellingPrice) * item.quantity;
        totalAmount += itemTotal;

        // Prepare sale item record
        saleItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtSale: product.sellingPrice,
        });

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: {
              decrement: item.quantity,
            },
          },
        });

        // Log the stock change
        await tx.stockLog.create({
          data: {
            productId: item.productId,
            userId,
            quantity: -item.quantity,
            reason: 'Sale',
          },
        });
      }

      // Create the main sale record
      return tx.sale.create({
        data: {
          userId,
          totalAmount,
          items: {
            create: saleItemsData,
          },
        },
        include: {
          items: true,
        },
      });
    });
  }

  async getAnalytics() {
    const products = await this.prisma.product.findMany();
    
    // Total Investment: Sum of (Current Stock * Buying Price)
    const totalInvestment = products.reduce((acc, p) => {
      return acc + (p.currentStock * Number(p.buyingPrice));
    }, 0);

    // Get all sales to calculate realized profit
    const sales = await this.prisma.sale.findMany({
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    let totalRevenue = 0;
    let totalCostOfGoodsSold = 0;

    sales.forEach(sale => {
      totalRevenue += Number(sale.totalAmount);
      sale.items.forEach(item => {
        totalCostOfGoodsSold += item.quantity * Number(item.product.buyingPrice);
      });
    });

    const realizedProfit = totalRevenue - totalCostOfGoodsSold;

    return {
      totalInvestment,
      totalRevenue,
      realizedProfit,
      totalProducts: products.length,
    };
  }

  async findAllSales() {
    return this.prisma.sale.findMany({
      include: {
        items: {
          include: { product: true }
        },
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
