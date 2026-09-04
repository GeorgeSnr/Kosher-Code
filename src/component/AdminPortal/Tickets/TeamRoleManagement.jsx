import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserPlus, 
    faUsers, 
    faUserShield, 
    faShieldAlt, 
    faCheckCircle, 
    faTimesCircle, 
    faKey, 
    faEdit, 
    faTrashAlt, 
    faSave, 
    faUndo, 
    faTasks, 
    faFilter, 
    faSearch,
    faCheck,
    faCogs,
    faLock,
    faUserCheck
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import { 
    getStoredTeamMembers, 
    saveTeamMember, 
    updateTeamMember, 
    deleteTeamMember,
    getStoredRoles,
    saveStoredRole,
    updateRolePermissions,
    deleteStoredRole,
    resetDefaultRoles,
    DEFAULT_PERMISSIONS,
    getWorkflowRules,
    saveWorkflowRules,
    getStoredTickets
} from '../../../services/ticketService';

const TeamRoleManagement = () => {
    // Data states
    const [teamMembers, setTeamMembers] = useState(() => getStoredTeamMembers());
    const [roles, setRoles] = useState(() => getStoredRoles());
    const [tickets, setTickets] = useState(() => getStoredTickets());
    const [workflowRules, setWorkflowRules] = useState(() => getWorkflowRules());

    // Navigation Tab
    const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'matrix' | 'workflows'

    // Search and filter in directory
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('All');

    // Onboard Member Modal state
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [memberName, setMemberName] = useState('');
    const [memberEmail, setMemberEmail] = useState('');
    const [memberRoleId, setMemberRoleId] = useState('role-dev');
    const [memberDept, setMemberDept] = useState('Engineering');
    const [memberPhone, setMemberPhone] = useState('');
    const [memberAvatar, setMemberAvatar] = useState('');

    // Custom Role Modal state
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDesc, setNewRoleDesc] = useState('');
    const [newRoleDept, setNewRoleDept] = useState('Engineering');
    const [newRoleColor, setNewRoleColor] = useState('#7054F2');
    const [newRolePerms, setNewRolePerms] = useState(['create_tickets', 'edit_tickets', 'transition_status']);

    const reloadData = () => {
        setTeamMembers(getStoredTeamMembers());
        setRoles(getStoredRoles());
        setTickets(getStoredTickets());
        setWorkflowRules(getWorkflowRules());
    };

    useEffect(() => {
        reloadData();
    }, []);

    // ----------------------------------------------------
    // MEMBER ONBOARDING HANDLERS
    // ----------------------------------------------------
    const openOnboardModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            setMemberName(member.name);
            setMemberEmail(member.email);
            setMemberRoleId(member.roleId);
            setMemberDept(member.department);
            setMemberPhone(member.phone || '');
            setMemberAvatar(member.avatar || '');
        } else {
            setEditingMember(null);
            setMemberName('');
            setMemberEmail('');
            setMemberRoleId(roles[0]?.id || 'role-dev');
            setMemberDept('Engineering');
            setMemberPhone('');
            setMemberAvatar('');
        }
        setShowOnboardModal(true);
    };

    const handleSaveMember = (e) => {
        e.preventDefault();
        if (!memberName.trim() || !memberEmail.trim()) {
            toast.error('Please enter name and email');
            return;
        }

        const roleObj = roles.find(r => r.id === memberRoleId);

        if (editingMember) {
            updateTeamMember(editingMember.id, {
                name: memberName.trim(),
                email: memberEmail.toLowerCase().trim(),
                roleId: memberRoleId,
                roleTitle: roleObj?.name || 'Member',
                department: memberDept,
                phone: memberPhone.trim(),
                avatar: memberAvatar.trim() || editingMember.avatar
            });
            toast.success(`Updated ${memberName}`);
        } else {
            saveTeamMember({
                name: memberName.trim(),
                email: memberEmail.toLowerCase().trim(),
                roleId: memberRoleId,
                roleTitle: roleObj?.name || 'Member',
                department: memberDept,
                phone: memberPhone.trim(),
                avatar: memberAvatar.trim()
            });
            toast.success(`Onboarded ${memberName} to the team!`);
        }

        setShowOnboardModal(false);
        reloadData();
    };

    const handleDeleteMember = (member) => {
        swal({
            title: `Remove ${member.name}?`,
            text: `Are you sure you want to offboard ${member.name} (${member.roleTitle})?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                deleteTeamMember(member.id);
                reloadData();
                toast.success('Member removed');
            }
        });
    };

    const handleToggleMemberStatus = (member) => {
        const nextStatus = member.status === 'Active' ? 'Inactive' : 'Active';
        updateTeamMember(member.id, { status: nextStatus });
        reloadData();
        toast.success(`${member.name} marked as ${nextStatus}`);
    };

    // ----------------------------------------------------
    // RBAC PERMISSION MATRIX HANDLERS
    // ----------------------------------------------------
    const handleTogglePermission = (roleId, permId) => {
        const targetRole = roles.find(r => r.id === roleId);
        if (!targetRole) return;

        let nextPerms;
        if (targetRole.permissions?.includes(permId)) {
            nextPerms = targetRole.permissions.filter(p => p !== permId);
        } else {
            nextPerms = [...(targetRole.permissions || []), permId];
        }

        const updated = updateRolePermissions(roleId, nextPerms);
        setRoles(updated);
        toast.success(`Updated permissions for ${targetRole.name}`);
    };

    const handleCreateCustomRole = (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) {
            toast.error('Please enter a role name');
            return;
        }

        saveStoredRole({
            name: newRoleName.trim(),
            description: newRoleDesc.trim(),
            department: newRoleDept,
            badgeColor: newRoleColor,
            permissions: newRolePerms
        });

        toast.success(`Custom role "${newRoleName}" created!`);
        setShowRoleModal(false);
        setNewRoleName('');
        setNewRoleDesc('');
        reloadData();
    };

    const handleDeleteCustomRole = (role) => {
        if (role.isSystem) {
            toast.error('System roles cannot be deleted');
            return;
        }
        swal({
            title: `Delete Role "${role.name}"?`,
            text: "Any users assigned to this role will need to be reassigned.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                deleteStoredRole(role.id);
                reloadData();
                toast.success(`Role "${role.name}" removed.`);
            }
        });
    };

    const handleResetRoles = () => {
        swal({
            title: "Reset Roles to Defaults?",
            text: "This will restore the standard Kosher Code enterprise role configurations.",
            icon: "warning",
            buttons: true,
        }).then(confirm => {
            if (confirm) {
                const defaults = resetDefaultRoles();
                setRoles(defaults);
                toast.success('Roles restored to defaults');
            }
        });
    };

    // ----------------------------------------------------
    // WORKFLOW RULES HANDLERS
    // ----------------------------------------------------
    const handleSaveWorkflowConfig = (updates) => {
        const next = { ...workflowRules, ...updates };
        setWorkflowRules(next);
        saveWorkflowRules(next);
        toast.success('Workflow approval policies updated');
    };

    const handleToggleApproverRole = (roleId) => {
        const allowed = workflowRules.allowedApproverRoles || [];
        let nextAllowed;
        if (allowed.includes(roleId)) {
            nextAllowed = allowed.filter(r => r !== roleId);
        } else {
            nextAllowed = [...allowed, roleId];
        }
        handleSaveWorkflowConfig({ allowedApproverRoles: nextAllowed });
    };

    // Filtered members
    const filteredMembers = teamMembers.filter(m => {
        const matchRole = filterRole === 'All' || m.roleId === filterRole;
        const matchSearch = !searchQuery.trim() || 
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.department.toLowerCase().includes(searchQuery.toLowerCase());
        return matchRole && matchSearch;
    });

    return (
        <div className="jira-hub-container">
            {/* Top Hero Banner */}
            <div className="jira-hero-banner">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <div className="jira-hero-badge mb-2">
                            <FontAwesomeIcon icon={faShieldAlt} />
                            Governance & RBAC Studio
                        </div>
                        <h3 className="fw-bold mb-1 text-white">
                            Team Onboarding & Role-Based Access Control
                        </h3>
                        <p className="small mb-0 text-white-50" style={{ maxWidth: '650px' }}>
                            Onboard Developers, Project Managers, Business Analysts and Architects. Configure granular permissions, assignment distribution, and multi-step approval workflows.
                        </p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button 
                            variant="light" 
                            className="rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2"
                            style={{ fontSize: '0.86rem' }}
                            onClick={() => openOnboardModal()}
                        >
                            <FontAwesomeIcon icon={faUserPlus} className="text-primary" /> Onboard Member
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="d-flex flex-wrap gap-2 mb-4">
                <button
                    type="button"
                    className={`jira-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('directory')}
                >
                    <FontAwesomeIcon icon={faUsers} />
                    Team Directory ({teamMembers.length})
                </button>

                <button
                    type="button"
                    className={`jira-tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
                    onClick={() => setActiveTab('matrix')}
                >
                    <FontAwesomeIcon icon={faKey} />
                    Roles & Permissions Matrix ({roles.length} Roles)
                </button>

                <button
                    type="button"
                    className={`jira-tab-btn ${activeTab === 'workflows' ? 'active' : ''}`}
                    onClick={() => setActiveTab('workflows')}
                >
                    <FontAwesomeIcon icon={faCogs} />
                    Approval Workflow Rules
                </button>
            </div>

            {/* ======================================================================
               TAB 1: TEAM DIRECTORY & ONBOARDING
               ====================================================================== */}
            {activeTab === 'directory' && (
                <div className="ad-card p-4 p-md-5">
                    {/* Filter & Search Bar */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                        <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '400px' }}>
                            <div className="position-relative w-100">
                                <FontAwesomeIcon 
                                    icon={faSearch} 
                                    className="position-absolute top-50 translate-middle-y text-muted" 
                                    style={{ left: '16px', fontSize: '0.84rem' }} 
                                />
                                <Form.Control
                                    type="text"
                                    className="cp-input"
                                    style={{ paddingLeft: '40px', borderRadius: '9999px', fontSize: '0.86rem' }}
                                    placeholder="Search by name, email, or department..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <Form.Select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="cp-input rounded-pill"
                                style={{ fontSize: '0.84rem', minWidth: '180px' }}
                            >
                                <option value="All">All Roles ({roles.length})</option>
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </Form.Select>

                            <Button 
                                variant="primary" 
                                className="rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                                style={{ backgroundColor: '#7054F2', borderColor: '#7054F2', fontSize: '0.84rem' }}
                                onClick={() => openOnboardModal()}
                            >
                                <FontAwesomeIcon icon={faUserPlus} /> Onboard Member
                            </Button>
                        </div>
                    </div>

                    {/* Members Table */}
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0 cp-table" style={{ minWidth: '950px' }}>
                            <thead>
                                <tr>
                                    <th className="py-3 px-3">Team Member</th>
                                    <th className="py-3 px-3">Role & Title</th>
                                    <th className="py-3 px-3">Department</th>
                                    <th className="py-3 px-3">Workload / Issues</th>
                                    <th className="py-3 px-3">Status</th>
                                    <th className="py-3 px-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map(member => {
                                    const assignedTickets = tickets.filter(t => t.assigneeId === member.id);
                                    const openCount = assignedTickets.filter(t => t.status !== 'Done').length;
                                    const matchedRole = roles.find(r => r.id === member.roleId);

                                    return (
                                        <tr key={member.id}>
                                            {/* Name & Avatar */}
                                            <td className="py-3 px-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <img 
                                                        src={member.avatar} 
                                                        alt={member.name} 
                                                        className="jira-avatar-md"
                                                    />
                                                    <div>
                                                        <div className="fw-bold" style={{ color: 'var(--cp-text-main)', fontSize: '0.88rem' }}>
                                                            {member.name}
                                                        </div>
                                                        <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                                                            {member.email} {member.phone ? `· ${member.phone}` : ''}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role & Title */}
                                            <td className="py-3 px-3">
                                                <span 
                                                    className="badge rounded-pill px-3 py-1 fw-semibold"
                                                    style={{ 
                                                        backgroundColor: `${matchedRole?.badgeColor || '#7054F2'}18`, 
                                                        color: matchedRole?.badgeColor || '#7054F2',
                                                        fontSize: '0.76rem',
                                                        border: `1px solid ${matchedRole?.badgeColor || '#7054F2'}30`
                                                    }}
                                                >
                                                    {matchedRole?.name || member.roleTitle}
                                                </span>
                                                <small className="text-muted d-block mt-0.5" style={{ fontSize: '0.72rem' }}>
                                                    {member.roleTitle}
                                                </small>
                                            </td>

                                            {/* Department */}
                                            <td className="py-3 px-3 small fw-semibold" style={{ color: 'var(--cp-text-muted)' }}>
                                                {member.department}
                                            </td>

                                            {/* Workload / Issues count */}
                                            <td className="py-3 px-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span 
                                                        className="badge rounded-pill"
                                                        style={{ 
                                                            backgroundColor: openCount > 0 ? 'rgba(59, 130, 246, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                                                            color: openCount > 0 ? '#3B82F6' : '#10B981',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        {openCount} Active
                                                    </span>
                                                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                                                        ({assignedTickets.length} total)
                                                    </small>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-3 px-3">
                                                <span 
                                                    className={`badge rounded-pill px-2.5 py-1 ${member.status === 'Active' ? 'bg-success text-white' : 'bg-secondary text-white'}`}
                                                    style={{ fontSize: '0.72rem', cursor: 'pointer' }}
                                                    onClick={() => handleToggleMemberStatus(member)}
                                                    title="Click to toggle Active / Inactive"
                                                >
                                                    {member.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-3 text-end">
                                                <div className="d-flex justify-content-end gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        variant="outline-secondary"
                                                        className="rounded-circle p-1"
                                                        style={{ width: '32px', height: '32px' }}
                                                        onClick={() => openOnboardModal(member)}
                                                        title="Edit Member Details"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        className="rounded-circle p-1"
                                                        style={{ width: '32px', height: '32px' }}
                                                        onClick={() => handleDeleteMember(member)}
                                                        title="Remove Member"
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )}

            {/* ======================================================================
               TAB 2: ROLES & PERMISSIONS MATRIX (RBAC)
               ====================================================================== */}
            {activeTab === 'matrix' && (
                <div className="ad-card p-4 p-md-5">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                        <div>
                            <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>
                                Granular Roles & Permissions Matrix (RBAC)
                            </h4>
                            <p className="small text-muted mb-0">
                                Click any checkbox in the matrix to immediately toggle permission privileges for that role.
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <Button 
                                variant="outline-secondary" 
                                className="rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
                                style={{ fontSize: '0.82rem' }}
                                onClick={handleResetRoles}
                            >
                                <FontAwesomeIcon icon={faUndo} /> Reset Defaults
                            </Button>

                            <Button 
                                variant="primary" 
                                className="rounded-pill px-3.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
                                style={{ backgroundColor: '#7054F2', borderColor: '#7054F2', fontSize: '0.82rem' }}
                                onClick={() => setShowRoleModal(true)}
                            >
                                <FontAwesomeIcon icon={faUserShield} /> + Create Custom Role
                            </Button>
                        </div>
                    </div>

                    {/* RBAC Table Matrix */}
                    <div className="table-responsive">
                        <Table bordered hover className="align-middle mb-0 rbac-table" style={{ minWidth: '1100px' }}>
                            <thead>
                                <tr>
                                    <th style={{ minWidth: '220px' }}>Role / Title</th>
                                    {DEFAULT_PERMISSIONS.map(perm => (
                                        <th key={perm.id} className="text-center" title={perm.description} style={{ minWidth: '105px' }}>
                                            <div>{perm.label}</div>
                                            <span style={{ fontSize: '0.65rem', textTransform: 'none', fontWeight: 500 }} className="text-muted d-block">
                                                {perm.id}
                                            </span>
                                        </th>
                                    ))}
                                    <th className="text-center" style={{ width: '80px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map(role => (
                                    <tr key={role.id}>
                                        {/* Role Identity */}
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div 
                                                    className="rounded-circle"
                                                    style={{ width: '10px', height: '10px', backgroundColor: role.badgeColor || '#7054F2', flexShrink: 0 }}
                                                />
                                                <div>
                                                    <div className="fw-bold" style={{ color: 'var(--cp-text-main)', fontSize: '0.88rem' }}>
                                                        {role.name}
                                                    </div>
                                                    <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                                                        {role.department} {role.isSystem ? '· System Role' : '· Custom Role'}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Permission Checkbox Cells */}
                                        {DEFAULT_PERMISSIONS.map(perm => {
                                            const hasPerm = role.permissions?.includes(perm.id);
                                            const isSuperAdmin = role.id === 'role-superadmin';

                                            return (
                                                <td key={perm.id} className="text-center">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id={`perm-${role.id}-${perm.id}`}
                                                        checked={hasPerm}
                                                        disabled={isSuperAdmin}
                                                        onChange={() => handleTogglePermission(role.id, perm.id)}
                                                        style={{ cursor: isSuperAdmin ? 'not-allowed' : 'pointer' }}
                                                    />
                                                </td>
                                            );
                                        })}

                                        {/* Delete Custom Role */}
                                        <td className="text-center">
                                            {!role.isSystem ? (
                                                <Button 
                                                    size="sm" 
                                                    variant="link" 
                                                    className="text-danger p-0 shadow-none border-0"
                                                    onClick={() => handleDeleteCustomRole(role)}
                                                    title="Delete Custom Role"
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </Button>
                                            ) : (
                                                <span className="text-muted small" title="System protected role">
                                                    <FontAwesomeIcon icon={faLock} style={{ fontSize: '0.75rem' }} />
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )}

            {/* ======================================================================
               TAB 3: APPROVAL WORKFLOW RULES & GOVERNANCE
               ====================================================================== */}
            {activeTab === 'workflows' && (
                <div className="ad-card p-4 p-md-5">
                    <div className="mb-4">
                        <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>
                            Approval Workflows & Status Gating
                        </h4>
                        <p className="small text-muted mb-0">
                            Configure which types of Jira tickets require executive or architectural sign-off before being moved into development or released to production.
                        </p>
                    </div>

                    <Row className="g-4">
                        {/* Gating Policies */}
                        <Col lg={6}>
                            <Card className="p-4 border-0 rounded-4" style={{ backgroundColor: 'var(--cp-card-subtle, #F8FAFC)' }}>
                                <h6 className="fw-bold mb-3" style={{ color: 'var(--cp-text-main)' }}>
                                    Automatic Approval Requirements
                                </h6>

                                {/* Rule 1 */}
                                <div className="d-flex align-items-center justify-content-between py-2.5 border-bottom">
                                    <div>
                                        <div className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>
                                            Change Requests Require Approval
                                        </div>
                                        <small className="text-muted">
                                            All client or regulatory scope amendments must be approved
                                        </small>
                                    </div>
                                    <Form.Check
                                        type="switch"
                                        id="rule-cr"
                                        checked={workflowRules.requireApprovalForChangeRequests}
                                        onChange={(e) => handleSaveWorkflowConfig({ requireApprovalForChangeRequests: e.target.checked })}
                                    />
                                </div>

                                {/* Rule 2 */}
                                <div className="d-flex align-items-center justify-content-between py-2.5 border-bottom">
                                    <div>
                                        <div className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>
                                            Epics Require Architectural Sign-off
                                        </div>
                                        <small className="text-muted">
                                            High-level milestone epics require architect approval before sprint planning
                                        </small>
                                    </div>
                                    <Form.Check
                                        type="switch"
                                        id="rule-epic"
                                        checked={workflowRules.requireApprovalForEpics}
                                        onChange={(e) => handleSaveWorkflowConfig({ requireApprovalForEpics: e.target.checked })}
                                    />
                                </div>

                                {/* Rule 3 */}
                                <div className="d-flex align-items-center justify-content-between py-2.5 border-bottom">
                                    <div>
                                        <div className="fw-semibold small" style={{ color: 'var(--cp-text-main)' }}>
                                            Production Release (Done) Approval
                                        </div>
                                        <small className="text-muted">
                                            Tickets requiring approval cannot be marked Done without authorized sign-off
                                        </small>
                                    </div>
                                    <Form.Check
                                        type="switch"
                                        id="rule-done"
                                        checked={workflowRules.requireApprovalForProductionDone}
                                        onChange={(e) => handleSaveWorkflowConfig({ requireApprovalForProductionDone: e.target.checked })}
                                    />
                                </div>

                                {/* Rule 4 */}
                                <div className="d-flex align-items-center justify-content-between py-2.5">
                                    <div>
                                        <div className="fw-semibold small text-danger">
                                            Strict Workflow Gating Enforced
                                        </div>
                                        <small className="text-muted">
                                            Strictly block status advancement if required approvals are pending
                                        </small>
                                    </div>
                                    <Form.Check
                                        type="switch"
                                        id="rule-strict"
                                        checked={workflowRules.strictWorkflowGating}
                                        onChange={(e) => handleSaveWorkflowConfig({ strictWorkflowGating: e.target.checked })}
                                    />
                                </div>
                            </Card>
                        </Col>

                        {/* Authorized Approvers */}
                        <Col lg={6}>
                            <Card className="p-4 border-0 rounded-4" style={{ backgroundColor: 'var(--cp-card-subtle, #F8FAFC)' }}>
                                <h6 className="fw-bold mb-3" style={{ color: 'var(--cp-text-main)' }}>
                                    Authorized Approver Roles
                                </h6>
                                <p className="small text-muted mb-3">
                                    Members assigned to any checked role can approve workflow gates, request changes, or sign off on production deployments.
                                </p>

                                {roles.map(role => {
                                    const isAllowed = (workflowRules.allowedApproverRoles || []).includes(role.id);
                                    return (
                                        <div key={role.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                                            <div className="d-flex align-items-center gap-2">
                                                <div 
                                                    className="rounded-circle"
                                                    style={{ width: '8px', height: '8px', backgroundColor: role.badgeColor }}
                                                />
                                                <span className="small fw-semibold" style={{ color: 'var(--cp-text-main)' }}>
                                                    {role.name}
                                                </span>
                                            </div>
                                            <Form.Check
                                                type="checkbox"
                                                id={`appr-role-${role.id}`}
                                                checked={isAllowed}
                                                onChange={() => handleToggleApproverRole(role.id)}
                                            />
                                        </div>
                                    );
                                })}
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}

            {/* ======================================================================
               MODAL 1: ONBOARD / EDIT TEAM MEMBER
               ====================================================================== */}
            <Modal show={showOnboardModal} onHide={() => setShowOnboardModal(false)} centered contentClassName="jira-modal-content">
                <Form onSubmit={handleSaveMember}>
                    <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
                        <h5 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>
                            {editingMember ? 'Edit Team Member Details' : 'Onboard New Team Member'}
                        </h5>
                    </Modal.Header>

                    <Modal.Body className="px-4 py-3">
                        <div className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                Full Name *
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="cp-input"
                                placeholder="e.g. David Mukasa"
                                value={memberName}
                                onChange={(e) => setMemberName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                Email Address *
                            </Form.Label>
                            <Form.Control
                                type="email"
                                className="cp-input"
                                placeholder="e.g. d.mukasa@koshercode.ug"
                                value={memberEmail}
                                onChange={(e) => setMemberEmail(e.target.value)}
                                required
                            />
                        </div>

                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                    Assigned Role *
                                </Form.Label>
                                <Form.Select
                                    value={memberRoleId}
                                    onChange={(e) => setMemberRoleId(e.target.value)}
                                    className="cp-input"
                                >
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                    Department
                                </Form.Label>
                                <Form.Select
                                    value={memberDept}
                                    onChange={(e) => setMemberDept(e.target.value)}
                                    className="cp-input"
                                >
                                    <option value="Engineering">Engineering</option>
                                    <option value="Product & Delivery">Product & Delivery</option>
                                    <option value="Business Analysis">Business Analysis</option>
                                    <option value="Quality Assurance">Quality Assurance</option>
                                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                                    <option value="Executive Leadership">Executive Leadership</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <div className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                Phone Number (Optional)
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="cp-input"
                                placeholder="+256 700 000 000"
                                value={memberPhone}
                                onChange={(e) => setMemberPhone(e.target.value)}
                            />
                        </div>

                        <div className="mb-2">
                            <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                Avatar URL (Optional)
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="cp-input"
                                placeholder="https://..."
                                value={memberAvatar}
                                onChange={(e) => setMemberAvatar(e.target.value)}
                            />
                        </div>
                    </Modal.Body>

                    <Modal.Footer className="border-0 px-4 pb-4 pt-1">
                        <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowOnboardModal(false)}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="rounded-pill px-4 fw-bold"
                            style={{ backgroundColor: '#7054F2', borderColor: '#7054F2' }}
                        >
                            {editingMember ? 'Save Changes' : 'Complete Onboarding'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ======================================================================
               MODAL 2: CREATE CUSTOM ROLE
               ====================================================================== */}
            <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered contentClassName="jira-modal-content">
                <Form onSubmit={handleCreateCustomRole}>
                    <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
                        <h5 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>
                            Create Custom RBAC Role
                        </h5>
                    </Modal.Header>

                    <Modal.Body className="px-4 py-3">
                        <div className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                Role Name *
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="cp-input"
                                placeholder="e.g. FinTech Compliance Auditor"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                Description
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                className="cp-input"
                                placeholder="Explain key scope and governance responsibilities..."
                                value={newRoleDesc}
                                onChange={(e) => setNewRoleDesc(e.target.value)}
                            />
                        </div>

                        <Row className="g-3 mb-3">
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                    Department
                                </Form.Label>
                                <Form.Select
                                    value={newRoleDept}
                                    onChange={(e) => setNewRoleDept(e.target.value)}
                                    className="cp-input"
                                >
                                    <option value="Engineering">Engineering</option>
                                    <option value="Product & Delivery">Product & Delivery</option>
                                    <option value="Business Analysis">Business Analysis</option>
                                    <option value="Quality Assurance">Quality Assurance</option>
                                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                                    <option value="Compliance & Audit">Compliance & Audit</option>
                                </Form.Select>
                            </Col>

                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                    Badge Color
                                </Form.Label>
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Control
                                        type="color"
                                        value={newRoleColor}
                                        onChange={(e) => setNewRoleColor(e.target.value)}
                                        style={{ width: '48px', height: '38px', padding: '2px', borderRadius: '8px' }}
                                    />
                                    <span className="small text-muted">{newRoleColor}</span>
                                </div>
                            </Col>
                        </Row>

                        <div className="mb-2">
                            <Form.Label className="small fw-bold text-muted text-uppercase mb-2">
                                Initial Permissions
                            </Form.Label>
                            <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--cp-card-subtle, #F8FAFC)', maxHeight: '180px', overflowY: 'auto' }}>
                                {DEFAULT_PERMISSIONS.map(perm => {
                                    const checked = newRolePerms.includes(perm.id);
                                    return (
                                        <div key={perm.id} className="d-flex align-items-center justify-content-between py-1 border-bottom">
                                            <span className="small fw-semibold" style={{ color: 'var(--cp-text-main)' }}>
                                                {perm.label}
                                            </span>
                                            <Form.Check
                                                type="checkbox"
                                                id={`new-perm-${perm.id}`}
                                                checked={checked}
                                                onChange={() => {
                                                    if (checked) {
                                                        setNewRolePerms(newRolePerms.filter(p => p !== perm.id));
                                                    } else {
                                                        setNewRolePerms([...newRolePerms, perm.id]);
                                                    }
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer className="border-0 px-4 pb-4 pt-1">
                        <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowRoleModal(false)}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="rounded-pill px-4 fw-bold"
                            style={{ backgroundColor: '#7054F2', borderColor: '#7054F2' }}
                        >
                            Create Role
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default TeamRoleManagement;
