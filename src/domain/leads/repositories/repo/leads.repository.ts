import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../../../database/prisma.service";

import { LeadsRepository } from "../abstract/leads.repository";
import { LeadEntity, PaginatedLeadEntity } from "../../models/entity/lead.entity";
import { LeadModel } from "../../models/dto/lead.model";

@Injectable()
export class LeadsRepo implements LeadsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(lead: LeadModel): Promise<LeadEntity> {
    try {
      const newLead = await this.prisma.lead.create({ data: lead });
      return newLead;
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async list(page: number = 0, limit: number = 10): Promise<PaginatedLeadEntity> {
    try {
      if (!page) page = 0;
      if (page < 0) page = 0;
      if (!limit) limit = 10;
      if (limit > 100) limit = 100;

      const data = await this.prisma.lead.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: page * limit,
        take: limit,
      });

      const total = await this.prisma.lead.count();

      const hasNext = (page + 1) * limit < total;
      const next = hasNext ? page + 1 : 0;
      const hasPrev = page > 1;
      const prev = hasPrev ? page - 1 : 0;
      return { data, next, prev, total: data.length }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }

  async delete(emailId: string): Promise<LeadEntity> {
    try {
      const email = await this.prisma.lead.findUnique({
        where: { id: emailId },
      })

      if (!email) throw new NotFoundException();
      return await this.prisma.lead.delete({
        where: { id: emailId },
      })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }
}