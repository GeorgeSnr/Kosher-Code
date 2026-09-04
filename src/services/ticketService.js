import { db } from './firebaseService';

// Storage Keys
const TICKETS_KEY = 'kosher_jira_tickets';
const TEAM_KEY = 'kosher_jira_team_members';
const ROLES_KEY = 'kosher_jira_roles';
const SPRINTS_KEY = 'kosher_jira_sprints';
const WORKFLOW_RULES_KEY = 'kosher_jira_workflow_rules';

// ----------------------------------------------------------------------
// 1. DEFAULT PERMISSIONS LIST
// ----------------------------------------------------------------------
export const DEFAULT_PERMISSIONS = [
    { id: 'create_tickets', label: 'Create Tickets', description: 'Can create new stories, bugs, tasks and epics' },
    { id: 'edit_tickets', label: 'Edit Ticket Details', description: 'Can edit summaries, descriptions, points, and tags' },
    { id: 'delete_tickets', label: 'Delete / Archive Tickets', description: 'Can permanently remove or archive issues' },
    { id: 'assign_tickets', label: 'Assign & Reassign', description: 'Can assign tickets to team members' },
    { id: 'transition_status', label: 'Transition Ticket Status', description: 'Can move issues across workflow columns' },
    { id: 'approve_workflows', label: 'Approve Workflows', description: 'Can sign off or request changes on gated issues' },
    { id: 'manage_sprints', label: 'Sprint & Cycle Management', description: 'Can create, start, and close sprint cycles' },
    { id: 'manage_team', label: 'Onboard & Manage Team', description: 'Can add team members and assign roles' },
    { id: 'configure_roles', label: 'Configure Roles & RBAC', description: 'Can modify permission matrices and create custom roles' }
];

// ----------------------------------------------------------------------
// 2. DEFAULT CONFIGURABLE ROLES (RBAC)
// ----------------------------------------------------------------------
export const DEFAULT_ROLES = [
    {
        id: 'role-superadmin',
        name: 'Super Administrator',
        description: 'Complete platform governance, security control, role customization, and executive overrides.',
        department: 'Executive Leadership',
        badgeColor: '#7054F2',
        isSystem: true,
        permissions: [
            'create_tickets',
            'edit_tickets',
            'delete_tickets',
            'assign_tickets',
            'transition_status',
            'approve_workflows',
            'manage_sprints',
            'manage_team',
            'configure_roles'
        ]
    },
    {
        id: 'role-pm',
        name: 'Project Manager (PM)',
        description: 'Sprint planning, ticket triage, milestone roadmaps, workflow approvals, and team capacity.',
        department: 'Product & Delivery',
        badgeColor: '#3B82F6',
        isSystem: true,
        permissions: [
            'create_tickets',
            'edit_tickets',
            'assign_tickets',
            'transition_status',
            'approve_workflows',
            'manage_sprints',
            'manage_team'
        ]
    },
    {
        id: 'role-ba',
        name: 'Business Analyst (BA)',
        description: 'Requirements elicitation, acceptance criteria, client specification, and backlog grooming.',
        department: 'Business Analysis',
        badgeColor: '#EC4899',
        isSystem: true,
        permissions: [
            'create_tickets',
            'edit_tickets',
            'transition_status',
            'manage_sprints'
        ]
    },
    {
        id: 'role-architect',
        name: 'Solution Architect',
        description: 'System design, architecture governance, technical reviews, and engineering change approvals.',
        department: 'Core Infrastructure',
        badgeColor: '#8B5CF6',
        isSystem: true,
        permissions: [
            'create_tickets',
            'edit_tickets',
            'assign_tickets',
            'transition_status',
            'approve_workflows'
        ]
    },
    {
        id: 'role-dev-lead',
        name: 'Lead Developer',
        description: 'Sprint technical delivery, code review oversight, ticket assignment, and architecture.',
        department: 'Engineering',
        badgeColor: '#10B981',
        isSystem: true,
        permissions: [
            'create_tickets',
            'edit_tickets',
            'assign_tickets',
            'transition_status',
            'approve_workflows'
        ]
    },
    {
        id: 'role-dev',
        name: 'Software Developer (Fullstack / Core)',
        description: 'Feature implementation, unit testing, subtask management, and status advancement.',
        department: 'Engineering',
        badgeColor: '#0EA5E9',
        isSystem: true,
        permissions: [
            'create_tickets',
            'edit_tickets',
            'transition_status'
        ]
    },
    {
        id: 'role-qa',
        name: 'QA & Test Engineer',
        description: 'Test planning, bug filing, automated verification, and sign-off on release readiness.',
        department: 'Quality Assurance',
        badgeColor: '#F59E0B',
        isSystem: true,
        permissions: [
            'create_tickets',
            'edit_tickets',
            'transition_status',
            'approve_workflows'
        ]
    },
    {
        id: 'role-devops',
        name: 'DevOps / SRE Engineer',
        description: 'CI/CD pipeline automation, server provisioning, security auditing, and deployment tickets.',
        department: 'Cloud Infrastructure',
        badgeColor: '#6366F1',
        isSystem: true,
        permissions: [
            'create_tickets',
            'edit_tickets',
            'transition_status'
        ]
    }
];

