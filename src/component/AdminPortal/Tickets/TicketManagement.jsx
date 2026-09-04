import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, ProgressBar, Table, Dropdown, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faColumns, 
    faList, 
    faLayerGroup, 
    faChartBar, 
    faSearch, 
    faFilter, 
    faUserShield, 
    faFileExport, 
    faCheckCircle, 
    faClock, 
    faExclamationTriangle, 
    faTimes,
    faBookmark,
    faBug,
    faCheckSquare,
    faBolt,
    faExchangeAlt,
    faPlay,
    faCheckDouble
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import swal from 'sweetalert';

import TicketCard from './TicketCard';
import TicketDetailModal from './TicketDetailModal';
import CreateTicketModal from './CreateTicketModal';
import './TicketManagement.css';

import { 
    getStoredTickets, 
    getStoredTeamMembers, 
    getStoredSprints, 
    createTicket, 
    updateTicket, 
    deleteTicket, 
    transitionTicketStatus, 
    processTicketApproval, 
    addTicketComment, 
    toggleSubtask, 
    addSubtask, 
    deleteSubtask,
    saveSprint,
    updateSprint,
    subscribeToTickets,
    subscribeToTeamMembers
} from '../../../services/ticketService';
import { useAppContext } from '../../../context';
import { sendTicketAssignmentNotification } from '../../../services/jiraNotificationService';

const KANBAN_COLUMNS = [
    { id: 'Backlog', label: 'Backlog', color: '#64748B' },
    { id: 'To Do', label: 'To Do', color: '#3B82F6' },
    { id: 'In Progress', label: 'In Progress', color: '#F59E0B' },
    { id: 'In Review', label: 'In Review', color: '#8B5CF6' },
    { id: 'Awaiting Approval', label: 'Awaiting Approval', color: '#EC4899' },
    { id: 'Done', label: 'Done', color: '#10B981' }
];

