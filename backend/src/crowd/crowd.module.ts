import { Module } from '@nestjs/common';
import { CrowdService } from './crowd.service';
import { CrowdGateway } from './crowd.gateway';

@Module({
  providers: [CrowdService, CrowdGateway],
  exports: [CrowdService],
})
export class CrowdModule {}