// ----------------------------------------------------------------------
// 3. INITIAL ONBOARDED TEAM MEMBERS
// ----------------------------------------------------------------------
export const DEFAULT_TEAM_MEMBERS = [
    {
        id: 'tm-1',
        name: 'George William Ochole',
        email: 'georgewilliamochole@gmail.com',
        roleId: 'role-superadmin',
        roleTitle: 'Super Administrator & Chief Architect',
        department: 'Executive Leadership',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '+256 700 000 001',
        status: 'Active',
        joinedDate: '2025-01-10'
    },
    {
        id: 'tm-2',
        name: 'Brenda Namagembe',
        email: 'b.namagembe@koshercode.ug',
        roleId: 'role-pm',
        roleTitle: 'Senior Project Manager / Scrum Master',
        department: 'Product & Delivery',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        phone: '+256 701 445 892',
        status: 'Active',
        joinedDate: '2025-03-15'
    },
    {
        id: 'tm-3',
        name: 'Emmanuel Kigozi',
        email: 'e.kigozi@koshercode.ug',
        roleId: 'role-architect',
        roleTitle: 'Lead FinTech Systems Architect',
        department: 'Core Infrastructure',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '+256 752 901 334',
        status: 'Active',
        joinedDate: '2025-02-01'
    },
    {
        id: 'tm-4',
        name: 'Samuel Mukasa',
        email: 's.mukasa@koshercode.ug',
        roleId: 'role-dev',
        roleTitle: 'Senior Fullstack Developer (React & Node)',
        department: 'Engineering',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        phone: '+256 773 112 567',
        status: 'Active',
        joinedDate: '2025-04-12'
    },
    {
        id: 'tm-5',
        name: 'Christine Nabukeera',
        email: 'c.nabukeera@koshercode.ug',
        roleId: 'role-ba',
        roleTitle: 'Lead Business Analyst (SACCO & Banking)',
        department: 'Business Analysis',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        phone: '+256 784 329 881',
        status: 'Active',
        joinedDate: '2025-05-18'
    },
    {
        id: 'tm-6',
        name: 'Derrick Ochieng',
        email: 'd.ochieng@koshercode.ug',
        roleId: 'role-devops',
        roleTitle: 'DevOps & Site Reliability Engineer',
        department: 'Cloud Infrastructure',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        phone: '+256 702 884 100',
        status: 'Active',
        joinedDate: '2025-06-01'
    },
    {
        id: 'tm-7',
        name: 'Patricia Akello',
        email: 'p.akello@koshercode.ug',
        roleId: 'role-qa',
        roleTitle: 'Lead QA Automation Specialist',
        department: 'Quality Assurance',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
        phone: '+256 756 441 209',
        status: 'Active',
        joinedDate: '2025-06-20'
    },
    {
        id: 'tm-8',
        name: 'Joshua Musoke',
        email: 'j.musoke@koshercode.ug',
        roleId: 'role-dev',
        roleTitle: 'Mobile FinTech Engineer (Android & iOS)',
        department: 'Engineering',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        phone: '+256 779 812 345',
        status: 'Active',
        joinedDate: '2025-07-04'
    }
];

// ----------------------------------------------------------------------
// 4. SPRINTS DATA
// ----------------------------------------------------------------------
export const DEFAULT_SPRINTS = [
    {
        id: 'sprint-1',
        name: 'Sprint 1 - FinTech Switch & SACCO Q3',
        goal: 'Deploy ISO 8583 banking switch router, stabilize MTN/Airtel float reconciliation, and resolve EFRIS crypto validation.',
        status: 'active', // 'active' | 'future' | 'closed'
        startDate: '2026-09-01',
        endDate: '2026-09-18'
    },
    {
        id: 'sprint-2',
        name: 'Sprint 2 - Agency Banking POS & Cloud Sharding',
        goal: 'Roll out Android biometric POS terminal app and partition high-throughput PostgreSQL tenant databases.',
        status: 'future',
        startDate: '2026-09-19',
        endDate: '2026-10-06'
    }
];

// ----------------------------------------------------------------------
// 5. APPROVAL WORKFLOW RULES
// ----------------------------------------------------------------------
export const DEFAULT_WORKFLOW_RULES = {
    requireApprovalForChangeRequests: true,
    requireApprovalForEpics: true,
    requireApprovalForProductionDone: true,
    allowedApproverRoles: ['role-superadmin', 'role-pm', 'role-architect'],
    strictWorkflowGating: true // if true, status cannot move to In Progress or Done without approval
};

