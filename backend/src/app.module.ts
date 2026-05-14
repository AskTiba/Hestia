import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { CrowdModule } from './crowd/crowd.module';
import { SocialModule } from './social/social.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    InventoryModule,
    SalesModule,
    DiscoveryModule,
    CrowdModule,
    SocialModule,
    MarketplaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
