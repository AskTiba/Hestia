import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('products')
  @ApiOperation({ summary: 'Create a new product' })
  async createProduct(@Body() body: any) {
    return this.inventoryService.createProduct(body);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products with their locations' })
  async findAllProducts() {
    return this.inventoryService.findAllProducts();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findProductById(id);
  }

  @Post('locations')
  @ApiOperation({ summary: 'Create a new physical location (e.g., Back Wall)' })
  async createLocation(@Body() body: { name: string; description?: string }) {
    return this.inventoryService.createLocation(body.name, body.description);
  }

  @Get('locations')
  @ApiOperation({ summary: 'Get all locations and their shelves' })
  async findAllLocations() {
    return this.inventoryService.findAllLocations();
  }

  @Post('shelves')
  @ApiOperation({ summary: 'Create a shelf within a location' })
  async createShelf(@Body() body: { locationId: string; name: string }) {
    return this.inventoryService.createShelf(body.locationId, body.name);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Assign a product to a specific shelf' })
  async assign(@Body() body: { productId: string; shelfId: string }) {
    return this.inventoryService.assignProductToShelf(body.productId, body.shelfId);
  }
}
