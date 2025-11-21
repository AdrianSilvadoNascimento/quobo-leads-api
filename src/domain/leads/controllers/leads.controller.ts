import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { LeadsService } from '../services/leads.service';

import { LeadEntity, PaginatedLeadEntity } from '../models/entity/lead.entity';
import { LeadModel } from '../models/dto/lead.model';
import { AdminGuard } from '../security/admin.guard';

const MIN_TTL = 60000

@Controller('leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) { }

  @Post()
  @Throttle({ default: { limit: 3, ttl: MIN_TTL } })
  async create(@Body() lead: LeadModel): Promise<LeadEntity> {
    return this.service.create(lead);
  }

  @Get()
  @Throttle({ default: { limit: 10, ttl: MIN_TTL } })
  async list(@Query('page') page: string, @Query('limit') limit: string): Promise<PaginatedLeadEntity> {
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    return this.service.list(parsedPage, parsedLimit);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') emailId: string): Promise<LeadEntity> {
    return this.service.delete(emailId);
  }
}