const TicketManagement = () => {
    const { state: { user } } = useAppContext();
    const navigate = useNavigate();

    // Core Data
    const [tickets, setTickets] = useState(() => getStoredTickets());
    const [teamMembers, setTeamMembers] = useState(() => getStoredTeamMembers());
    const [sprints, setSprints] = useState(() => getStoredSprints());

    // Navigation View: 'kanban' | 'list' | 'sprints' | 'analytics'
    const [currentView, setCurrentView] = useState('kanban');

    // Modals
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSprintModal, setShowSprintModal] = useState(false);
    const [newSprintName, setNewSprintName] = useState('');
    const [newSprintGoal, setNewSprintGoal] = useState('');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAssignee, setFilterAssignee] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterSprint, setFilterSprint] = useState('All');
    const [filterApproval, setFilterApproval] = useState('All');

    // Subscribe to cloud changes
    useEffect(() => {
        const unsubTickets = subscribeToTickets((cloudTickets) => {
            if (cloudTickets && cloudTickets.length > 0) setTickets(cloudTickets);
        });
        const unsubTeam = subscribeToTeamMembers((cloudTeam) => {
            if (cloudTeam && cloudTeam.length > 0) setTeamMembers(cloudTeam);
        });

        return () => {
            if (typeof unsubTickets === 'function') unsubTickets();
            if (typeof unsubTeam === 'function') unsubTeam();
        };
    }, []);

    // ----------------------------------------------------
    // ACTIONS & HANDLERS
    // ----------------------------------------------------
    const handleOpenTicket = (ticket) => {
        setSelectedTicket(ticket);
        setShowDetailModal(true);
    };

    const handleCreateTicket = (ticketData) => {
        const created = createTicket(ticketData, user);
        setTickets(getStoredTickets());
        setSelectedTicket(created);

        // Automated notification dispatch to assignee
        if (created?.assigneeId) {
            const assignee = teamMembers.find(m => m.id === created.assigneeId);
            if (assignee && assignee.email) {
                const sprint = sprints.find(s => s.id === created.sprintId);
                const notifPromise = sendTicketAssignmentNotification(created, assignee, user, sprint?.name);
                toast.promise(notifPromise, {
                    loading: `Dispatching assignment notice to ${assignee.name}...`,
                    success: `Assignment email sent to ${assignee.name}!`,
                    error: 'Assignment notification logged'
                });
            }
        }
    };

    const handleUpdateTicket = (ticketId, updates) => {
        const prevTicket = tickets.find(t => t.id === ticketId);
        const updatedList = updateTicket(ticketId, updates, user);
        setTickets(updatedList);
        const refreshed = updatedList.find(t => t.id === ticketId);
        if (refreshed) setSelectedTicket(refreshed);

        // Dispatch notice if assignee was newly set or changed
        if (updates.assigneeId && updates.assigneeId !== prevTicket?.assigneeId) {
            const assignee = teamMembers.find(m => m.id === updates.assigneeId);
            if (assignee && assignee.email) {
                const sprint = sprints.find(s => s.id === (refreshed?.sprintId || prevTicket?.sprintId));
                const notifPromise = sendTicketAssignmentNotification(refreshed || prevTicket, assignee, user, sprint?.name);
                toast.promise(notifPromise, {
                    loading: `Dispatching reassignment notice to ${assignee.name}...`,
                    success: `Assignment email sent to ${assignee.name}!`,
                    error: 'Assignment notification logged'
                });
            }
        }
    };

    const handleDeleteTicket = (ticketId) => {
        const updatedList = deleteTicket(ticketId);
        setTickets(updatedList);
        setShowDetailModal(false);
    };

    const handleStatusTransition = (ticketId, newStatus) => {
        const result = transitionTicketStatus(ticketId, newStatus, user);
        if (!result.success) {
            swal({
                title: "Approval Required",
                text: result.message,
                icon: "warning",
                button: "Understood",
            });
            return result;
        }

        setTickets(result.tickets);
        const refreshed = result.tickets.find(t => t.id === ticketId);
        if (refreshed && selectedTicket?.id === ticketId) {
            setSelectedTicket(refreshed);
        }
        toast.success(`Moved to "${newStatus}"!`);
        return result;
    };

    const handleQuickApprove = (ticketId) => {
        const updatedList = processTicketApproval(ticketId, 'Approved', 'Approved by Executive Admin', user);
        setTickets(updatedList);
        toast.success('Ticket approved successfully!');
    };

    const handleProcessApproval = (ticketId, decision, notes) => {
        const updatedList = processTicketApproval(ticketId, decision, notes, user);
        setTickets(updatedList);
        const refreshed = updatedList.find(t => t.id === ticketId);
        if (refreshed) setSelectedTicket(refreshed);
    };

    const handleAddComment = (ticketId, commentText) => {
        const result = addTicketComment(ticketId, commentText, user);
        if (result?.updated) {
            setTickets(result.updated);
            const refreshed = result.updated.find(t => t.id === ticketId);
            if (refreshed) setSelectedTicket(refreshed);
        }
    };

    const handleToggleSubtask = (ticketId, subtaskId) => {
        const updatedList = toggleSubtask(ticketId, subtaskId, user);
        setTickets(updatedList);
        const refreshed = updatedList.find(t => t.id === ticketId);
        if (refreshed) setSelectedTicket(refreshed);
    };

    const handleAddSubtask = (ticketId, title) => {
        const result = addSubtask(ticketId, title);
        if (result?.updated) {
            setTickets(result.updated);
            const refreshed = result.updated.find(t => t.id === ticketId);
            if (refreshed) setSelectedTicket(refreshed);
        }
    };

    const handleDeleteSubtask = (ticketId, subtaskId) => {
        const updatedList = deleteSubtask(ticketId, subtaskId);
        setTickets(updatedList);
        const refreshed = updatedList.find(t => t.id === ticketId);
        if (refreshed) setSelectedTicket(refreshed);
    };

    const handleCreateSprint = (e) => {
        e.preventDefault();
        if (!newSprintName.trim()) return;

        saveSprint({
            name: newSprintName.trim(),
            goal: newSprintGoal.trim(),
            status: 'future',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
        });

        setSprints(getStoredSprints());
        setShowSprintModal(false);
        setNewSprintName('');
        setNewSprintGoal('');
        toast.success('New sprint created!');
    };

    const handleCompleteSprint = (sprintId) => {
        swal({
            title: "Complete Active Sprint?",
            text: "All completed tickets will be archived as resolved. Any open tickets will be moved to the next sprint.",
            icon: "info",
            buttons: ["Cancel", "Complete Sprint"],
        }).then(confirm => {
            if (confirm) {
                updateSprint(sprintId, { status: 'closed' });
                setSprints(getStoredSprints());
                toast.success('Sprint successfully marked as completed!');
            }
        });
    };

    const handleExportCSV = () => {
        const headers = ['Key', 'Title', 'Type', 'Status', 'Priority', 'Assignee', 'StoryPoints', 'DueDate', 'ApprovalStatus'];
        const rows = filteredTickets.map(t => {
            const assignee = teamMembers.find(m => m.id === t.assigneeId);
            return [
                t.key,
                `"${(t.title || '').replace(/"/g, '""')}"`,
                t.type,
                t.status,
                t.priority,
                `"${assignee ? assignee.name : 'Unassigned'}"`,
                t.storyPoints || 0,
                t.dueDate || '',
                t.approvalWorkflow?.status || 'None'
            ];
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `kosher_jira_tickets_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Tickets exported as CSV');
    };

    // Filter Logic
    const filteredTickets = tickets.filter(t => {
        const matchSearch = !searchQuery.trim() ||
            t.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.labels || []).some(lbl => lbl.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchAssignee = filterAssignee === 'All' || t.assigneeId === filterAssignee;
        const matchType = filterType === 'All' || t.type === filterType;
        const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
        const matchSprint = filterSprint === 'All' || t.sprintId === filterSprint;
        
        let matchApproval = true;
        if (filterApproval === 'Required') matchApproval = t.approvalWorkflow?.required;
        if (filterApproval === 'Pending') matchApproval = t.approvalWorkflow?.status === 'Pending';
        if (filterApproval === 'Approved') matchApproval = t.approvalWorkflow?.status === 'Approved';

        return matchSearch && matchAssignee && matchType && matchPriority && matchSprint && matchApproval;
    });

    // Active Sprint Stats
    const activeSprint = sprints.find(s => s.status === 'active') || sprints[0];
    const activeSprintTickets = tickets.filter(t => t.sprintId === activeSprint?.id);
    const completedSprintTickets = activeSprintTickets.filter(t => t.status === 'Done');
    const totalPoints = activeSprintTickets.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
    const completedPoints = completedSprintTickets.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
    const sprintProgress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
    const pendingApprovalsCount = tickets.filter(t => t.approvalWorkflow?.status === 'Pending').length;

    return (
        <div className="jira-hub-container">
            {/* Top Hero Banner */}
            <div className="jira-hero-banner">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <div className="jira-hero-badge mb-2">
                            <FontAwesomeIcon icon={faBolt} />
                            Enterprise Agile Hub
                        </div>
                        <h3 className="fw-bold mb-1 text-white">
                            Jira Ticket Management & Engineering Workflows
                        </h3>
                        <p className="small mb-0 text-white-50" style={{ maxWidth: '650px' }}>
                            Full-lifecycle ticket board with sprint cycles, user onboarding (Devs, PMs, BAs, Architects), configurable permissions, and governance approval gates.
                        </p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button 
                            variant="outline-light" 
                            className="px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                            style={{ fontSize: '0.84rem', borderRadius: '0' }}
                            onClick={() => navigate('/admin/team-roles')}
                        >
                            <FontAwesomeIcon icon={faUserShield} /> Team & Roles (RBAC)
                        </Button>

                        <Button 
                            variant="light" 
                            className="px-4 py-2 fw-bold d-inline-flex align-items-center gap-2"
                            style={{ fontSize: '0.84rem', borderRadius: '0' }}
                            onClick={() => setShowCreateModal(true)}
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-primary" /> Create Ticket
                        </Button>
                    </div>
                </div>

                {/* Active Sprint Bar inside Banner */}
                {activeSprint && (
                    <div 
                        className="mt-4 p-3 d-flex flex-wrap align-items-center justify-content-between gap-3"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '0' }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <div className="jira-pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                            <div>
                                <span className="fw-bold small text-white">{activeSprint.name}</span>
                                <small className="text-white-50 d-block" style={{ fontSize: '0.72rem' }}>
                                    {activeSprint.goal}
                                </small>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-4">
                            <div className="d-flex align-items-center gap-2">
                                <span className="small text-white-50" style={{ fontSize: '0.75rem' }}>Velocity:</span>
                                <span className="badge bg-light text-dark fw-bold" style={{ fontSize: '0.75rem', borderRadius: '0' }}>
                                    {completedPoints} / {totalPoints} pts ({sprintProgress}%)
                                </span>
                            </div>

                            {pendingApprovalsCount > 0 && (
                                <span 
                                    className="badge px-2.5 py-1 text-white d-inline-flex align-items-center gap-1"
                                    style={{ backgroundColor: '#EF4444', fontSize: '0.72rem', cursor: 'pointer', borderRadius: '0' }}
                                    onClick={() => setFilterApproval('Pending')}
                                    title="Click to filter tickets awaiting approval"
                                >
                                    <FontAwesomeIcon icon={faClock} /> {pendingApprovalsCount} Awaiting Approval
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* View Switcher & Actions Toolbar */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                {/* Left: View Tabs */}
                <div className="d-flex flex-wrap gap-2">
                    <button
                        type="button"
                        className={`jira-tab-btn ${currentView === 'kanban' ? 'active' : ''}`}
                        onClick={() => setCurrentView('kanban')}
                    >
                        <FontAwesomeIcon icon={faColumns} /> Kanban Board
                    </button>
                    <button
                        type="button"
                        className={`jira-tab-btn ${currentView === 'list' ? 'active' : ''}`}
                        onClick={() => setCurrentView('list')}
                    >
                        <FontAwesomeIcon icon={faList} /> List / Table ({filteredTickets.length})
                    </button>
                    <button
                        type="button"
                        className={`jira-tab-btn ${currentView === 'sprints' ? 'active' : ''}`}
                        onClick={() => setCurrentView('sprints')}
                    >
                        <FontAwesomeIcon icon={faLayerGroup} /> Sprints & Backlog
                    </button>
                    <button
                        type="button"
                        className={`jira-tab-btn ${currentView === 'analytics' ? 'active' : ''}`}
                        onClick={() => setCurrentView('analytics')}
                    >
                        <FontAwesomeIcon icon={faChartBar} /> Team Workload
                    </button>
                </div>

                {/* Right: Export & Add Ticket */}
                <div className="d-flex align-items-center gap-2">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className="px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
                        style={{ fontSize: '0.82rem', borderColor: 'var(--cp-border)', borderRadius: '0' }}
                        onClick={handleExportCSV}
                    >
                        <FontAwesomeIcon icon={faFileExport} /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="ad-card p-3 mb-4">
                <Row className="g-2 align-items-center">
                    {/* Search */}
                    <Col lg={3} md={6}>
                        <div className="position-relative">
                            <FontAwesomeIcon 
                                icon={faSearch} 
                                className="position-absolute top-50 translate-middle-y text-muted" 
                                style={{ left: '14px', fontSize: '0.82rem' }} 
                            />
                            <Form.Control
                                type="text"
                                size="sm"
                                className="cp-input"
                                style={{ paddingLeft: '36px', borderRadius: '0', fontSize: '0.84rem' }}
                                placeholder="Search Key, Title, Tag..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </Col>

                    {/* Assignee Filter */}
                    <Col lg={2} md={3} xs={6}>
                        <Form.Select
                            size="sm"
                            className="cp-input"
                            style={{ fontSize: '0.82rem', borderRadius: '0' }}
                            value={filterAssignee}
                            onChange={(e) => setFilterAssignee(e.target.value)}
                        >
                            <option value="All">All Assignees</option>
                            {teamMembers.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </Form.Select>
                    </Col>

                    {/* Issue Type Filter */}
                    <Col lg={2} md={3} xs={6}>
                        <Form.Select
                            size="sm"
                            className="cp-input"
                            style={{ fontSize: '0.82rem', borderRadius: '0' }}
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Story">Story</option>
                            <option value="Bug">Bug</option>
                            <option value="Task">Task</option>
                            <option value="Epic">Epic</option>
                            <option value="Change Request">Change Request</option>
                        </Form.Select>
                    </Col>

                    {/* Priority Filter */}
                    <Col lg={2} md={3} xs={6}>
                        <Form.Select
                            size="sm"
                            className="cp-input"
                            style={{ fontSize: '0.82rem', borderRadius: '0' }}
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="All">All Priorities</option>
                            <option value="Highest">Highest ⚡</option>
                            <option value="High">High ↑</option>
                            <option value="Medium">Medium =</option>
                            <option value="Low">Low ↓</option>
                        </Form.Select>
                    </Col>

                    {/* Approval Filter */}
                    <Col lg={2} md={3} xs={6}>
                        <Form.Select
                            size="sm"
                            className="cp-input"
                            style={{ fontSize: '0.82rem', borderRadius: '0' }}
                            value={filterApproval}
                            onChange={(e) => setFilterApproval(e.target.value)}
                        >
                            <option value="All">All Approvals</option>
                            <option value="Pending">Pending Sign-off ⏳</option>
                            <option value="Approved">Approved ✓</option>
                            <option value="Required">Requires Approval</option>
                        </Form.Select>
                    </Col>

                    {/* Clear Filters */}
                    <Col lg={1} md={12} className="text-end">
                        {(searchQuery || filterAssignee !== 'All' || filterType !== 'All' || filterPriority !== 'All' || filterApproval !== 'All') && (
                            <Button 
                                variant="link" 
                                size="sm" 
                                className="text-muted p-0 text-decoration-none"
                                style={{ fontSize: '0.78rem' }}
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilterAssignee('All');
                                    setFilterType('All');
                                    setFilterPriority('All');
                                    setFilterApproval('All');
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} /> Reset
                            </Button>
                        )}
                    </Col>
                </Row>
            </div>

            {/* ======================================================================
               VIEW 1: KANBAN BOARD
               ====================================================================== */}
            {currentView === 'kanban' && (
                <div className="jira-board-wrapper">
                    <div className="jira-kanban-board">
                        {KANBAN_COLUMNS.map(column => {
                            const columnTickets = filteredTickets.filter(t => t.status === column.id);

                            return (
                                <div key={column.id} className="jira-column">
                                    {/* Column Header */}
                                    <div className="jira-column-header">
                                        <h6 className="jira-column-title" style={{ color: column.color }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: column.color, display: 'inline-block' }} />
                                            {column.label}
                                        </h6>
                                        <span className="jira-column-count">
                                            {columnTickets.length}
                                        </span>
                                    </div>

                                    {/* Column Cards */}
                                    <div className="jira-column-cards">
                                        {columnTickets.length === 0 ? (
                                            <div className="text-center py-4 text-muted small" style={{ fontSize: '0.78rem' }}>
                                                No issues in {column.label}
                                            </div>
                                        ) : (
                                            columnTickets.map(ticket => {
                                                const assignee = teamMembers.find(m => m.id === ticket.assigneeId);
                                                return (
                                                    <TicketCard
                                                        key={ticket.id}
                                                        ticket={ticket}
                                                        assignee={assignee}
                                                        onCardClick={handleOpenTicket}
                                                        onStatusChange={handleStatusTransition}
                                                        onQuickApprove={handleQuickApprove}
                                                        availableStatuses={KANBAN_COLUMNS.map(c => c.id)}
                                                    />
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ======================================================================
               VIEW 2: LIST / TABLE VIEW
               ====================================================================== */}
            {currentView === 'list' && (
                <div className="ad-card p-4">
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0 cp-table" style={{ minWidth: '1000px' }}>
                            <thead>
                                <tr>
                                    <th className="py-3 px-3" style={{ width: '100px' }}>Key</th>
                                    <th className="py-3 px-3" style={{ width: '110px' }}>Type</th>
                                    <th className="py-3 px-3">Title / Summary</th>
                                    <th className="py-3 px-3" style={{ width: '110px' }}>Priority</th>
                                    <th className="py-3 px-3" style={{ width: '150px' }}>Status</th>
                                    <th className="py-3 px-3" style={{ width: '180px' }}>Assignee</th>
                                    <th className="py-3 px-3" style={{ width: '140px' }}>Approval</th>
                                    <th className="py-3 px-3 text-end" style={{ width: '80px' }}>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map(ticket => {
                                    const assignee = teamMembers.find(m => m.id === ticket.assigneeId);
                                    return (
                                        <tr 
                                            key={ticket.id} 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleOpenTicket(ticket)}
                                        >
                                            <td className="py-3 px-3 fw-bold text-primary" style={{ fontSize: '0.84rem' }}>
                                                {ticket.key}
                                            </td>
                                            <td className="py-3 px-3 small fw-semibold">
                                                {ticket.type}
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="fw-semibold text-truncate" style={{ maxWidth: '380px', color: 'var(--cp-text-main)' }}>
                                                    {ticket.title}
                                                </div>
                                                <div className="d-flex gap-1 mt-1">
                                                    {(ticket.labels || []).slice(0, 2).map((l, idx) => (
                                                        <span key={idx} className="jira-tag-pill">{l}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 small">
                                                <span className={`priority-${ticket.priority?.toLowerCase()}`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span 
                                                    className="badge px-2.5 py-1 small"
                                                    style={{ 
                                                        backgroundColor: 'var(--cp-card-subtle, #F1F5F9)', 
                                                        color: 'var(--cp-text-main, #0F172A)', 
                                                        border: '1px solid var(--cp-border, #E2E8F0)',
                                                        borderRadius: '0'
                                                    }}
                                                >
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 small">
                                                {assignee ? (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <img src={assignee.avatar} alt={assignee.name} className="jira-avatar-sm" />
                                                        <span className="fw-semibold">{assignee.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 small">
                                                {ticket.approvalWorkflow?.required ? (
                                                    ticket.approvalWorkflow.status === 'Approved' ? (
                                                        <span className="approval-badge-approved">Approved</span>
                                                    ) : ticket.approvalWorkflow.status === 'Pending' ? (
                                                        <span className="approval-badge-pending">Pending</span>
                                                    ) : (
                                                        <span className="approval-badge-rejected">Changes</span>
                                                    )
                                                ) : (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 text-end fw-bold">
                                                {ticket.storyPoints || 0} pts
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
               VIEW 3: SPRINTS & BACKLOG
               ====================================================================== */}
            {currentView === 'sprints' && (
                <div className="ad-card p-4 p-md-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>
                                Sprints & Backlog Planning
                            </h4>
                            <p className="small text-muted mb-0">
                                Organize issues into 2-week agile delivery cycles or groom the enterprise product backlog.
                            </p>
                        </div>
                        <Button 
                            variant="primary" 
                            className="px-4 fw-semibold"
                            style={{ backgroundColor: '#0672CB', borderColor: '#0672CB', borderRadius: '0', fontSize: '0.84rem' }}
                            onClick={() => setShowSprintModal(true)}
                        >
                            <FontAwesomeIcon icon={faPlus} className="me-1" /> Create Sprint
                        </Button>
                    </div>

                    {/* Sprints listing */}
                    {sprints.map(sprint => {
                        const sprintTickets = tickets.filter(t => t.sprintId === sprint.id);
                        const sprintDone = sprintTickets.filter(t => t.status === 'Done');

                        return (
                            <div 
                                key={sprint.id} 
                                className="p-4 mb-4" 
                                style={{ 
                                    backgroundColor: 'var(--cp-card-subtle, #F8FAFC)', 
                                    border: '1px solid var(--cp-border, #E2E8F0)',
                                    borderRadius: '0'
                                }}
                            >
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <span 
                                            className={`badge px-3 py-1 ${sprint.status === 'active' ? 'bg-success text-white' : 'bg-secondary text-white'}`}
                                            style={{ borderRadius: '0' }}
                                        >
                                            {sprint.status === 'active' ? 'Active Sprint' : 'Planned Sprint'}
                                        </span>
                                        <h5 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>
                                            {sprint.name}
                                        </h5>
                                        <span className="text-muted small">
                                            ({sprint.startDate} to {sprint.endDate})
                                        </span>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        {sprint.status === 'active' ? (
                                            <Button 
                                                variant="outline-success" 
                                                size="sm" 
                                                className="px-3 fw-bold"
                                                style={{ borderRadius: '0' }}
                                                onClick={() => handleCompleteSprint(sprint.id)}
                                            >
                                                <FontAwesomeIcon icon={faCheckDouble} /> Complete Sprint
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                className="px-3 fw-bold"
                                                style={{ borderRadius: '0' }}
                                                onClick={() => {
                                                    updateSprint(sprint.id, { status: 'active' });
                                                    setSprints(getStoredSprints());
                                                    toast.success(`Started ${sprint.name}!`);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPlay} /> Start Sprint
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <p className="small text-muted mb-3">
                                    <strong>Goal:</strong> {sprint.goal || 'General development and bug fixes'}
                                </p>

                                {/* Issues in this sprint */}
                                <div className="d-flex flex-column gap-2">
                                    {sprintTickets.map(t => {
                                        const assignee = teamMembers.find(m => m.id === t.assigneeId);
                                        return (
                                            <div 
                                                key={t.id} 
                                                className="d-flex align-items-center justify-content-between p-2.5 border"
                                                style={{ 
                                                    cursor: 'pointer',
                                                    backgroundColor: 'var(--cp-card-bg, #FFFFFF)',
                                                    borderColor: 'var(--cp-border, #E2E8F0)',
                                                    borderRadius: '0'
                                                }}
                                                onClick={() => handleOpenTicket(t)}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="fw-bold text-primary small">{t.key}</span>
                                                    <span className="small fw-semibold" style={{ color: 'var(--cp-text-main)' }}>{t.title}</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <span 
                                                        className="badge small"
                                                        style={{ 
                                                            backgroundColor: 'var(--cp-card-subtle, #F1F5F9)', 
                                                            color: 'var(--cp-text-main, #0F172A)', 
                                                            border: '1px solid var(--cp-border, #E2E8F0)',
                                                            borderRadius: '0'
                                                        }}
                                                    >
                                                        {t.status}
                                                    </span>
                                                    {assignee && <img src={assignee.avatar} alt={assignee.name} className="jira-avatar-sm" />}
                                                    <span className="small fw-bold">{t.storyPoints} pts</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {sprintTickets.length === 0 && (
                                        <div className="text-center text-muted small py-3">No tickets in this sprint yet.</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ======================================================================
               VIEW 4: TEAM WORKLOAD & ANALYTICS
               ====================================================================== */}
            {currentView === 'analytics' && (
                <div className="ad-card p-4 p-md-5">
                    <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>
                        Engineering Team Workload & Velocity
                    </h4>
                    <p className="small text-muted mb-4">
                        Distribution of active tickets and story points across onboarded team members.
                    </p>

                    <Row className="g-4">
                        {teamMembers.map(member => {
                            const assignedTickets = tickets.filter(t => t.assigneeId === member.id);
                            const activeCount = assignedTickets.filter(t => t.status !== 'Done').length;
                            const doneCount = assignedTickets.filter(t => t.status === 'Done').length;
                            const assignedPoints = assignedTickets.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
                            const donePoints = assignedTickets.filter(t => t.status === 'Done').reduce((acc, t) => acc + (t.storyPoints || 0), 0);
                            const memberProgress = assignedPoints > 0 ? Math.round((donePoints / assignedPoints) * 100) : 0;

                            return (
                                <Col lg={6} key={member.id}>
                                    <div 
                                        className="p-3.5" 
                                        style={{ backgroundColor: 'var(--cp-card-subtle, #F8FAFC)', border: '1px solid var(--cp-border, #E2E8F0)', borderRadius: '0' }}
                                    >
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center gap-2.5">
                                                <img src={member.avatar} alt={member.name} className="jira-avatar-md" />
                                                <div>
                                                    <div className="fw-bold small" style={{ color: 'var(--cp-text-main)' }}>
                                                        {member.name}
                                                    </div>
                                                    <small className="text-muted d-block" style={{ fontSize: '0.74rem' }}>
                                                        {member.roleTitle}
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <span className="badge bg-primary text-white small" style={{ borderRadius: '0' }}>
                                                    {assignedPoints} story pts
                                                </span>
                                                <small className="text-muted d-block mt-0.5" style={{ fontSize: '0.72rem' }}>
                                                    {activeCount} Active / {doneCount} Done
                                                </small>
                                            </div>
                                        </div>

                                        <ProgressBar 
                                            now={memberProgress} 
                                            variant={memberProgress === 100 ? 'success' : 'primary'} 
                                            style={{ height: '6px', borderRadius: '0' }}
                                            className="mt-2 mb-1" 
                                        />
                                        <div className="d-flex justify-content-between text-muted small" style={{ fontSize: '0.72rem' }}>
                                            <span>Resolution Velocity</span>
                                            <span>{memberProgress}% complete</span>
                                        </div>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </div>
            )}

            {/* ======================================================================
               MODALS
               ====================================================================== */}
            {/* 1. Ticket Detail Modal */}
            <TicketDetailModal
                show={showDetailModal}
                ticket={selectedTicket}
                onHide={() => setShowDetailModal(false)}
                teamMembers={teamMembers}
                sprints={sprints}
                onUpdateTicket={handleUpdateTicket}
                onDeleteTicket={handleDeleteTicket}
                onStatusChange={handleStatusTransition}
                onProcessApproval={handleProcessApproval}
                onAddComment={handleAddComment}
                onToggleSubtask={handleToggleSubtask}
                onAddSubtask={handleAddSubtask}
                onDeleteSubtask={handleDeleteSubtask}
                currentUser={user}
            />

            {/* 2. Create Ticket Modal */}
            <CreateTicketModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onCreateTicket={handleCreateTicket}
                teamMembers={teamMembers}
                sprints={sprints}
                currentUser={user}
            />

            {/* 3. Create Sprint Modal */}
            <Modal show={showSprintModal} onHide={() => setShowSprintModal(false)} centered contentClassName="jira-modal-content">
                <Form onSubmit={handleCreateSprint}>
                    <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
                        <h5 className="fw-bold mb-0">Create Sprint Cycle</h5>
                    </Modal.Header>
                    <Modal.Body className="px-4 py-3">
                        <div className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                Sprint Name *
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="cp-input"
                                placeholder="e.g. Sprint 3 - Core Banking Real-time Settlement"
                                value={newSprintName}
                                onChange={(e) => setNewSprintName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                                Sprint Goal
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                className="cp-input"
                                placeholder="State the high-level release objectives..."
                                value={newSprintGoal}
                                onChange={(e) => setNewSprintGoal(e.target.value)}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0 px-4 pb-4 pt-1">
                        <Button variant="secondary" className="px-4" style={{ borderRadius: '0' }} onClick={() => setShowSprintModal(false)}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="px-4 fw-bold"
                            style={{ backgroundColor: '#0672CB', borderColor: '#0672CB', borderRadius: '0' }}
                        >
                            Create Sprint
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default TicketManagement;
