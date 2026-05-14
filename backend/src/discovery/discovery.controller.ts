import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('[VibeCheck] Discovery')
@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Post('places')
  @ApiOperation({ summary: 'Add a new discovery spot' })
  async create(@Body() body: { name: string; latitude: number; longitude: number; description?: string }) {
    return this.discoveryService.createPlace(body);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find places within a specific radius' })
  @ApiQuery({ name: 'lat', type: Number, example: 0.3476 })
  @ApiQuery({ name: 'lng', type: Number, example: 32.5825 })
  @ApiQuery({ name: 'radius', type: Number, required: false, example: 5 })
  async findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.discoveryService.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 5,
    );
  }

  @Post('activities')
  @ApiOperation({ summary: 'Tag a place with an activity (e.g. Swimming)' })
  async addActivity(@Body() body: { placeId: string; activityName: string }) {
    return this.discoveryService.addActivityToPlace(body.placeId, body.activityName);
  }
}
