import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBookmark, 
    faBug, 
    faCheckSquare, 
    faBolt, 
    faExchangeAlt,
    faArrowUp,
    faArrowDown,
    faEquals,
    faAngleDoubleUp,
    faClock,
    faCheckCircle,
    faExclamationTriangle,
    faTasks,
    faCommentDots
} from '@fortawesome/free-solid-svg-icons';

const typeIcons = {
    'Story': { icon: faBookmark, color: '#10B981', border: '#10B981' },
    'Bug': { icon: faBug, color: '#EF4444', border: '#EF4444' },
    'Task': { icon: faCheckSquare, color: '#3B82F6', border: '#3B82F6' },
    'Epic': { icon: faBolt, color: '#8B5CF6', border: '#8B5CF6' },
    'Change Request': { icon: faExchangeAlt, color: '#F59E0B', border: '#F59E0B' }
};

const priorityIcons = {
    'Highest': { icon: faAngleDoubleUp, color: '#DC2626', label: 'Highest' },
    'High': { icon: faArrowUp, color: '#EA580C', label: 'High' },
    'Medium': { icon: faEquals, color: '#EAB308', label: 'Medium' },
    'Low': { icon: faArrowDown, color: '#3B82F6', label: 'Low' },
    'Lowest': { icon: faArrowDown, color: '#94A3B8', label: 'Lowest' }
};

