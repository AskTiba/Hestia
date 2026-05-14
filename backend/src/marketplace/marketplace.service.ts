import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  // --- Task & Escrow Logic ---

  async createTask(ownerId: string, description: string, amount: number) {
    return this.prisma.task.create({
      data: {
        ownerId,
        description,
        amount,
        status: 'PENDING',
      },
    });
  }

  async depositToEscrow(taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    
    // In a real app, this is where Stripe would be called
    return this.prisma.task.update({
      where: { id: taskId },
      data: { status: 'ESCROWED' },
    });
  }

  async assignHelper(taskId: string, helperId: string) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { 
        helperId,
        status: 'ACTIVE'
      },
    });
  }

  async completeTask(taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (task?.status !== 'ACTIVE') {
      throw new BadRequestException('Only active tasks can be completed');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: { status: 'COMPLETED' },
      });

      // Update Helper Stats
      if (updatedTask.helperId) {
        await tx.helperStats.upsert({
          where: { userId: updatedTask.helperId },
          update: { totalJobs: { increment: 1 } },
          create: { userId: updatedTask.helperId, totalJobs: 1 },
        });
      }

      return updatedTask;
    });
  }

  // --- Safety / SOS Logic ---

  async triggerSOS(userId: string, taskId?: string, message?: string) {
    return this.prisma.safetyAlert.create({
      data: {
        userId,
        taskId,
        message: message || 'Emergency SOS triggered',
        severity: 'CRITICAL',
      },
      include: {
        user: { select: { name: true, contactInfo: true } },
        task: { select: { description: true } },
      },
    });
  }

  // --- Discovery ---

  async findAllTasks() {
    return this.prisma.task.findMany({
      include: {
        owner: { select: { name: true } },
        helper: { select: { name: true } },
      },
    });
  }
}