// ----------------------------------------------------------------------
// 6. DEFAULT JIRA TICKETS
// ----------------------------------------------------------------------
export const DEFAULT_TICKETS = [
    {
        id: 't-101',
        key: 'KC-101',
        title: 'ISO 8583 Banking Switch & Interswitch Gateway Adapter',
        type: 'Epic',
        status: 'In Progress',
        priority: 'Highest',
        storyPoints: 13,
        sprintId: 'sprint-1',
        assigneeId: 'tm-3', // Emmanuel Kigozi
        reporterId: 'tm-1', // George William Ochole
        dueDate: '2026-09-15',
        labels: ['CoreBanking', 'ISO8583', 'Switch', 'Security'],
        description: 'Develop high-throughput ISO 8583 message switch router to bridge commercial bank core switches with SACCO microfinance API gateways with automated packing and unpacking of primary bitmapped elements.',
        subtasks: [
            { id: 'st-1', title: 'Parse Bitmap field 1-128 binary payloads', completed: true },
            { id: 'st-2', title: 'Implement HSM MAC encryption verification', completed: true },
            { id: 'st-3', title: 'Automated network heartbeat message 0800 handler', completed: false }
        ],
        approvalWorkflow: {
            required: true,
            status: 'Approved',
            approverRoleId: 'role-superadmin',
            approverRoleName: 'Super Administrator',
            approvedBy: 'George William Ochole',
            approvedAt: '2026-09-02T10:30:00Z',
            approvalNotes: 'Architecture specifications verified and approved for implementation.'
        },
        comments: [
            {
                id: 'cm-1',
                authorName: 'George William Ochole',
                authorRole: 'Super Administrator',
                text: 'High-priority epic for our Q3 bank integration milestone. Ensure zero socket connection leaks.',
                timestamp: '2026-09-02T10:32:00Z'
            },
            {
                id: 'cm-2',
                authorName: 'Emmanuel Kigozi',
                authorRole: 'Solution Architect',
                text: 'Initial socket benchmark completed. Processing 4,200 messages/sec with P99 latency under 24ms.',
                timestamp: '2026-09-03T14:15:00Z'
            }
        ],
        activity: [
            { id: 'act-1', action: 'Created ticket', user: 'George William Ochole', timestamp: '2026-09-01T08:00:00Z' },
            { id: 'act-2', action: 'Approved workflow', user: 'George William Ochole', timestamp: '2026-09-02T10:30:00Z' },
            { id: 'act-3', action: 'Moved to In Progress', user: 'Emmanuel Kigozi', timestamp: '2026-09-02T11:00:00Z' }
        ],
        createdAt: '2026-09-01T08:00:00Z',
        updatedAt: '2026-09-03T14:15:00Z'
    },
    {
        id: 't-102',
        key: 'KC-102',
        title: 'Automated MTN MoMo & Airtel Money Float Reconciliation Engine',
        type: 'Story',
        status: 'In Review',
        priority: 'High',
        storyPoints: 8,
        sprintId: 'sprint-1',
        assigneeId: 'tm-4', // Samuel Mukasa
        reporterId: 'tm-5', // Christine Nabukeera
        dueDate: '2026-09-12',
        labels: ['MobileMoney', 'Reconciliation', 'FinTech'],
        description: 'Automate cross-network float synchronization between telecommunication APIs and internal SACCO ledgers to eliminate manual bank reconciliation delays and alert operators on discrepancies.',
        subtasks: [
            { id: 'st-4', title: 'Webhook ingestion pipeline with HMAC signature check', completed: true },
            { id: 'st-5', title: 'End-of-day telecom statement delta generator', completed: true },
            { id: 'st-6', title: 'Automated alert trigger for float mismatch > 50,000 UGX', completed: false }
        ],
        approvalWorkflow: {
            required: true,
            status: 'Pending',
            approverRoleId: 'role-pm',
            approverRoleName: 'Project Manager (PM)',
            approvedBy: '',
            approvedAt: null,
            approvalNotes: ''
        },
        comments: [
            {
                id: 'cm-3',
                authorName: 'Christine Nabukeera',
                authorRole: 'Business Analyst',
                text: 'All 3 major SACCO client compliance teams require daily CSV reconciliation exports before 6:00 AM.',
                timestamp: '2026-09-02T11:20:00Z'
            }
        ],
        activity: [
            { id: 'act-4', action: 'Created story', user: 'Christine Nabukeera', timestamp: '2026-09-01T09:15:00Z' },
            { id: 'act-5', action: 'Moved to In Review', user: 'Samuel Mukasa', timestamp: '2026-09-04T12:00:00Z' }
        ],
        createdAt: '2026-09-01T09:15:00Z',
        updatedAt: '2026-09-04T12:00:00Z'
    },
    {
        id: 't-103',
        key: 'KC-103',
        title: 'URA EFRIS Cryptographic Signature Validation on Bulk Invoices',
        type: 'Bug',
        status: 'In Progress',
        priority: 'Highest',
        storyPoints: 5,
        sprintId: 'sprint-1',
        assigneeId: 'tm-4', // Samuel Mukasa
        reporterId: 'tm-7', // Patricia Akello
        dueDate: '2026-09-08',
        labels: ['URA', 'EFRIS', 'Bug', 'Urgent'],
        description: 'Bulk invoicing batches greater than 50 invoices intermittently fail EFRIS validation with code 4001 Invalid Signature due to OpenSSL RSA key padding discrepancy under high concurrency.',
        subtasks: [
            { id: 'st-7', title: 'Inspect OpenSSL PKCS#1 v1.5 padding buffer lock', completed: true },
            { id: 'st-8', title: 'Test with URA sandbox API v2 test suite', completed: false }
        ],
        approvalWorkflow: {
            required: false,
            status: 'None',
            approverRoleId: '',
            approverRoleName: '',
            approvedBy: '',
            approvedAt: null,
            approvalNotes: ''
        },
        comments: [
            {
                id: 'cm-4',
                authorName: 'Patricia Akello',
                authorRole: 'QA Specialist',
                text: 'Reproduction script attached to ticket. Failure reproduces on 3 out of 10 batch runs.',
                timestamp: '2026-09-02T16:40:00Z'
            }
        ],
        activity: [
            { id: 'act-6', action: 'Filed bug', user: 'Patricia Akello', timestamp: '2026-09-02T16:00:00Z' },
            { id: 'act-7', action: 'Assigned to Samuel Mukasa', user: 'Brenda Namagembe', timestamp: '2026-09-03T08:30:00Z' }
        ],
        createdAt: '2026-09-02T16:00:00Z',
        updatedAt: '2026-09-03T08:30:00Z'
    },
    {
        id: 't-104',
        key: 'KC-104',
        title: 'SACCO Member Self-Service Mobile Loan Application UI',
        type: 'Story',
        status: 'To Do',
        priority: 'Medium',
        storyPoints: 5,
        sprintId: 'sprint-1',
        assigneeId: 'tm-8', // Joshua Musoke
        reporterId: 'tm-5', // Christine Nabukeera
        dueDate: '2026-09-20',
        labels: ['Mobile', 'UX', 'Loans', 'SACCO'],
        description: 'Allow SACCO members to apply for emergency microloans directly from the mobile app with real-time guarantor SMS approval requests and automated eligibility scoring.',
        subtasks: [
            { id: 'st-9', title: 'Design loan calculator with reducing balance amortization', completed: false },
            { id: 'st-10', title: 'Guarantor SMS consent request workflow', completed: false }
        ],
        approvalWorkflow: {
            required: false,
            status: 'None',
            approverRoleId: '',
            approverRoleName: '',
            approvedBy: '',
            approvedAt: null,
            approvalNotes: ''
        },
        comments: [],
        activity: [
            { id: 'act-8', action: 'Created story', user: 'Christine Nabukeera', timestamp: '2026-09-02T14:10:00Z' }
        ],
        createdAt: '2026-09-02T14:10:00Z',
        updatedAt: '2026-09-02T14:10:00Z'
    },
    {
        id: 't-105',
        key: 'KC-105',
        title: 'Multi-Tenant Cloud DB Index Partitioning & Sharding Strategy',
        type: 'Task',
        status: 'Backlog',
        priority: 'High',
        storyPoints: 8,
        sprintId: 'sprint-2',
        assigneeId: 'tm-6', // Derrick Ochieng
        reporterId: 'tm-3', // Emmanuel Kigozi
        dueDate: '2026-09-30',
        labels: ['Database', 'DevOps', 'Performance', 'Cloud'],
        description: 'Implement PostgreSQL composite partitioning by tenant_id to isolate high-volume transaction queries and optimize query performance across 100+ SACCO tenant nodes.',
        subtasks: [],
        approvalWorkflow: {
            required: true,
            status: 'Approved',
            approverRoleId: 'role-architect',
            approverRoleName: 'Solution Architect',
            approvedBy: 'Emmanuel Kigozi',
            approvedAt: '2026-09-03T09:00:00Z',
            approvalNotes: 'Partitioning plan verified. Zero schema migration downtime required.'
        },
        comments: [],
        activity: [
            { id: 'act-9', action: 'Created task in backlog', user: 'Emmanuel Kigozi', timestamp: '2026-09-03T08:50:00Z' }
        ],
        createdAt: '2026-09-03T08:50:00Z',
        updatedAt: '2026-09-03T09:00:00Z'
    },
    {
        id: 't-106',
        key: 'KC-106',
        title: 'Automated UMRA Regulatory Compliance Statutory Report Export',
        type: 'Change Request',
        status: 'Awaiting Approval',
        priority: 'High',
        storyPoints: 3,
        sprintId: 'sprint-1',
        assigneeId: 'tm-5', // Christine Nabukeera
        reporterId: 'tm-2', // Brenda Namagembe
        dueDate: '2026-09-14',
        labels: ['Compliance', 'Reports', 'UMRA', 'Audit'],
        description: 'Client requested addition of quarterly Uganda Microfinance Regulatory Authority (UMRA) statutory liquidity and PAR (Portfolio At Risk) export templates.',
        subtasks: [
            { id: 'st-11', title: 'Compile statutory liquidity ratio formula in compliance with UMRA 2026 guidelines', completed: true },
            { id: 'st-12', title: 'Excel XML & PDF export generator', completed: false }
        ],
        approvalWorkflow: {
            required: true,
            status: 'Pending',
            approverRoleId: 'role-pm',
            approverRoleName: 'Project Manager (PM)',
            approvedBy: '',
            approvedAt: null,
            approvalNotes: ''
        },
        comments: [
            {
                id: 'cm-5',
                authorName: 'Brenda Namagembe',
                authorRole: 'Project Manager',
                text: 'Awaiting final signoff on data schema before approving for active sprint development.',
                timestamp: '2026-09-03T17:00:00Z'
            }
        ],
        activity: [
            { id: 'act-10', action: 'Created Change Request', user: 'Brenda Namagembe', timestamp: '2026-09-03T16:45:00Z' }
        ],
        createdAt: '2026-09-03T16:45:00Z',
        updatedAt: '2026-09-03T17:00:00Z'
    },
    {
        id: 't-107',
        key: 'KC-107',
        title: 'Biometric Fingerprint POS Terminal SDK Integration for Agency Banking',
        type: 'Story',
        status: 'Done',
        priority: 'Medium',
        storyPoints: 5,
        sprintId: 'sprint-1',
        assigneeId: 'tm-8', // Joshua Musoke
        reporterId: 'tm-1', // George William Ochole
        dueDate: '2026-09-02',
        labels: ['Biometric', 'AgencyBanking', 'POS'],
        description: 'Integrate PAX A920 Android terminal biometric fingerprint scanner SDK for rural agency cash withdrawal & deposit authorization.',
        subtasks: [
            { id: 'st-13', title: 'PAX A920 SDK integration', completed: true },
            { id: 'st-14', title: 'ISO 19794-2 biometric template extraction', completed: true }
        ],
        approvalWorkflow: {
            required: true,
            status: 'Approved',
            approverRoleId: 'role-superadmin',
            approverRoleName: 'Super Administrator',
            approvedBy: 'George William Ochole',
            approvedAt: '2026-09-02T15:00:00Z',
            approvalNotes: 'Tested on Android PAX POS hardware. Fingerprint match latency < 350ms.'
        },
        comments: [
            {
                id: 'cm-6',
                authorName: 'Joshua Musoke',
                authorRole: 'Mobile Developer',
                text: 'Field test passed with 100 sample fingerprints. Ready for production branch merge.',
                timestamp: '2026-09-02T14:50:00Z'
            }
        ],
        activity: [
            { id: 'act-11', action: 'Completed story and marked Done', user: 'Joshua Musoke', timestamp: '2026-09-02T15:10:00Z' }
        ],
        createdAt: '2026-08-28T09:00:00Z',
        updatedAt: '2026-09-02T15:10:00Z'
    },
    {
        id: 't-108',
        key: 'KC-108',
        title: 'End-to-End Penetration Test & OWASP Top 10 Security Audit',
        type: 'Task',
        status: 'In Review',
        priority: 'Highest',
        storyPoints: 5,
        sprintId: 'sprint-1',
        assigneeId: 'tm-7', // Patricia Akello
        reporterId: 'tm-3', // Emmanuel Kigozi
        dueDate: '2026-09-10',
        labels: ['Security', 'OWASP', 'QA', 'Audit'],
        description: 'Perform rigorous vulnerability scanning, API rate limit testing, JWT token expiry verification, and CSRF audits prior to client portal deployment.',
        subtasks: [
            { id: 'st-15', title: 'Inspect JWT session token expiry & CSRF protections', completed: true },
            { id: 'st-16', title: 'Verify SQL injection sanitization on dynamic filters', completed: true },
            { id: 'st-17', title: 'Rate limiting benchmark on authentication endpoints', completed: false }
        ],
        approvalWorkflow: {
            required: false,
            status: 'None',
            approverRoleId: '',
            approverRoleName: '',
            approvedBy: '',
            approvedAt: null,
            approvalNotes: ''
        },
        comments: [],
        activity: [
            { id: 'act-12', action: 'Moved to In Review', user: 'Patricia Akello', timestamp: '2026-09-04T10:00:00Z' }
        ],
        createdAt: '2026-09-01T11:00:00Z',
        updatedAt: '2026-09-04T10:00:00Z'
    }
];

