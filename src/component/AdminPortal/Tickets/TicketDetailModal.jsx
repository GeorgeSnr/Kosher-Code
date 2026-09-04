import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Form, Button, Tabs, Tab, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBookmark, 
    faBug, 
    faCheckSquare, 
    faBolt, 
    faExchangeAlt,
    faCheckCircle,
    faTimesCircle,
    faClock,
    faExclamationTriangle,
    faPlus,
    faTrashAlt,
    faPaperPlane,
    faHistory,
    faCommentAlt,
    faTag,
    faCalendarAlt,
    faUserCheck,
    faShieldAlt,
    faEdit,
    faCopy
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import { sendTicketAssignmentNotification } from '../../../services/jiraNotificationService';

const typeIcons = {
    'Story': { icon: faBookmark, color: '#10B981' },
    'Bug': { icon: faBug, color: '#EF4444' },
    'Task': { icon: faCheckSquare, color: '#3B82F6' },
    'Epic': { icon: faBolt, color: '#8B5CF6' },
    'Change Request': { icon: faExchangeAlt, color: '#F59E0B' }
};

const TicketDetailModal = ({
    show,
    ticket,
    onHide,
    teamMembers = [],
    sprints = [],
    onUpdateTicket,
    onDeleteTicket,
    onStatusChange,
    onProcessApproval,
    onAddComment,
    onToggleSubtask,
    onAddSubtask,
    onDeleteSubtask,
    currentUser = null
}) => {
    if (!ticket) return null;

    // Form local states
    const [title, setTitle] = useState(ticket.title || '');
    const [description, setDescription] = useState(ticket.description || '');
    const [status, setStatus] = useState(ticket.status || 'To Do');
    const [priority, setPriority] = useState(ticket.priority || 'Medium');
    const [type, setType] = useState(ticket.type || 'Task');
    const [assigneeId, setAssigneeId] = useState(ticket.assigneeId || '');
    const [reporterId, setReporterId] = useState(ticket.reporterId || '');
    const [sprintId, setSprintId] = useState(ticket.sprintId || 'sprint-1');
    const [storyPoints, setStoryPoints] = useState(ticket.storyPoints || 3);
    const [dueDate, setDueDate] = useState(ticket.dueDate || '');
    const [newTag, setNewTag] = useState('');
    const [labels, setLabels] = useState(ticket.labels || []);
    
    // Subtask & Comment states
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [newCommentText, setNewCommentText] = useState('');
    const [approvalNotes, setApprovalNotes] = useState('');
    const [activeTab, setActiveTab] = useState('comments');

    // Sync whenever selected ticket changes
    useEffect(() => {
        if (ticket) {
            setTitle(ticket.title || '');
            setDescription(ticket.description || '');
            setStatus(ticket.status || 'To Do');
            setPriority(ticket.priority || 'Medium');
            setType(ticket.type || 'Task');
            setAssigneeId(ticket.assigneeId || '');
            setReporterId(ticket.reporterId || '');
            setSprintId(ticket.sprintId || 'sprint-1');
            setStoryPoints(ticket.storyPoints || 3);
            setDueDate(ticket.dueDate || '');
            setLabels(ticket.labels || []);
            setApprovalNotes('');
        }
    }, [ticket]);

    const handleSendAssignmentEmail = () => {
        const assignedMember = teamMembers.find(m => m.id === (assigneeId || ticket.assigneeId));
        if (!assignedMember || !assignedMember.email) {
            toast.error('Assignee has no email address configured');
            return;
        }

        const sprint = sprints.find(s => s.id === (sprintId || ticket.sprintId));
        const notifPromise = sendTicketAssignmentNotification(ticket, assignedMember, currentUser, sprint?.name);
        toast.promise(notifPromise, {
            loading: `Dispatching ticket assignment email to ${assignedMember.email}...`,
            success: `Assignment email delivered to ${assignedMember.email}!`,
            error: 'Failed to send assignment notification'
        });
    };

    const handleSaveField = (field, value) => {
        onUpdateTicket(ticket.id, { [field]: value });
        toast.success(`Updated ${field}`);
    };

    const handleStatusTransition = (newStatus) => {
        setStatus(newStatus);
        const res = onStatusChange(ticket.id, newStatus);
        if (res && !res.success) {
            // Roll back local status display
            setStatus(ticket.status);
        }
    };

    const handleAddLabel = (e) => {
        e.preventDefault();
        if (newTag.trim() && !labels.includes(newTag.trim())) {
            const next = [...labels, newTag.trim()];
            setLabels(next);
            setNewTag('');
            onUpdateTicket(ticket.id, { labels: next });
            toast.success('Label added');
        }
    };

    const handleRemoveLabel = (tagToRemove) => {
        const next = labels.filter(t => t !== tagToRemove);
        setLabels(next);
        onUpdateTicket(ticket.id, { labels: next });
    };

    const handleCreateSubtask = (e) => {
        e.preventDefault();
        if (newSubtaskTitle.trim()) {
            onAddSubtask(ticket.id, newSubtaskTitle.trim());
            setNewSubtaskTitle('');
        }
    };

    const handlePostComment = (e) => {
        e.preventDefault();
        if (newCommentText.trim()) {
            onAddComment(ticket.id, newCommentText.trim());
            setNewCommentText('');
            toast.success('Comment posted');
        }
    };

    const handleApprovalAction = (decision) => {
        swal({
            title: `${decision === 'Approved' ? 'Approve Ticket Workflow' : 'Request Changes'}?`,
            text: `Confirm your decision on ${ticket.key}. You can attach an executive note or reason.`,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Reason or approval note...",
                    type: "text",
                },
            },
            buttons: ["Cancel", decision === 'Approved' ? "Confirm Approval" : "Request Changes"],
            dangerMode: decision !== 'Approved'
        }).then((inputValue) => {
            if (inputValue !== null) {
                onProcessApproval(ticket.id, decision, inputValue || 'Approved without additional notes');
                toast.success(`Ticket ${ticket.key} marked as ${decision}!`);
            }
        });
    };

    const handleDelete = () => {
        swal({
            title: `Archive / Delete ${ticket.key}?`,
            text: "Are you sure you want to remove this Jira ticket from the system?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                onDeleteTicket(ticket.id);
                onHide();
                toast.success(`Ticket ${ticket.key} deleted.`);
            }
        });
    };

    const totalSubtasks = (ticket.subtasks || []).length;
    const completedSubtasks = (ticket.subtasks || []).filter(st => st.completed).length;
    const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
    const currentAssignee = teamMembers.find(m => m.id === ticket.assigneeId);
    const currentReporter = teamMembers.find(m => m.id === ticket.reporterId);
    const typeMeta = typeIcons[type] || typeIcons['Task'];

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            size="xl" 
            centered 
            dialogClassName="jira-ticket-modal"
            contentClassName="jira-modal-content"
        >
            {/* Modal Header */}
            <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span 
                        className="badge rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5"
                        style={{ backgroundColor: `${typeMeta.color}1A`, color: typeMeta.color, fontSize: '0.78rem', fontWeight: 700 }}
                    >
                        <FontAwesomeIcon icon={typeMeta.icon} />
                        {type}
                    </span>
                    <h5 className="fw-bold mb-0 text-primary" style={{ letterSpacing: '-0.02em' }}>
                        {ticket.key}
                    </h5>
                    <span className="text-muted small">
                        Created {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                </div>
            </Modal.Header>

            <Modal.Body className="px-4 py-3">
                <Row className="g-4">
                    {/* LEFT COLUMN: Title, Description, Subtasks, Activity / Comments */}
                    <Col lg={8}>
                        {/* Title Form Field */}
                        <div className="mb-4">
                            <Form.Control
                                type="text"
                                className="fw-bold fs-5 border-0 px-2 py-1 shadow-none bg-transparent"
                                style={{ color: 'var(--cp-text-main, #0F172A)' }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={() => {
                                    if (title !== ticket.title) handleSaveField('title', title);
                                }}
                                placeholder="Ticket Summary / Title"
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="fw-bold small text-muted text-uppercase mb-1.5 d-block">
                                Description
                            </label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                className="cp-input"
                                style={{ borderRadius: '12px', fontSize: '0.88rem', lineHeight: 1.6 }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={() => {
                                    if (description !== ticket.description) handleSaveField('description', description);
                                }}
                                placeholder="Add detailed technical requirements, acceptance criteria, steps to reproduce, or architectural notes..."
                            />
                        </div>

                        {/* Subtasks / Checklist */}
                        <div className="mb-4 p-3.5 rounded-3" style={{ backgroundColor: 'var(--cp-card-subtle, #F8FAFC)', border: '1px solid var(--cp-border-subtle, rgba(0,0,0,0.06))' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-bold small text-uppercase" style={{ color: 'var(--cp-text-main, #0F172A)' }}>
                                    Subtasks & Acceptance Criteria ({completedSubtasks}/{totalSubtasks})
                                </span>
                                <span className="small fw-semibold text-muted">{progressPercent}%</span>
                            </div>

                            {totalSubtasks > 0 && (
                                <ProgressBar 
                                    now={progressPercent} 
                                    variant={progressPercent === 100 ? 'success' : 'primary'} 
                                    className="mb-3" 
                                    style={{ height: '6px', borderRadius: '9999px' }} 
                                />
                            )}

                            {/* Subtask list */}
                            <div>
                                {(ticket.subtasks || []).map((st) => (
                                    <div key={st.id} className={`subtask-item ${st.completed ? 'completed' : ''}`}>
                                        <div className="d-flex align-items-center gap-2">
                                            <Form.Check
                                                type="checkbox"
                                                id={`st-${st.id}`}
                                                checked={st.completed}
                                                onChange={() => onToggleSubtask(ticket.id, st.id)}
                                            />
                                            <label 
                                                htmlFor={`st-${st.id}`} 
                                                className="mb-0 small fw-medium"
                                                style={{ cursor: 'pointer', color: 'var(--cp-text-main, #0F172A)' }}
                                            >
                                                {st.title}
                                            </label>
                                        </div>
                                        <button 
                                            type="button" 
                                            className="btn btn-link text-danger p-0 border-0 shadow-none"
                                            onClick={() => onDeleteSubtask(ticket.id, st.id)}
                                            title="Delete subtask"
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} style={{ fontSize: '0.78rem' }} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add subtask input */}
                            <Form onSubmit={handleCreateSubtask} className="d-flex gap-2 mt-2">
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    className="cp-input rounded-pill"
                                    placeholder="+ Add a subtask / acceptance criterion..."
                                    value={newSubtaskTitle}
                                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                />
                                <Button 
                                    type="submit" 
                                    size="sm" 
                                    variant="primary" 
                                    className="rounded-pill px-3 fw-semibold"
                                    disabled={!newSubtaskTitle.trim()}
                                >
                                    Add
                                </Button>
                            </Form>
                        </div>

                        {/* Tabs: Activity Log & Comments */}
                        <div className="mt-4">
                            <div className="d-flex gap-2 mb-3 border-bottom pb-2">
                                <button
                                    type="button"
                                    className={`btn btn-sm rounded-pill px-3 fw-semibold border-0 ${activeTab === 'comments' ? 'btn-primary' : 'btn-light text-muted'}`}
                                    onClick={() => setActiveTab('comments')}
                                >
                                    <FontAwesomeIcon icon={faCommentAlt} className="me-1.5" /> Comments ({ticket.comments?.length || 0})
                                </button>
                                <button
                                    type="button"
                                    className={`btn btn-sm rounded-pill px-3 fw-semibold border-0 ${activeTab === 'activity' ? 'btn-primary' : 'btn-light text-muted'}`}
                                    onClick={() => setActiveTab('activity')}
                                >
                                    <FontAwesomeIcon icon={faHistory} className="me-1.5" /> Activity History ({ticket.activity?.length || 0})
                                </button>
                            </div>

                            {/* Comments Tab */}
                            {activeTab === 'comments' && (
                                <div>
                                    {/* New comment input */}
                                    <Form onSubmit={handlePostComment} className="mb-4">
                                        <div className="d-flex gap-2 align-items-start">
                                            <div 
                                                className="jira-avatar-sm d-flex align-items-center justify-content-center bg-primary text-white flex-shrink-0"
                                                style={{ fontSize: '0.7rem', fontWeight: 700 }}
                                            >
                                                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                                            </div>
                                            <div className="flex-grow-1">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    className="cp-input"
                                                    style={{ borderRadius: '12px', fontSize: '0.85rem' }}
                                                    placeholder="Write a comment, tag team members or add update..."
                                                    value={newCommentText}
                                                    onChange={(e) => setNewCommentText(e.target.value)}
                                                />
                                                <div className="d-flex justify-content-end mt-2">
                                                    <Button 
                                                        type="submit" 
                                                        size="sm" 
                                                        variant="primary" 
                                                        className="rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1.5"
                                                        disabled={!newCommentText.trim()}
                                                    >
                                                        <FontAwesomeIcon icon={faPaperPlane} /> Post Comment
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>

                                    {/* Comments list */}
                                    {(ticket.comments || []).length === 0 ? (
                                        <p className="text-muted small text-center py-3 mb-0">No comments yet. Be the first to share an update.</p>
                                    ) : (
                                        [...(ticket.comments || [])].reverse().map(cm => (
                                            <div key={cm.id} className="comment-bubble">
                                                <div className="d-flex align-items-center justify-content-between mb-1.5">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="fw-bold small" style={{ color: 'var(--cp-text-main)' }}>
                                                            {cm.authorName}
                                                        </span>
                                                        <span 
                                                            className="badge rounded-pill px-2 py-0.5" 
                                                            style={{ backgroundColor: 'var(--cp-primary-subtle, rgba(112,84,242,0.1))', color: 'var(--cp-primary, #7054F2)', fontSize: '0.68rem' }}
                                                        >
                                                            {cm.authorRole || 'Member'}
                                                        </span>
                                                    </div>
                                                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                                                        {cm.timestamp ? new Date(cm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + new Date(cm.timestamp).toLocaleDateString() : ''}
                                                    </span>
                                                </div>
                                                <div className="small" style={{ color: 'var(--cp-text-main)', whiteSpace: 'pre-wrap' }}>
                                                    {cm.text}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Activity Tab */}
                            {activeTab === 'activity' && (
                                <div className="p-2">
                                    {(ticket.activity || []).map(act => (
                                        <div key={act.id} className="d-flex align-items-start gap-2.5 mb-3">
                                            <div className="p-1 rounded-circle bg-light border text-muted flex-shrink-0" style={{ width: '24px', height: '24px', textAlign: 'center', fontSize: '0.7rem' }}>
                                                •
                                            </div>
                                            <div>
                                                <div className="small fw-semibold" style={{ color: 'var(--cp-text-main)' }}>
                                                    <span className="text-primary">{act.user}</span> {act.action}
                                                </div>
                                                <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                                                    {act.timestamp ? new Date(act.timestamp).toLocaleString() : ''}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* RIGHT COLUMN: Status, Approvals, Assignee, Sprint, Priority, Dates, Labels */}
                    <Col lg={4}>
                        <div className="p-3.5 rounded-3" style={{ backgroundColor: 'var(--cp-card-subtle, #F8FAFC)', border: '1px solid var(--cp-border-subtle, rgba(0,0,0,0.06))' }}>
                            {/* Status Transition Selector */}
                            <div className="mb-3.5">
                                <label className="fw-bold small text-muted text-uppercase mb-1.5 d-block">
                                    Status Transition
                                </label>
                                <Form.Select
                                    value={status}
                                    onChange={(e) => handleStatusTransition(e.target.value)}
                                    className="cp-input fw-semibold"
                                    style={{ borderRadius: '10px' }}
                                >
                                    <option value="Backlog">Backlog</option>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="In Review">In Review</option>
                                    <option value="Awaiting Approval">Awaiting Approval</option>
                                    <option value="Done">Done</option>
                                </Form.Select>
                            </div>

                            {/* APPROVAL WORKFLOW PANEL */}
                            <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: 'var(--cp-card-bg, #FFFFFF)', border: '1px solid var(--cp-border, #E2E8F0)' }}>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="fw-bold small text-uppercase d-flex align-items-center gap-1.5" style={{ color: 'var(--cp-text-main)' }}>
                                        <FontAwesomeIcon icon={faShieldAlt} className="text-primary" /> Approval Workflow
                                    </span>
                                    {ticket.approvalWorkflow?.required ? (
                                        ticket.approvalWorkflow.status === 'Approved' ? (
                                            <span className="approval-badge-approved">Approved</span>
                                        ) : ticket.approvalWorkflow.status === 'Pending' ? (
                                            <span className="approval-badge-pending">Pending</span>
                                        ) : (
                                            <span className="approval-badge-rejected">Changes Requested</span>
                                        )
                                    ) : (
                                        <span className="badge bg-light text-muted border">Not Required</span>
                                    )}
                                </div>

                                {ticket.approvalWorkflow?.required && (
                                    <>
                                        <div className="small text-muted mb-2" style={{ fontSize: '0.78rem' }}>
                                            Required Approver: <strong style={{ color: 'var(--cp-text-main)' }}>{ticket.approvalWorkflow.approverRoleName || 'Project Manager / Architect'}</strong>
                                        </div>

                                        {ticket.approvalWorkflow.status === 'Approved' && (
                                            <div className="small text-success mb-2 p-2 rounded" style={{ backgroundColor: 'rgba(16,185,129,0.08)', fontSize: '0.76rem' }}>
                                                <div>Signed off by <strong>{ticket.approvalWorkflow.approvedBy}</strong></div>
                                                {ticket.approvalWorkflow.approvalNotes && <div className="mt-1 font-italic">"{ticket.approvalWorkflow.approvalNotes}"</div>}
                                            </div>
                                        )}

                                        {/* Action buttons */}
                                        <div className="d-flex gap-2 mt-2">
                                            <Button
                                                size="sm"
                                                variant="success"
                                                className="w-100 rounded-pill fw-semibold d-inline-flex align-items-center justify-content-center gap-1"
                                                style={{ fontSize: '0.75rem' }}
                                                onClick={() => handleApprovalAction('Approved')}
                                            >
                                                <FontAwesomeIcon icon={faCheckCircle} /> Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                className="w-100 rounded-pill fw-semibold d-inline-flex align-items-center justify-content-center gap-1"
                                                style={{ fontSize: '0.75rem' }}
                                                onClick={() => handleApprovalAction('Changes Requested')}
                                            >
                                                <FontAwesomeIcon icon={faTimesCircle} /> Request Changes
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Assignee Picker */}
                            <div className="mb-3">
                                <label className="fw-bold small text-muted text-uppercase mb-1 d-block">
                                    Assignee
                                </label>
                                <Form.Select
                                    value={assigneeId}
                                    onChange={(e) => {
                                        setAssigneeId(e.target.value);
                                        handleSaveField('assigneeId', e.target.value);
                                    }}
                                    className="cp-input"
                                    style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                                >
                                    <option value="">Unassigned</option>
                                    {teamMembers.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} ({m.roleTitle || 'Dev'})
                                        </option>
                                    ))}
                                </Form.Select>

                                {/* Assignee Notification Dispatch Card */}
                                {currentAssignee && (
                                    <div className="p-3 mt-2 rounded-3" style={{ backgroundColor: 'var(--cp-card-bg, #FFFFFF)', border: '1px solid var(--cp-border, #E2E8F0)' }}>
                                        <div className="d-flex align-items-center gap-2.5 mb-2">
                                            <img 
                                                src={currentAssignee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                                                alt={currentAssignee.name}
                                                className="jira-avatar-sm"
                                            />
                                            <div className="flex-grow-1 min-w-0">
                                                <div className="fw-bold small text-truncate" style={{ color: 'var(--cp-text-main)', fontSize: '0.82rem' }}>
                                                    {currentAssignee.name}
                                                </div>
                                                <small className="text-muted d-block text-truncate" style={{ fontSize: '0.72rem' }}>
                                                    {currentAssignee.email}
                                                </small>
                                            </div>
                                        </div>

                                        {/* Action Buttons for Assignment Dispatch */}
                                        <div className="d-flex flex-column gap-1.5 mt-2">
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                className="rounded-pill w-100 py-1 fw-semibold d-inline-flex align-items-center justify-content-center gap-1.5"
                                                style={{ fontSize: '0.75rem' }}
                                                onClick={handleSendAssignmentEmail}
                                                title={`Send assignment notification email to ${currentAssignee.email}`}
                                            >
                                                <FontAwesomeIcon icon={faPaperPlane} /> Send Assignment Email
                                            </Button>

                                            {currentAssignee.phone ? (
                                                <a
                                                    href={`https://wa.me/${currentAssignee.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`*KOSHER CODE JIRA - TICKET ASSIGNMENT*\nHello ${currentAssignee.name},\nTicket: ${ticket.key} - ${ticket.title}\nPriority: ${ticket.priority}\nSprint: ${sprints.find(s => s.id === ticket.sprintId)?.name || 'Active'}\nPortal: ${window.location.origin}/admin/tickets`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="jira-whatsapp-btn w-100 justify-content-center py-1 text-center"
                                                    style={{ fontSize: '0.75rem' }}
                                                    title="Notify on WhatsApp"
                                                >
                                                    <FontAwesomeIcon icon={faWhatsapp} /> Notify on WhatsApp
                                                </a>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    className="rounded-pill w-100 py-1 fw-semibold d-inline-flex align-items-center justify-content-center gap-1.5"
                                                    style={{ fontSize: '0.74rem' }}
                                                    onClick={() => {
                                                        const text = `*Kosher Code Jira Ticket Assignment*\nAssignee: ${currentAssignee.name}\nTicket: ${ticket.key} - ${ticket.title}\nPriority: ${ticket.priority}\nStatus: ${ticket.status}\nLink: ${window.location.origin}/admin/tickets`;
                                                        navigator.clipboard.writeText(text);
                                                        toast.success('Assignment brief copied to clipboard!');
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faCopy} /> Copy Ticket Summary
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Reporter */}
                            <div className="mb-3">
                                <label className="fw-bold small text-muted text-uppercase mb-1 d-block">
                                    Reporter
                                </label>
                                <Form.Select
                                    value={reporterId}
                                    onChange={(e) => {
                                        setReporterId(e.target.value);
                                        handleSaveField('reporterId', e.target.value);
                                    }}
                                    className="cp-input"
                                    style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                                >
                                    {teamMembers.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>

                            {/* Sprint */}
                            <div className="mb-3">
                                <label className="fw-bold small text-muted text-uppercase mb-1 d-block">
                                    Sprint Cycle
                                </label>
                                <Form.Select
                                    value={sprintId}
                                    onChange={(e) => {
                                        setSprintId(e.target.value);
                                        handleSaveField('sprintId', e.target.value);
                                    }}
                                    className="cp-input"
                                    style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                                >
                                    <option value="">Backlog (Unscheduled)</option>
                                    {sprints.map(sp => (
                                        <option key={sp.id} value={sp.id}>
                                            {sp.name} {sp.status === 'active' ? '(Active)' : ''}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>

                            {/* Priority & Story Points in 2 columns */}
                            <Row className="g-2 mb-3">
                                <Col xs={6}>
                                    <label className="fw-bold small text-muted text-uppercase mb-1 d-block">
                                        Priority
                                    </label>
                                    <Form.Select
                                        value={priority}
                                        onChange={(e) => {
                                            setPriority(e.target.value);
                                            handleSaveField('priority', e.target.value);
                                        }}
                                        className="cp-input"
                                        style={{ borderRadius: '10px', fontSize: '0.82rem' }}
                                    >
                                        <option value="Highest">Highest</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                        <option value="Lowest">Lowest</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={6}>
                                    <label className="fw-bold small text-muted text-uppercase mb-1 d-block">
                                        Story Points
                                    </label>
                                    <Form.Select
                                        value={storyPoints}
                                        onChange={(e) => {
                                            const pts = parseInt(e.target.value, 10);
                                            setStoryPoints(pts);
                                            handleSaveField('storyPoints', pts);
                                        }}
                                        className="cp-input"
                                        style={{ borderRadius: '10px', fontSize: '0.82rem' }}
                                    >
                                        {[1, 2, 3, 5, 8, 13, 21].map(pt => (
                                            <option key={pt} value={pt}>{pt} points</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>

                            {/* Due Date */}
                            <div className="mb-3">
                                <label className="fw-bold small text-muted text-uppercase mb-1 d-block">
                                    Target Due Date
                                </label>
                                <Form.Control
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => {
                                        setDueDate(e.target.value);
                                        handleSaveField('dueDate', e.target.value);
                                    }}
                                    className="cp-input"
                                    style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                                />
                            </div>

                            {/* Labels & Tags */}
                            <div className="mb-4">
                                <label className="fw-bold small text-muted text-uppercase mb-1 d-block">
                                    Labels
                                </label>
                                <div className="d-flex flex-wrap gap-1.5 mb-2">
                                    {labels.map((lbl, idx) => (
                                        <span key={idx} className="jira-tag-pill d-inline-flex align-items-center gap-1">
                                            {lbl}
                                            <span 
                                                style={{ cursor: 'pointer', fontWeight: 'bold' }} 
                                                onClick={() => handleRemoveLabel(lbl)}
                                                title="Remove tag"
                                            >
                                                ×
                                            </span>
                                        </span>
                                    ))}
                                </div>
                                <Form onSubmit={handleAddLabel} className="d-flex gap-1.5">
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        className="cp-input rounded-pill"
                                        placeholder="Add tag and hit Enter..."
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                    />
                                </Form>
                            </div>

                            {/* Delete Ticket Button */}
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="w-100 rounded-pill fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
                                onClick={handleDelete}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} /> Archive / Delete Ticket
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer className="border-0 px-4 pb-4 pt-0">
                <Button 
                    variant="secondary" 
                    className="rounded-pill px-4 fw-semibold"
                    onClick={onHide}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TicketDetailModal;
