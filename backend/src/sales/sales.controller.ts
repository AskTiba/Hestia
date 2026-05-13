import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@Request() req: any, @Body() body: { items: { productId: string; quantity: number }[] }) {
    // req.user is populated by the JwtStrategy
    return this.salesService.createSale(req.user.userId, body.items);
  }

  @Get()
  async findAll() {
    return this.salesService.findAllSales();
  }

  @Get('analytics')
  async getAnalytics() {
    return this.salesService.getAnalytics();
  }
}
