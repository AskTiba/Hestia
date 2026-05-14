import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('[VibeCheck] Social & Reviews')
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave a review with rating and vibe tags' })
  async create(@Request() req: any, @Body() body: { placeId: string; rating: number; comment?: string; vibeTags?: string[] }) {
    return this.socialService.createReview({
      ...body,
      userId: req.user.userId,
    });
  }

  @Get('places/:placeId/reviews')
  @ApiOperation({ summary: 'Get all reviews for a specific spot' })
  async getReviews(@Param('placeId') placeId: string) {
    return this.socialService.getPlaceReviews(placeId);
  }

  @Get('places/:placeId/rating')
  @ApiOperation({ summary: 'Get the average rating and review count for a spot' })
  async getRating(@Param('placeId') placeId: string) {
    return this.socialService.getPlaceAverageRating(placeId);
  }
}
