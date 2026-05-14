import { Controller, Post, Get, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('[EliteAid] Marketplace & Safety')
@Controller('marketplace')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('tasks')
  @ApiOperation({ summary: 'Create a new household task' })
  async create(@Request() req: any, @Body() body: { description: string; amount: number }) {
    return this.marketplaceService.createTask(req.user.userId, body.description, body.amount);
  }

  @Patch('tasks/:id/escrow')
  @ApiOperation({ summary: 'Deposit funds to escrow (Simulated)' })
  async escrow(@Param('id') id: string) {
    return this.marketplaceService.depositToEscrow(id);
  }

  @Patch('tasks/:id/assign')
  @ApiOperation({ summary: 'Assign a helper to a task' })
  async assign(@Param('id') id: string, @Body() body: { helperId: string }) {
    return this.marketplaceService.assignHelper(id, body.helperId);
  }

  @Patch('tasks/:id/complete')
  @ApiOperation({ summary: 'Mark task as complete and update helper stats' })
  async complete(@Param('id') id: string) {
    return this.marketplaceService.completeTask(id);
  }

  @Post('sos')
  @ApiOperation({ summary: 'Trigger a safety SOS alert' })
  async sos(@Request() req: any, @Body() body: { taskId?: string; message?: string }) {
    return this.marketplaceService.triggerSOS(req.user.userId, body.taskId, body.message);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all marketplace tasks' })
  async findAll() {
    return this.marketplaceService.findAllTasks();
  }
}
