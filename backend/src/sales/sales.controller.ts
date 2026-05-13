import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Sales & Analytics')
@ApiBearerAuth()
@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Process a new sale (reduces stock)' })
  async create(@Request() req: any, @Body() body: { items: { productId: string; quantity: number }[] }) {
    return this.salesService.createSale(req.user.userId, body.items);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales history' })
  async findAll() {
    return this.salesService.findAllSales();
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get total investment and realized profit' })
  async getAnalytics() {
    return this.salesService.getAnalytics();
  }
}
