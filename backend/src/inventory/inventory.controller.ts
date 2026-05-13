import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard) // Protect all inventory routes
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('products')
  async createProduct(@Body() body: any) {
    return this.inventoryService.createProduct(body);
  }

  @Get('products')
  async findAllProducts() {
    return this.inventoryService.findAllProducts();
  }

  @Get('products/:id')
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findProductById(id);
  }

  @Post('locations')
  async createLocation(@Body() body: { name: string; description?: string }) {
    return this.inventoryService.createLocation(body.name, body.description);
  }

  @Get('locations')
  async findAllLocations() {
    return this.inventoryService.findAllLocations();
  }

  @Post('shelves')
  async createShelf(@Body() body: { locationId: string; name: string }) {
    return this.inventoryService.createShelf(body.locationId, body.name);
  }

  @Post('assign')
  async assign(@Body() body: { productId: string; shelfId: string }) {
    return this.inventoryService.assignProductToShelf(body.productId, body.shelfId);
  }
}
