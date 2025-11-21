import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { LeadModel } from '../models/dto/lead.model';
import { LeadsRepository } from '../repositories/abstract/leads.repository';
import { LeadEntity, PaginatedLeadEntity } from '../models/entity/lead.entity';

@Injectable()
export class LeadsService {
  constructor(
    private readonly leadsRepository: LeadsRepository,
    @Inject('LEADS_SERVICE') private readonly client: ClientProxy,
  ) { }

  async create(lead: LeadModel): Promise<LeadEntity> {
    const newLead = await this.leadsRepository.create(lead);
    this.client.emit('lead_created', newLead);
    return newLead;
  }

  async list(page: number, limit: number): Promise<PaginatedLeadEntity> {
    return await this.leadsRepository.list(page, limit)
  }

  async delete(emailId: string): Promise<LeadEntity> {
    return await this.leadsRepository.delete(emailId);
  }
}
