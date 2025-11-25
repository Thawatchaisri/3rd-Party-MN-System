

// Enums mirroring database enums
export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  SECURITY = 'SECURITY',
  PROCUREMENT = 'PROCUREMENT',
  VIEWER = 'VIEWER',
  VENDOR = 'VENDOR',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum VendorStatus {
  ONBOARDING = 'ONBOARDING',
  ACTIVE = 'ACTIVE',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  status: VendorStatus;
  contactPerson: string;
  email: string;
  website: string;
  createdAt: string;
  riskScore: number;
  riskLevel: RiskLevel;
  description: string;
  nextAssessmentDate: string; // ISO Date for annual review
}

export interface Contract {
  id: string;
  vendorId: string;
  title: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
  slaLevel: 'GOLD' | 'SILVER' | 'BRONZE';
  documentUrl: string;
}

export interface RiskAssessment {
  id: string;
  vendorId: string;
  date: string;
  auditor: string;
  score: number;
  findings: string;
  status: 'COMPLETED' | 'IN_PROGRESS';
}

export interface AssessmentLog {
  id: string;
  vendorId: string;
  year: number;
  assessedAt: string;
  assessedBy: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  result: string;
}

export interface Incident {
  id: string;
  vendorId: string;
  title: string;
  severity: RiskLevel;
  dateOccurred: string;
  status: 'OPEN' | 'RESOLVED' | 'MITIGATED';
  description: string;
}

export interface DataFlow {
  id: string;
  vendorId: string;
  dataTypes: string[]; // e.g., "PII", "Financial"
  direction: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';
  description: string;
}

export interface RiskCriteria {
  id: string;
  key: string;
  label: string;
  description: string;
  weight: number; // 0-100
  updatedAt: string;
}

export interface ApprovalRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  step: string; // e.g., "Security Review", "Procurement Approval"
  status: ApprovalStatus;
  requesterName: string;
  requestedAt: string;
  details: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  meta?: string;
}
