import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CrowdService } from './crowd.service';
import { VibeStatus } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all for dev
  },
})
export class CrowdGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly crowdService: CrowdService) {}

  @SubscribeMessage('report_status')
  async handleReportStatus(
    @MessageBody() data: { userId: string; placeId: string; status: VibeStatus },
    @ConnectedSocket() client: Socket,
  ) {
    // 1. Save to Database
    const report = await this.crowdService.reportStatus(data.userId, data.placeId, data.status);

    // 2. Broadcast to ALL connected clients
    // Senior Pattern: Real-time broadcast ensures "Live" feel without refreshing
    this.server.emit('status_updated', {
      placeId: data.placeId,
      status: data.status,
      timestamp: report.createdAt,
      placeName: report.place.name,
    });

    return { event: 'report_received', data: report.id };
  }
}
