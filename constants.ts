

import { Vendor, VendorStatus, RiskLevel, Contract, Incident, DataFlow, RiskCriteria, ApprovalRequest, AuditLog, ApprovalStatus, UserRole, AssessmentLog, User } from './types';

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Acme Cloud Services',
    category: 'Cloud Infrastructure',
    status: VendorStatus.ACTIVE,
    contactPerson: 'Alice Smith',
    email: 'alice@acme.com',
    website: 'https://acme.com',
    createdAt: '2023-01-15',
    riskScore: 85,
    riskLevel: RiskLevel.LOW,
    description: 'Primary cloud hosting provider for core services.',
    nextAssessmentDate: '2024-01-15', // OK
  },
  {
    id: 'v2',
    name: 'SecurePay Global',
    category: 'Payment Gateway',
    status: VendorStatus.UNDER_REVIEW,
    contactPerson: 'Bob Jones',
    email: 'bob@securepay.com',
    website: 'https://securepay.com',
    createdAt: '2023-03-10',
    riskScore: 45,
    riskLevel: RiskLevel.HIGH,
    description: 'Payment processing partner. Recent compliance audit pending.',
    nextAssessmentDate: '2023-11-01', // Due soon (relative to "now" in mock context)
  },
  {
    id: 'v3',
    name: 'Logistics Pro',
    category: 'Supply Chain',
    status: VendorStatus.ACTIVE,
    contactPerson: 'Charlie Day',
    email: 'charlie@logisticspro.com',
    website: 'https://logisticspro.com',
    createdAt: '2022-11-05',
    riskScore: 72,
    riskLevel: RiskLevel.MEDIUM,
    description: 'Third-party logistics and shipping handler.',
    nextAssessmentDate: '2023-10-28', // Very close
  },
  {
    id: 'v4',
    name: 'HR Solutions Inc',
    category: 'HR SaaS',
    status: VendorStatus.ONBOARDING,
    contactPerson: 'Dana White',
    email: 'dana@hrsolutions.com',
    website: 'https://hrsolutions.com',
    createdAt: '2023-10-01',
    riskScore: 60,
    riskLevel: RiskLevel.MEDIUM,
    description: 'Employee management system integration.',
    nextAssessmentDate: '2024-10-01',
  },
  {
    id: 'v5',
    name: 'Legacy Systems Ltd',
    category: 'IT Support',
    status: VendorStatus.SUSPENDED,
    contactPerson: 'Frank Oldman',
    email: 'frank@legacy.com',
    website: 'https://legacy.com',
    createdAt: '2020-05-20',
    riskScore: 20,
    riskLevel: RiskLevel.CRITICAL,
    description: 'Maintenance for legacy on-premise servers. Security breach reported.',
    nextAssessmentDate: '2023-05-20', // Overdue
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  { id: 'c1', vendorId: 'v1', title: 'Master Service Agreement 2024', startDate: '2024-01-01', endDate: '2025-01-01', value: 120000, status: 'ACTIVE', slaLevel: 'GOLD', documentUrl: '#' },
  { id: 'c2', vendorId: 'v2', title: 'Payment Processing Addendum', startDate: '2023-06-01', endDate: '2024-06-01', value: 50000, status: 'ACTIVE', slaLevel: 'SILVER', documentUrl: '#' },
  { id: 'c3', vendorId: 'v3', title: 'Logistics SLA', startDate: '2022-11-01', endDate: '2023-11-01', value: 35000, status: 'ACTIVE', slaLevel: 'BRONZE', documentUrl: '#' }, // Expiring soon
];

export const MOCK_ASSESSMENT_LOGS: AssessmentLog[] = [
  { id: 'as1', vendorId: 'v1', year: 2022, assessedAt: '2022-12-15', assessedBy: 'John Doe', score: 90, grade: 'A', result: 'Passed' },
  { id: 'as2', vendorId: 'v3', year: 2022, assessedAt: '2022-11-10', assessedBy: 'Jane Smith', score: 75, grade: 'B', result: 'Passed with minor findings' },
  { id: 'as3', vendorId: 'v5', year: 2022, assessedAt: '2022-05-20', assessedBy: 'Admin', score: 40, grade: 'F', result: 'Failed - Remediation required' },
];

