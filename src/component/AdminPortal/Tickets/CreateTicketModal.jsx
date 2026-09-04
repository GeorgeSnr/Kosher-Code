import React, { useState } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faBookmark, 
    faBug, 
    faCheckSquare, 
    faBolt, 
    faExchangeAlt,
    faShieldAlt,
    faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const CreateTicketModal = ({
    show,
    onHide,
    onCreateTicket,
    teamMembers = [],
    sprints = [],
    currentUser = null
}) => {
    const [type, setType] = useState('Story');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [assigneeId, setAssigneeId] = useState('');
    const [sprintId, setSprintId] = useState('sprint-1');
    const [storyPoints, setStoryPoints] = useState(3);
    const [dueDate, setDueDate] = useState('');
    const [labelsInput, setLabelsInput] = useState('');
    const [requiresApproval, setRequiresApproval] = useState(false);
    const [approverRoleId, setApproverRoleId] = useState('role-pm');

    const handleTypeChange = (newType) => {
        setType(newType);
        // Auto-suggest approval for Change Requests and Epics
        if (newType === 'Change Request' || newType === 'Epic') {
            setRequiresApproval(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Please enter a ticket summary/title');
            return;
        }

        const labels = labelsInput
            .split(',')
            .map(l => l.trim())
            .filter(Boolean);

        const ticketData = {
            type,
            title: title.trim(),
            description: description.trim(),
            priority,
            assigneeId: assigneeId || (teamMembers[0]?.id || ''),
            reporterId: currentUser?.email ? (teamMembers.find(m => m.email === currentUser.email)?.id || 'tm-1') : 'tm-1',
            sprintId,
            storyPoints: parseInt(storyPoints, 10) || 3,
            dueDate: dueDate || '',
            labels: labels.length > 0 ? labels : ['General'],
            status: 'To Do',
            subtasks: [],
            approvalWorkflow: {
                required: requiresApproval,
                status: requiresApproval ? 'Pending' : 'None',
                approverRoleId: requiresApproval ? approverRoleId : '',
                approverRoleName: approverRoleId === 'role-superadmin' 
                    ? 'Super Administrator' 
                    : approverRoleId === 'role-architect' 
                        ? 'Solution Architect' 
                        : 'Project Manager (PM)',
                approvedBy: '',
                approvedAt: null,
                approvalNotes: ''
            }
        };

        onCreateTicket(ticketData);
        toast.success('Ticket created successfully!');

        // Reset form
        setTitle('');
        setDescription('');
        setLabelsInput('');
        setDueDate('');
        setRequiresApproval(false);
        onHide();
    };

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            size="lg" 
            centered 
            contentClassName="jira-modal-content"
        >
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
                    <div className="d-flex align-items-center gap-2">
                        <div 
                            className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: '#0672CB', width: '38px', height: '38px', borderRadius: '8px' }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div>
                            <h5 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main, #0F172A)' }}>
                                Create Jira Issue
                            </h5>
                            <small className="text-muted">
                                Log a story, bug, task, epic, or architectural change request
                            </small>
                        </div>
                    </div>
                </Modal.Header>

                <Modal.Body className="px-4 py-3">
                    {/* Issue Type Selector */}
                    <div className="mb-3">
                        <Form.Label className="fw-bold small text-muted text-uppercase mb-1">
                            Issue Type *
                        </Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                            {[
                                { id: 'Story', icon: faBookmark, color: '#10B981' },
                                { id: 'Bug', icon: faBug, color: '#EF4444' },
                                { id: 'Task', icon: faCheckSquare, color: '#3B82F6' },
                                { id: 'Epic', icon: faBolt, color: '#8B5CF6' },
                                { id: 'Change Request', icon: faExchangeAlt, color: '#F59E0B' }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleTypeChange(item.id)}
                                    className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 border-0 ${type === item.id ? 'text-white' : ''}`}
                                    style={{
                                        backgroundColor: type === item.id ? item.color : 'var(--cp-card-subtle, #F1F5F9)',
                                        color: type === item.id ? '#FFFFFF' : 'var(--cp-text-muted, #64748B)'
                                    }}
                                >
                                    <FontAwesomeIcon icon={item.icon} />
                                    {item.id}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Summary / Title */}
                    <div className="mb-3">
                        <Form.Label className="fw-bold small text-muted text-uppercase mb-1">
                            Summary / Title *
                        </Form.Label>
                        <Form.Control
                            type="text"
                            className="cp-input"
                            style={{ borderRadius: '12px', fontSize: '0.9rem', padding: '12px 16px' }}
                            placeholder="e.g. ISO 8583 Adapter for Commercial Bank Switch"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <Form.Label className="fw-bold small text-muted text-uppercase mb-1">
                            Description
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            className="cp-input"
                            style={{ borderRadius: '12px', fontSize: '0.88rem' }}
                            placeholder="Describe technical requirements, expected behavior, or scope details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Assignee & Sprint in 2 cols */}
                    <Row className="g-3 mb-3">
                        <Col md={6}>
                            <Form.Label className="fw-bold small text-muted text-uppercase mb-1">
                                Assignee
                            </Form.Label>
                            <Form.Select
                                value={assigneeId}
                                onChange={(e) => setAssigneeId(e.target.value)}
                                className="cp-input"
                                style={{ borderRadius: '12px', fontSize: '0.86rem' }}
                            >
                                <option value="">Select Developer / Assignee</option>
                                {teamMembers.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} — {m.roleTitle || 'Developer'}
                                    </option>
                                ))}
                            </Form.Select>
                            <small className="text-muted d-block mt-1" style={{ fontSize: '0.72rem' }}>
                                <FontAwesomeIcon icon={faPaperPlane} className="text-primary me-1" />
                                Assignee will receive an automated email notice upon creation
                            </small>
                        </Col>

                        <Col md={6}>
                            <Form.Label className="fw-bold small text-muted text-uppercase mb-1">
                                Sprint / Milestone
                            </Form.Label>
                            <Form.Select
                                value={sprintId}
                                onChange={(e) => setSprintId(e.target.value)}
                                className="cp-input"
                                style={{ borderRadius: '12px', fontSize: '0.86rem' }}
                            >
                                <option value="">Backlog (Unscheduled)</option>
                                {sprints.map(sp => (
                                    <option key={sp.id} value={sp.id}>
                                        {sp.name} {sp.status === 'active' ? '(Active)' : ''}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>

                    {/* Priority, Story Points, Due Date in 3 cols */}
                    <Row className="g-3 mb-3">
                        <Col md={4}>
                            <Form.Label className="fw-bold small text-muted text-uppercase mb-1">
                                Priority
                            </Form.Label>
                            <Form.Select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="cp-input"
                                style={{ borderRadius: '12px', fontSize: '0.86rem' }}
                            >
                                <option value="Highest">Highest ⚡</option>
                                <option value="High">High ↑</option>
                                <option value="Medium">Medium =</option>
                                <option value="Low">Low ↓</option>
                                <option value="Lowest">Lowest</option>
                            </Form.Select>
                        </Col>

                        <Col md={4}>
                            <Form.Label className="fw-bold small text-muted text-uppercase mb-1">
                                Story Points
                            </Form.Label>
                            <Form.Select
                                value={storyPoints}
                                onChange={(e) => setStoryPoints(e.target.value)}
                                className="cp-input"
                                style={{ borderRadius: '12px', fontSize: '0.86rem' }}
                            >
                                {[1, 2, 3, 5, 8, 13, 21].map(pt => (
                                    <option key={pt} value={pt}>{pt} points</option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col md={4}>
                            <Form.Label className="fw-bold small text-muted text-uppercase mb-1">
                                Target Due Date
                            </Form.Label>
                            <Form.Control
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="cp-input"
                                style={{ borderRadius: '12px', fontSize: '0.86rem' }}
                            />
                        </Col>
                    </Row>

                    {/* Labels */}
                    <div className="mb-3">
                        <Form.Label className="fw-bold small text-muted text-uppercase mb-1">
                            Labels / Components (comma separated)
                        </Form.Label>
                        <Form.Control
                            type="text"
                            className="cp-input"
                            style={{ borderRadius: '12px', fontSize: '0.86rem' }}
                            placeholder="e.g. CoreBanking, Switch, MoMo, Security"
                            value={labelsInput}
                            onChange={(e) => setLabelsInput(e.target.value)}
                        />
                    </div>

                    {/* Approval Workflow Toggle & Approver Picker */}
                    <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--cp-card-subtle, #F8FAFC)', border: '1px solid var(--cp-border-subtle, rgba(0,0,0,0.06))' }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-primary" />
                                <span className="fw-bold small text-uppercase" style={{ color: 'var(--cp-text-main)' }}>
                                    Require Governance Approval
                                </span>
                            </div>
                            <Form.Check 
                                type="switch"
                                id="approval-switch"
                                checked={requiresApproval}
                                onChange={(e) => setRequiresApproval(e.target.checked)}
                            />
                        </div>

                        {requiresApproval && (
                            <Row className="g-2 mt-1">
                                <Col md={12}>
                                    <Form.Label className="small text-muted mb-1">
                                        Designated Approver Role
                                    </Form.Label>
                                    <Form.Select
                                        value={approverRoleId}
                                        onChange={(e) => setApproverRoleId(e.target.value)}
                                        className="cp-input"
                                        style={{ borderRadius: '10px', fontSize: '0.84rem' }}
                                    >
                                        <option value="role-pm">Project Manager (PM)</option>
                                        <option value="role-architect">Solution Architect</option>
                                        <option value="role-superadmin">Super Administrator</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer className="border-0 px-4 pb-4 pt-1 d-flex justify-content-end gap-2">
                    <Button 
                        variant="secondary" 
                        className="px-4 fw-semibold"
                        style={{ borderRadius: '8px' }}
                        onClick={onHide}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        className="px-4 fw-semibold d-inline-flex align-items-center gap-2"
                        style={{ backgroundColor: '#0672CB', borderColor: '#0672CB', borderRadius: '8px' }}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Create Issue
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CreateTicketModal;
