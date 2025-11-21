import { Module } from '@nestjs/common';
import { LeadsService } from './services/leads.service';
import { PrismaService } from '../../database/prisma.service';

import { LeadsRepo } from './repositories/repo/leads.repository';
import { LeadsRepository } from './repositories/abstract/leads.repository';

import { LeadsController } from './controllers/leads.controller';

import { ClientsModule } from '@nestjs/microservices';
import { getRabbitMQConfig } from '../../config/rabbitmq.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'LEADS_SERVICE',
        ...getRabbitMQConfig(true),
      },
    ]),
  ],
  controllers: [LeadsController],
  providers: [PrismaService, LeadsService, { provide: LeadsRepository, useClass: LeadsRepo }],
  exports: [LeadsService, { provide: LeadsRepository, useClass: LeadsRepo }],
})
export class LeadsModule { }
