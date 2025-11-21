import { LeadModel } from "../../models/dto/lead.model";
import { LeadEntity, PaginatedLeadEntity } from "../../models/entity/lead.entity";

export abstract class LeadsRepository {
  abstract create(lead: LeadModel): Promise<LeadEntity>;
  abstract list(page: number, limit: number): Promise<PaginatedLeadEntity>;
  abstract delete(emailId: string): Promise<LeadEntity>;
} 
