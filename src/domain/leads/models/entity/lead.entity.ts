export class LeadEntity {
  id: string;
  email: string;
  createdAt: Date;
}

export class PaginatedLeadEntity {
  data: LeadEntity[];
  next: number;
  prev: number;
  total: number;
}