export const MOCK_INCIDENTS: Incident[] = [
  { id: 'i1', vendorId: 'v2', title: 'Late Settlement Report', severity: RiskLevel.LOW, dateOccurred: '2023-11-15', status: 'RESOLVED', description: 'Vendor delayed settlement report by 24 hours due to system maintenance.' },
  { id: 'i2', vendorId: 'v5', title: 'Unpatched Vulnerability Detected', severity: RiskLevel.CRITICAL, dateOccurred: '2023-12-01', status: 'OPEN', description: 'Critical CVE-2023-XXXX found in provided software appliance.' },
];

export const MOCK_DATA_FLOWS: DataFlow[] = [
  { id: 'd1', vendorId: 'v1', dataTypes: ['Customer PII', 'System Logs'], direction: 'OUTBOUND', description: 'Syncing user data for backup purposes.' },
  { id: 'd2', vendorId: 'v2', dataTypes: ['Credit Card Tokens', 'Transaction Metadata'], direction: 'BIDIRECTIONAL', description: 'Payment processing handshake.' },
];

export const MOCK_RISK_CRITERIA: RiskCriteria[] = [
  { id: 'rc1', key: 'security_cert', label: 'Security Certifications', description: 'ISO27001, SOC2, etc.', weight: 30, updatedAt: '2023-12-01' },
  { id: 'rc2', key: 'data_privacy', label: 'Data Privacy Compliance', description: 'GDPR, PDPA adherence.', weight: 25, updatedAt: '2023-12-01' },
  { id: 'rc3', key: 'financial_health', label: 'Financial Health', description: 'Credit score and bankruptcy risk.', weight: 20, updatedAt: '2023-12-01' },
  { id: 'rc4', key: 'operational_resilience', label: 'Operational Resilience', description: 'BCP/DR availability.', weight: 15, updatedAt: '2023-12-01' },
  { id: 'rc5', key: 'legal_compliance', label: 'Legal & Regulatory', description: 'Lawsuits and regulatory fines.', weight: 10, updatedAt: '2023-12-01' },
];

export const MOCK_APPROVALS: ApprovalRequest[] = [
  { id: 'a1', vendorId: 'v4', vendorName: 'HR Solutions Inc', step: 'Security Review', status: ApprovalStatus.PENDING, requesterName: 'John Doe', requestedAt: '2023-10-02', details: 'Initial security assessment pending.' },
  { id: 'a2', vendorId: 'v2', vendorName: 'SecurePay Global', step: 'Renewal Approval', status: ApprovalStatus.PENDING, requesterName: 'Jane Smith', requestedAt: '2023-10-05', details: 'Contract renewal for 2024.' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'al1', userId: 'u1', userName: 'Admin User', userRole: UserRole.ADMIN, action: 'UPDATE', resourceType: 'VENDOR', resourceId: 'v1', timestamp: '2023-10-25 10:30:00', meta: 'Updated contact email' },
  { id: 'al2', userId: 'u2', userName: 'Security Officer', userRole: UserRole.SECURITY, action: 'VIEW', resourceType: 'DATA_FLOW', resourceId: 'd2', timestamp: '2023-10-25 11:15:00', meta: 'Accessed sensitive PII mapping' },
  { id: 'al3', userId: 'u1', userName: 'Admin User', userRole: UserRole.ADMIN, action: 'CREATE', resourceType: 'CONTRACT', resourceId: 'c1', timestamp: '2023-10-24 09:00:00', meta: 'Uploaded MSA_2024.pdf' },
  { id: 'al4', userId: 'u3', userName: 'System', userRole: UserRole.SUPERADMIN, action: 'AUTO_SCORE', resourceType: 'RISK_SCORE', resourceId: 'v5', timestamp: '2023-10-23 14:00:00', meta: 'Downgraded to CRITICAL due to incident' },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@vendorguard.com', role: UserRole.SUPERADMIN, avatarUrl: '' },
  { id: 'u2', name: 'Sarah Security', email: 'security@vendorguard.com', role: UserRole.SECURITY, avatarUrl: '' },
  { id: 'u3', name: 'Paul Procurement', email: 'procurement@vendorguard.com', role: UserRole.PROCUREMENT, avatarUrl: '' },
  { id: 'u4', name: 'Viewer Account', email: 'viewer@vendorguard.com', role: UserRole.VIEWER, avatarUrl: '' },
];