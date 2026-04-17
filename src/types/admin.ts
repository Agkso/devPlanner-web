export interface AuditLogUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLog {
  _id: string;
  user: AuditLogUser;
  action: string;
  details: Record<string, unknown>;
  resource: string;
  resourceId: string;
  createdAt: string;
  updatedAt: string;
}