const TicketCard = ({ 
    ticket, 
    assignee, 
    onCardClick, 
    onStatusChange, 
    onQuickApprove,
    availableStatuses = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Awaiting Approval', 'Done'] 
}) => {
    const typeMeta = typeIcons[ticket.type] || typeIcons['Task'];
    const priorityMeta = priorityIcons[ticket.priority] || priorityIcons['Medium'];
    const completedSubtasks = (ticket.subtasks || []).filter(st => st.completed).length;
    const totalSubtasks = (ticket.subtasks || []).length;

    const handleDropdownSelect = (eventKey, e) => {
        e.stopPropagation();
        if (eventKey && onStatusChange) {
            onStatusChange(ticket.id, eventKey);
        }
    };

    return (
        <div 
            className="jira-card"
            onClick={() => onCardClick(ticket)}
            title="Click to view & edit ticket details"
        >
            {/* Color indicator bar on the left */}
            <div 
                className="jira-card-type-bar" 
                style={{ backgroundColor: typeMeta.border }}
            />

            {/* Header: Key, Type, and Quick Move Dropdown */}
            <div className="jira-card-header">
                <div className="d-flex align-items-center gap-1.5">
                    <span 
                        title={`Issue Type: ${ticket.type}`}
                        style={{ color: typeMeta.color, fontSize: '0.85rem' }}
                    >
                        <FontAwesomeIcon icon={typeMeta.icon} />
                    </span>
                    <span className="jira-card-key">{ticket.key}</span>
                </div>

                <div className="d-flex align-items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Dropdown onSelect={handleDropdownSelect}>
                        <Dropdown.Toggle 
                            variant="link" 
                            size="sm" 
                            className="p-0 text-muted border-0 text-decoration-none shadow-none"
                            style={{ fontSize: '0.74rem' }}
                        >
                            <span 
                                className="badge rounded-pill"
                                style={{ 
                                    backgroundColor: 'var(--cp-card-subtle, #F1F5F9)', 
                                    color: 'var(--cp-text-muted, #64748B)',
                                    fontWeight: 600,
                                    fontSize: '0.7rem'
                                }}
                            >
                                Move ▾
                            </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu align="end" className="shadow-sm border-0" style={{ fontSize: '0.8rem', borderRadius: '10px' }}>
                            <Dropdown.Header style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                                Move Status To:
                            </Dropdown.Header>
                            {availableStatuses.map(status => (
                                <Dropdown.Item 
                                    key={status} 
                                    eventKey={status}
                                    active={ticket.status === status}
                                    className="d-flex align-items-center justify-content-between"
                                >
                                    {status}
                                    {ticket.status === status && <span className="text-primary small">✓</span>}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            {/* Title */}
            <div className="jira-card-title">
                {ticket.title}
            </div>

            {/* Tags / Labels */}
            {ticket.labels && ticket.labels.length > 0 && (
                <div className="jira-card-tags">
                    {ticket.labels.slice(0, 3).map((lbl, idx) => (
                        <span key={idx} className="jira-tag-pill">
                            {lbl}
                        </span>
                    ))}
                    {ticket.labels.length > 3 && (
                        <span className="jira-tag-pill">+{ticket.labels.length - 3}</span>
                    )}
                </div>
            )}

            {/* Approval Notice / Button if required */}
            {ticket.approvalWorkflow?.required && (
                <div className="mb-2.5 d-flex align-items-center justify-content-between">
                    {ticket.approvalWorkflow.status === 'Approved' ? (
                        <span className="approval-badge-approved">
                            <FontAwesomeIcon icon={faCheckCircle} /> Approved
                        </span>
                    ) : ticket.approvalWorkflow.status === 'Pending' ? (
                        <span className="approval-badge-pending">
                            <FontAwesomeIcon icon={faClock} /> Awaiting Sign-off
                        </span>
                    ) : (
                        <span className="approval-badge-rejected">
                            <FontAwesomeIcon icon={faExclamationTriangle} /> Changes Requested
                        </span>
                    )}

                    {ticket.approvalWorkflow.status === 'Pending' && onQuickApprove && (
                        <button
                            type="button"
                            className="btn btn-xs rounded-pill py-0.5 px-2.5 fw-bold"
                            style={{ 
                                fontSize: '0.68rem', 
                                backgroundColor: '#10B981', 
                                color: '#FFFFFF',
                                border: 'none'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onQuickApprove(ticket.id);
                            }}
                            title="Quick Approve as Super Administrator"
                        >
                            Approve
                        </button>
                    )}
                </div>
            )}

            {/* Footer: Priority, Subtasks progress, Comments count, Assignee avatar */}
            <div className="jira-card-footer">
                <div className="d-flex align-items-center gap-2">
                    {/* Priority Icon */}
                    <span 
                        title={`Priority: ${ticket.priority}`}
                        style={{ color: priorityMeta.color, fontSize: '0.85rem' }}
                    >
                        <FontAwesomeIcon icon={priorityMeta.icon} />
                    </span>

                    {/* Story Points */}
                    {ticket.storyPoints !== undefined && (
                        <span className="jira-points-badge" title={`${ticket.storyPoints} Story Points`}>
                            {ticket.storyPoints} pts
                        </span>
                    )}

                    {/* Subtasks counter */}
                    {totalSubtasks > 0 && (
                        <span 
                            className="small text-muted d-inline-flex align-items-center gap-1"
                            style={{ fontSize: '0.72rem' }}
                            title={`${completedSubtasks} of ${totalSubtasks} subtasks completed`}
                        >
                            <FontAwesomeIcon icon={faTasks} />
                            {completedSubtasks}/{totalSubtasks}
                        </span>
                    )}

                    {/* Comments counter */}
                    {ticket.comments && ticket.comments.length > 0 && (
                        <span 
                            className="small text-muted d-inline-flex align-items-center gap-1"
                            style={{ fontSize: '0.72rem' }}
                            title={`${ticket.comments.length} comments`}
                        >
                            <FontAwesomeIcon icon={faCommentDots} />
                            {ticket.comments.length}
                        </span>
                    )}
                </div>

                {/* Assignee Avatar */}
                <div className="d-flex align-items-center">
                    {assignee ? (
                        <img 
                            src={assignee.avatar} 
                            alt={assignee.name}
                            className="jira-avatar-sm"
                            title={`Assignee: ${assignee.name} (${assignee.roleTitle || 'Developer'})`}
                        />
                    ) : (
                        <div 
                            className="jira-avatar-sm d-flex align-items-center justify-content-center bg-secondary text-white"
                            style={{ fontSize: '0.68rem', fontWeight: 700 }}
                            title="Unassigned"
                        >
                            ?
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