// ----------------------------------------------------------------------
// 7. ROLES MANAGEMENT FUNCTIONS (RBAC)
// ----------------------------------------------------------------------

export const getStoredRoles = () => {
    try {
        const stored = localStorage.getItem(ROLES_KEY);
        if (!stored) return DEFAULT_ROLES;
        const parsed = JSON.parse(stored);
        return parsed && parsed.length > 0 ? parsed : DEFAULT_ROLES;
    } catch (e) {
        return DEFAULT_ROLES;
    }
};

export const saveStoredRole = (roleData) => {
    const roles = getStoredRoles();
    const newRole = {
        id: 'role-' + Date.now(),
        badgeColor: roleData.badgeColor || '#7054F2',
        isSystem: false,
        permissions: roleData.permissions || ['create_tickets', 'edit_tickets', 'transition_status'],
        ...roleData
    };
    const updated = [...roles, newRole];
    try {
        localStorage.setItem(ROLES_KEY, JSON.stringify(updated));
    } catch (e) {}

    // Cloud sync
    if (db) {
        db.collection('jira_roles').doc(newRole.id).set(newRole).catch(() => {});
    }
    return newRole;
};

export const updateRolePermissions = (roleId, permissions) => {
    const roles = getStoredRoles();
    const updated = roles.map(r => {
        if (r.id === roleId) {
            return { ...r, permissions };
        }
        return r;
    });
    try {
        localStorage.setItem(ROLES_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        db.collection('jira_roles').doc(roleId).set({ permissions }, { merge: true }).catch(() => {});
    }
    return updated;
};

export const deleteStoredRole = (roleId) => {
    const roles = getStoredRoles();
    const updated = roles.filter(r => r.id !== roleId && !r.isSystem);
    try {
        localStorage.setItem(ROLES_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        db.collection('jira_roles').doc(roleId).delete().catch(() => {});
    }
    return updated;
};

export const resetDefaultRoles = () => {
    try {
        localStorage.setItem(ROLES_KEY, JSON.stringify(DEFAULT_ROLES));
    } catch (e) {}
    return DEFAULT_ROLES;
};

// ----------------------------------------------------------------------
// 8. TEAM MEMBERS MANAGEMENT FUNCTIONS
// ----------------------------------------------------------------------

export const getStoredTeamMembers = () => {
    try {
        const stored = localStorage.getItem(TEAM_KEY);
        if (!stored) return DEFAULT_TEAM_MEMBERS;
        const parsed = JSON.parse(stored);
        return parsed && parsed.length > 0 ? parsed : DEFAULT_TEAM_MEMBERS;
    } catch (e) {
        return DEFAULT_TEAM_MEMBERS;
    }
};

export const saveTeamMember = (memberData) => {
    const members = getStoredTeamMembers();
    const roles = getStoredRoles();
    const matchedRole = roles.find(r => r.id === memberData.roleId);

    const newMember = {
        id: 'tm-' + Date.now(),
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: memberData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(memberData.name)}&background=7054F2&color=fff`,
        roleTitle: matchedRole ? matchedRole.name : 'Team Member',
        ...memberData
    };
    const updated = [newMember, ...members];
    try {
        localStorage.setItem(TEAM_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        db.collection('jira_team').doc(newMember.id).set(newMember).catch(() => {});
    }
    return newMember;
};

export const updateTeamMember = (memberId, updates) => {
    const members = getStoredTeamMembers();
    const roles = getStoredRoles();
    const updated = members.map(m => {
        if (m.id === memberId) {
            const next = { ...m, ...updates };
            if (updates.roleId) {
                const matchedRole = roles.find(r => r.id === updates.roleId);
                if (matchedRole) next.roleTitle = matchedRole.name;
            }
            return next;
        }
        return m;
    });
    try {
        localStorage.setItem(TEAM_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        db.collection('jira_team').doc(memberId).set(updates, { merge: true }).catch(() => {});
    }
    return updated;
};

export const deleteTeamMember = (memberId) => {
    const members = getStoredTeamMembers();
    const updated = members.filter(m => m.id !== memberId);
    try {
        localStorage.setItem(TEAM_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        db.collection('jira_team').doc(memberId).delete().catch(() => {});
    }
    return updated;
};

export const checkUserPermission = (userEmailOrRole, permissionKey) => {
    const roles = getStoredRoles();
    const members = getStoredTeamMembers();

    // If super admin email
    if (userEmailOrRole === 'georgewilliamochole@gmail.com') return true;

    // Check if user is a member
    const member = members.find(m => m.email?.toLowerCase() === userEmailOrRole?.toLowerCase() || m.id === userEmailOrRole);
    const roleId = member ? member.roleId : userEmailOrRole;

    const role = roles.find(r => r.id === roleId);
    if (!role) return false;
    if (role.id === 'role-superadmin') return true;
    return role.permissions?.includes(permissionKey) || false;
};

// ----------------------------------------------------------------------
// 9. SPRINTS MANAGEMENT
// ----------------------------------------------------------------------

export const getStoredSprints = () => {
    try {
        const stored = localStorage.getItem(SPRINTS_KEY);
        if (!stored) return DEFAULT_SPRINTS;
        const parsed = JSON.parse(stored);
        return parsed && parsed.length > 0 ? parsed : DEFAULT_SPRINTS;
    } catch (e) {
        return DEFAULT_SPRINTS;
    }
};

export const saveSprint = (sprintData) => {
    const sprints = getStoredSprints();
    const newSprint = {
        id: 'sprint-' + Date.now(),
        status: sprintData.status || 'future',
        ...sprintData
    };
    const updated = [...sprints, newSprint];
    try {
        localStorage.setItem(SPRINTS_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        db.collection('jira_sprints').doc(newSprint.id).set(newSprint).catch(() => {});
    }
    return newSprint;
};

export const updateSprint = (sprintId, updates) => {
    const sprints = getStoredSprints();
    const updated = sprints.map(s => s.id === sprintId ? { ...s, ...updates } : s);
    try {
        localStorage.setItem(SPRINTS_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        db.collection('jira_sprints').doc(sprintId).set(updates, { merge: true }).catch(() => {});
    }
    return updated;
};

// ----------------------------------------------------------------------
// 10. WORKFLOW RULES MANAGEMENT
// ----------------------------------------------------------------------

export const getWorkflowRules = () => {
    try {
        const stored = localStorage.getItem(WORKFLOW_RULES_KEY);
        if (!stored) return DEFAULT_WORKFLOW_RULES;
        return JSON.parse(stored);
    } catch (e) {
        return DEFAULT_WORKFLOW_RULES;
    }
};

export const saveWorkflowRules = (rules) => {
    try {
        localStorage.setItem(WORKFLOW_RULES_KEY, JSON.stringify(rules));
    } catch (e) {}

    if (db) {
        db.collection('jira_settings').doc('workflow_rules').set(rules).catch(() => {});
    }
    return rules;
};

// ----------------------------------------------------------------------
// 11. TICKETS CRUD & LIFECYCLE MANAGEMENT
// ----------------------------------------------------------------------

export const getStoredTickets = () => {
    try {
        const stored = localStorage.getItem(TICKETS_KEY);
        if (!stored) return DEFAULT_TICKETS;
        const parsed = JSON.parse(stored);
        return parsed && parsed.length > 0 ? parsed : DEFAULT_TICKETS;
    } catch (e) {
        return DEFAULT_TICKETS;
    }
};

const getNextTicketKey = (tickets) => {
    let maxNum = 100;
    tickets.forEach(t => {
        if (t.key && t.key.startsWith('KC-')) {
            const num = parseInt(t.key.replace('KC-', ''), 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        }
    });
    return `KC-${maxNum + 1}`;
};

export const createTicket = (ticketData, currentUser = null) => {
    const tickets = getStoredTickets();
    const nextKey = getNextTicketKey(tickets);
    const authorName = currentUser?.name || 'Administrator';

    const newTicket = {
        id: 't-' + Date.now(),
        key: nextKey,
        status: ticketData.status || 'To Do',
        priority: ticketData.priority || 'Medium',
        storyPoints: ticketData.storyPoints || 3,
        sprintId: ticketData.sprintId || 'sprint-1',
        labels: ticketData.labels || ['General'],
        subtasks: ticketData.subtasks || [],
        comments: [],
        activity: [
            {
                id: 'act-' + Date.now(),
                action: 'Created ticket ' + nextKey,
                user: authorName,
                timestamp: new Date().toISOString()
            }
        ],
        approvalWorkflow: ticketData.approvalWorkflow || {
            required: ticketData.type === 'Change Request' || ticketData.type === 'Epic',
            status: (ticketData.type === 'Change Request' || ticketData.type === 'Epic') ? 'Pending' : 'None',
            approverRoleId: 'role-pm',
            approverRoleName: 'Project Manager (PM)',
            approvedBy: '',
            approvedAt: null,
            approvalNotes: ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...ticketData
    };

    const updated = [newTicket, ...tickets];
    try {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        db.collection('jira_tickets').doc(newTicket.id).set(newTicket).catch(() => {});
    }
    return newTicket;
};

export const updateTicket = (ticketId, updates, currentUser = null) => {
    const tickets = getStoredTickets();
    const userName = currentUser?.name || 'Administrator';

    const updated = tickets.map(t => {
        if (t.id === ticketId) {
            const updatedTicket = {
                ...t,
                ...updates,
                updatedAt: new Date().toISOString()
            };

            // Log activity
            const changedFields = Object.keys(updates).filter(k => k !== 'comments' && k !== 'activity');
            if (changedFields.length > 0) {
                const activityEntry = {
                    id: 'act-' + Date.now(),
                    action: `Updated ${changedFields.join(', ')}`,
                    user: userName,
                    timestamp: new Date().toISOString()
                };
                updatedTicket.activity = [activityEntry, ...(t.activity || [])];
            }

            return updatedTicket;
        }
        return t;
    });

    try {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        db.collection('jira_tickets').doc(ticketId).set(updates, { merge: true }).catch(() => {});
    }
    return updated;
};

export const deleteTicket = (ticketId) => {
    const tickets = getStoredTickets();
    const updated = tickets.filter(t => t.id !== ticketId);
    try {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        db.collection('jira_tickets').doc(ticketId).delete().catch(() => {});
    }
    return updated;
};

export const transitionTicketStatus = (ticketId, newStatus, currentUser = null) => {
    const tickets = getStoredTickets();
    const rules = getWorkflowRules();
    const target = tickets.find(t => t.id === ticketId);

    if (!target) return { success: false, message: 'Ticket not found' };

    // Approval gate check: If ticket requires approval and is not approved, check if rules strictly forbid moving to In Progress or Done
    if (rules.strictWorkflowGating && target.approvalWorkflow?.required && target.approvalWorkflow.status !== 'Approved') {
        if (newStatus === 'In Progress' || newStatus === 'Done') {
            return {
                success: false,
                requiresApproval: true,
                message: `Action Blocked: Ticket ${target.key} requires approval sign-off by an authorized approver before moving to "${newStatus}".`
            };
        }
    }

    const userName = currentUser?.name || 'Administrator';
    const activityEntry = {
        id: 'act-' + Date.now(),
        action: `Moved from "${target.status}" to "${newStatus}"`,
        user: userName,
        timestamp: new Date().toISOString()
    };

    const updated = tickets.map(t => {
        if (t.id === ticketId) {
            return {
                ...t,
                status: newStatus,
                activity: [activityEntry, ...(t.activity || [])],
                updatedAt: new Date().toISOString()
            };
        }
        return t;
    });

    try {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        db.collection('jira_tickets').doc(ticketId).set({
            status: newStatus,
            updatedAt: new Date().toISOString()
        }, { merge: true }).catch(() => {});
    }

    return { success: true, tickets: updated };
};

export const processTicketApproval = (ticketId, decision, notes = '', currentUser = null) => {
    // decision: 'Approved' | 'Changes Requested'
    const tickets = getStoredTickets();
    const userName = currentUser?.name || 'Administrator';

    const updated = tickets.map(t => {
        if (t.id === ticketId) {
            const approvalWorkflow = {
                ...(t.approvalWorkflow || {}),
                status: decision,
                approvedBy: userName,
                approvedAt: new Date().toISOString(),
                approvalNotes: notes
            };

            const activityEntry = {
                id: 'act-' + Date.now(),
                action: `${decision === 'Approved' ? 'Approved workflow' : 'Requested changes on workflow'} (${notes || 'No comments'})`,
                user: userName,
                timestamp: new Date().toISOString()
            };

            // If changes requested and currently in progress, move back to Awaiting Approval
            let status = t.status;
            if (decision === 'Changes Requested' && (status === 'In Progress' || status === 'Done')) {
                status = 'Awaiting Approval';
            } else if (decision === 'Approved' && status === 'Awaiting Approval') {
                status = 'To Do';
            }

            return {
                ...t,
                status,
                approvalWorkflow,
                activity: [activityEntry, ...(t.activity || [])],
                updatedAt: new Date().toISOString()
            };
        }
        return t;
    });

    try {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        const approvedTicket = updated.find(t => t.id === ticketId);
        if (approvedTicket) {
            db.collection('jira_tickets').doc(ticketId).set({
                approvalWorkflow: approvedTicket.approvalWorkflow,
                status: approvedTicket.status,
                updatedAt: approvedTicket.updatedAt
            }, { merge: true }).catch(() => {});
        }
    }

    return updated;
};

export const addTicketComment = (ticketId, text, currentUser = null) => {
    if (!text || !text.trim()) return null;
    const tickets = getStoredTickets();
    const authorName = currentUser?.name || 'Administrator';
    const authorRole = currentUser?.role === 'admin' ? 'Administrator' : (currentUser?.role || 'Team Member');

    const newComment = {
        id: 'cm-' + Date.now(),
        authorName,
        authorRole,
        text: text.trim(),
        timestamp: new Date().toISOString()
    };

    const updated = tickets.map(t => {
        if (t.id === ticketId) {
            return {
                ...t,
                comments: [...(t.comments || []), newComment],
                updatedAt: new Date().toISOString()
            };
        }
        return t;
    });

    try {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        const tgt = updated.find(t => t.id === ticketId);
        if (tgt) {
            db.collection('jira_tickets').doc(ticketId).set({
                comments: tgt.comments,
                updatedAt: tgt.updatedAt
            }, { merge: true }).catch(() => {});
        }
    }

    return { updated, newComment };
};

export const toggleSubtask = (ticketId, subtaskId, currentUser = null) => {
    const tickets = getStoredTickets();
    const updated = tickets.map(t => {
        if (t.id === ticketId) {
            const subtasks = (t.subtasks || []).map(st => {
                if (st.id === subtaskId) {
                    return { ...st, completed: !st.completed };
                }
                return st;
            });
            return {
                ...t,
                subtasks,
                updatedAt: new Date().toISOString()
            };
        }
        return t;
    });

    try {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        const tgt = updated.find(t => t.id === ticketId);
        if (tgt) {
            db.collection('jira_tickets').doc(ticketId).set({
                subtasks: tgt.subtasks,
                updatedAt: tgt.updatedAt
            }, { merge: true }).catch(() => {});
        }
    }

    return updated;
};

export const addSubtask = (ticketId, title) => {
    if (!title || !title.trim()) return null;
    const tickets = getStoredTickets();
    const newSubtask = {
        id: 'st-' + Date.now(),
        title: title.trim(),
        completed: false
    };

    const updated = tickets.map(t => {
        if (t.id === ticketId) {
            return {
                ...t,
                subtasks: [...(t.subtasks || []), newSubtask],
                updatedAt: new Date().toISOString()
            };
        }
        return t;
    });

    try {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        const tgt = updated.find(t => t.id === ticketId);
        if (tgt) {
            db.collection('jira_tickets').doc(ticketId).set({
                subtasks: tgt.subtasks,
                updatedAt: tgt.updatedAt
            }, { merge: true }).catch(() => {});
        }
    }

    return { updated, newSubtask };
};

export const deleteSubtask = (ticketId, subtaskId) => {
    const tickets = getStoredTickets();
    const updated = tickets.map(t => {
        if (t.id === ticketId) {
            return {
                ...t,
                subtasks: (t.subtasks || []).filter(st => st.id !== subtaskId),
                updatedAt: new Date().toISOString()
            };
        }
        return t;
    });

    try {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (db) {
        const tgt = updated.find(t => t.id === ticketId);
        if (tgt) {
            db.collection('jira_tickets').doc(ticketId).set({
                subtasks: tgt.subtasks,
                updatedAt: tgt.updatedAt
            }, { merge: true }).catch(() => {});
        }
    }

    return updated;
};

// ----------------------------------------------------------------------
// 12. REAL-TIME SUBSCRIPTION HOOKS FOR JIRA DATA
// ----------------------------------------------------------------------

export const subscribeToTickets = (onUpdate, onError) => {
    if (!db) return () => {};
    try {
        return db.collection('jira_tickets').onSnapshot(
            snapshot => {
                if (snapshot && !snapshot.empty) {
                    const cloudTickets = [];
                    snapshot.forEach(doc => {
                        cloudTickets.push({ id: doc.id, ...doc.data() });
                    });
                    try {
                        localStorage.setItem(TICKETS_KEY, JSON.stringify(cloudTickets));
                    } catch (e) {}
                    if (typeof onUpdate === 'function') onUpdate(cloudTickets);
                }
            },
            err => {
                if (typeof onError === 'function') onError(err);
            }
        );
    } catch (e) {
        return () => {};
    }
};

export const subscribeToTeamMembers = (onUpdate, onError) => {
    if (!db) return () => {};
    try {
        return db.collection('jira_team').onSnapshot(
            snapshot => {
                if (snapshot && !snapshot.empty) {
                    const cloudTeam = [];
                    snapshot.forEach(doc => {
                        cloudTeam.push({ id: doc.id, ...doc.data() });
                    });
                    try {
                        localStorage.setItem(TEAM_KEY, JSON.stringify(cloudTeam));
                    } catch (e) {}
                    if (typeof onUpdate === 'function') onUpdate(cloudTeam);
                }
            },
            err => {
                if (typeof onError === 'function') onError(err);
            }
        );
    } catch (e) {
        return () => {};
    }
};
