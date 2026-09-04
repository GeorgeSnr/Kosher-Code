import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Table, Button, Card, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import UserAvatar from '../../Shared/UserAvatar/UserAvatar';
import { 
    addStoredAdmin, 
    getStoredAdmins, 
    fetchFirestoreUsers, 
    fetchContactInquiries,
    getFirestoreStats,
    seedFirestoreDatabase,
    checkFirebaseConnectivity
} from '../../../services/storageService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserShield, 
    faUsers, 
    faEnvelopeOpenText, 
    faDatabase, 
    faSyncAlt, 
    faCheckCircle, 
    faServer,
    faLayerGroup,
    faTags,
    faComments,
    faShoppingCart,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faReply,
    faEye
} from '@fortawesome/free-solid-svg-icons';

const MakeAdmin = () => {
    const [admins, setAdmins] = useState(getStoredAdmins());
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [dbStats, setDbStats] = useState({ services: 0, pricing: 0, reviews: 0, orders: 0, users: 0, contacts: 0, connected: false });
    const [connCheck, setConnCheck] = useState({ auth: false, firestore: false, projectId: '' });
    const [isSeeding, setIsSeeding] = useState(false);
    const [activeTab, setActiveTab] = useState('admins'); // 'admins' | 'users' | 'contacts' | 'database'
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const loadData = () => {
        setAdmins(getStoredAdmins());
        fetchFirestoreUsers().then(u => {
            if (u && u.length > 0) setUsers(u);
        });
        fetchContactInquiries().then(c => {
            if (c && c.length > 0) setContacts(c);
        });
        getFirestoreStats().then(stats => {
            setDbStats(stats);
        });
        checkFirebaseConnectivity().then(res => {
            setConnCheck(res);
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    const onSubmit = data => {
        const loading = toast.loading('Adding administrator...');
        setTimeout(() => {
            const added = addStoredAdmin(data.email);
            toast.dismiss(loading);
            if (added) {
                loadData();
                swal("Admin Added!", `"${data.email}" now has full administrator access.`, "success");
                reset();
            } else {
                toast.error('This email is already an administrator.');
            }
        }, 400);
    };

    const handlePromoteUser = (email) => {
        addStoredAdmin(email);
        loadData();
        toast.success(`Promoted ${email} to Administrator!`);
    };

    const handleSeedDatabase = async (force = false) => {
        setIsSeeding(true);
        const loading = toast.loading(force ? 'Force re-seeding Firestore database...' : 'Syncing Firestore database with default models...');
        try {
            const result = await seedFirestoreDatabase({ force });
            toast.dismiss(loading);
            setIsSeeding(false);
            if (result.success) {
                loadData();
                swal("Firestore Database Synced!", `Successfully seeded Firestore collections:\n• Services: ${result.summary.services}\n• Pricing: ${result.summary.pricing}\n• Reviews: ${result.summary.reviews}\n• Orders: ${result.summary.orders}\n• Admins: ${result.summary.users}`, "success");
            } else {
                swal("Seeding Notice", `Firestore sync encountered: ${result.error || 'Check internet connection and security rules.'}`, "warning");
            }
        } catch (e) {
            toast.dismiss(loading);
            setIsSeeding(false);
            swal("Error", e.message, "error");
        }
    };

    return (
        <div className="p-1 p-sm-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Top Navigation Tabs */}
            <div className="d-flex flex-wrap gap-2 gap-sm-3 mb-4">
                <button
                    type="button"
                    className={`btn rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 border-0 ${activeTab === 'admins' ? 'text-white' : ''}`}
                    style={{ 
                        backgroundColor: activeTab === 'admins' ? '#121417' : 'var(--cp-card-subtle)', 
                        color: activeTab === 'admins' ? '#FFFFFF' : 'var(--cp-text-muted)',
                        fontSize: '0.84rem' 
                    }}
                    onClick={() => setActiveTab('admins')}
                >
                    <FontAwesomeIcon icon={faUserShield} style={{ color: activeTab === 'admins' ? 'var(--cp-primary)' : 'inherit' }} /> 
                    Admin Team ({admins.length})
                </button>
                <button
                    type="button"
                    className={`btn rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 border-0 ${activeTab === 'users' ? 'text-white' : ''}`}
                    style={{ 
                        backgroundColor: activeTab === 'users' ? '#121417' : 'var(--cp-card-subtle)', 
                        color: activeTab === 'users' ? '#FFFFFF' : 'var(--cp-text-muted)',
                        fontSize: '0.84rem' 
                    }}
                    onClick={() => setActiveTab('users')}
                >
                    <FontAwesomeIcon icon={faUsers} style={{ color: activeTab === 'users' ? '#3B82F6' : 'inherit' }} /> 
                    Firestore Users ({users.length})
                </button>
                <button
                    type="button"
                    className={`btn rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 border-0 ${activeTab === 'contacts' ? 'text-white' : ''}`}
                    style={{ 
                        backgroundColor: activeTab === 'contacts' ? '#121417' : 'var(--cp-card-subtle)', 
                        color: activeTab === 'contacts' ? '#FFFFFF' : 'var(--cp-text-muted)',
                        fontSize: '0.84rem' 
                    }}
                    onClick={() => setActiveTab('contacts')}
                >
                    <FontAwesomeIcon icon={faEnvelopeOpenText} style={{ color: activeTab === 'contacts' ? '#EC4899' : 'inherit' }} /> 
                    Inquiries ({contacts.length})
                </button>
                <button
                    type="button"
                    className={`btn rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 border-0 ${activeTab === 'database' ? 'text-white' : ''}`}
                    style={{ 
                        backgroundColor: activeTab === 'database' ? '#121417' : 'var(--cp-card-subtle)', 
                        color: activeTab === 'database' ? '#FFFFFF' : 'var(--cp-text-muted)',
                        fontSize: '0.84rem' 
                    }}
                    onClick={() => setActiveTab('database')}
                >
                    <FontAwesomeIcon icon={faDatabase} style={{ color: activeTab === 'database' ? '#10B981' : 'inherit' }} /> 
                    Firebase Cloud Sync
                </button>
            </div>

            {/* TAB 1: Admins Management */}
            {activeTab === 'admins' && (
                <>
                    <div 
                        className="p-4 p-md-5 mb-4"
                        style={{
                            backgroundColor: 'var(--cp-card-bg, #FFFFFF)',
                            borderRadius: '0',
                            border: '1px solid var(--cp-border-subtle, rgba(0, 0, 0, 0.06))',
                            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
                        }}
                    >
                        <div className="d-flex align-items-center gap-2 mb-1.5">
                            <span 
                                className="badge px-3 py-1"
                                style={{ 
                                    backgroundColor: 'var(--cp-primary-subtle)', 
                                    color: 'var(--cp-primary-text)',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase',
                                    borderRadius: '0'
                                }}
                            >
                                Privilege Escalation
                            </span>
                        </div>
                        <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', letterSpacing: '-0.02em' }}>
                            Add Platform Administrator
                        </h4>
                        <p className="small mb-4" style={{ color: 'var(--cp-text-muted)' }}>
                            Grant executive & technical privileges to manage incoming solution orders and configure enterprise settings.
                        </p>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row className="align-items-end g-3">
                                <Col md={8}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold mb-2" style={{ color: 'var(--cp-text-main)', fontSize: '0.86rem' }}>
                                            Administrator Email Address *
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            className="cp-input"
                                            style={{ borderRadius: '0', padding: '12px 18px', fontSize: '0.88rem' }}
                                            {...register("email", { required: true })}
                                            placeholder="e.g. director@koshercode.ug"
                                        />
                                        {errors.email && <span className="text-danger small mt-1 d-block">Valid email is required</span>}
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <button 
                                        type="submit" 
                                        className="btn w-100 text-white d-inline-flex align-items-center justify-content-center gap-2" 
                                        style={{ 
                                            backgroundColor: '#121417', 
                                            fontWeight: 600, 
                                            padding: '12px 18px', 
                                            border: 'none',
                                            fontSize: '0.88rem',
                                            borderRadius: '0'
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faUserShield} /> Grant Admin Privileges
                                    </button>
                                </Col>
                            </Row>
                        </Form>
                    </div>

                    <div 
                        className="p-4 p-md-5"
                        style={{
                            backgroundColor: 'var(--cp-card-bg, #FFFFFF)',
                            borderRadius: '0',
                            border: '1px solid var(--cp-border-subtle, rgba(0, 0, 0, 0.06))',
                            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)', letterSpacing: '-0.01em' }}>
                                Active Superadministrators ({admins.length})
                            </h5>
                            <span 
                                className="badge px-3 py-1"
                                style={{
                                    backgroundColor: 'var(--cp-card-subtle)',
                                    color: 'var(--cp-text-muted)',
                                    borderRadius: '0',
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }}
                            >
                                Executive Access Only
                            </span>
                        </div>
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 cp-table" style={{ minWidth: '560px' }}>
                                <thead>
                                    <tr>
                                        <th className="py-3 px-3" style={{ borderTop: 'none' }}>Admin Account</th>
                                        <th className="py-3 px-3" style={{ borderTop: 'none' }}>Role Clearance</th>
                                        <th className="py-3 px-3 text-end" style={{ borderTop: 'none' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((adm, i) => (
                                        <tr key={i}>
                                            <td className="fw-semibold py-3 px-3" style={{ color: 'var(--cp-text-main)' }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <UserAvatar 
                                                        name={adm}
                                                        role="admin"
                                                        size="xs"
                                                        ring={false}
                                                    />
                                                    <span style={{ fontSize: '0.9rem' }}>{adm}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span 
                                                    className="badge px-3 py-1.5"
                                                    style={{
                                                        backgroundColor: 'var(--cp-primary-subtle)',
                                                        color: 'var(--cp-primary-text)',
                                                        borderRadius: '0',
                                                        fontSize: '0.76rem',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Executive Superadmin
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-end">
                                                <span 
                                                    className="badge px-3 py-1.5 badge-status-done"
                                                    style={{ fontSize: '0.76rem', fontWeight: 600, borderRadius: '0' }}
                                                >
                                                    ● Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </>
            )}

            {/* TAB 2: Firestore Users */}
            {activeTab === 'users' && (
                <div 
                    className="p-4 p-md-5"
                    style={{
                        backgroundColor: 'var(--cp-card-bg, #FFFFFF)',
                        borderRadius: '0',
                        border: '1px solid var(--cp-border-subtle, rgba(0, 0, 0, 0.06))',
                        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
                    }}
                >
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1.5">
                                <span 
                                    className="badge px-3 py-1"
                                    style={{ 
                                        backgroundColor: 'var(--cp-primary-subtle)', 
                                        color: 'var(--cp-primary-text)',
                                        fontSize: '0.74rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        borderRadius: '0'
                                    }}
                                >
                                    Directory
                                </span>
                            </div>
                            <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', letterSpacing: '-0.02em' }}>
                                Cloud Firestore Registered Users ({users.length})
                            </h4>
                            <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>
                                Profiles synchronized in real-time across Firebase Authentication and Firestore 'users' collection.
                            </p>
                        </div>
                        <Button 
                            className="btn-sm px-3.5 py-1.5 d-inline-flex align-items-center gap-1.5"
                            variant="outline-secondary" 
                            style={{ fontSize: '0.82rem', fontWeight: 600, borderColor: 'var(--cp-border)', borderRadius: '0' }}
                            onClick={loadData}
                        >
                            <FontAwesomeIcon icon={faSyncAlt} /> Refresh List
                        </Button>
                    </div>

                    {users.length === 0 ? (
                        <div className="text-center py-5">
                            <FontAwesomeIcon icon={faUsers} style={{ fontSize: '2.5rem', color: 'var(--cp-text-muted)' }} className="mb-2" />
                            <p className="fw-semibold mb-0" style={{ color: 'var(--cp-text-muted)' }}>No external users recorded yet. Create an account in the Portal Login to register.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 cp-table" style={{ minWidth: '700px' }}>
                                <thead>
                                    <tr>
                                        <th className="py-3 px-3" style={{ borderTop: 'none' }}>User & Identity</th>
                                        <th className="py-3 px-3" style={{ borderTop: 'none' }}>Institution / Org</th>
                                        <th className="py-3 px-3" style={{ borderTop: 'none' }}>Platform Role</th>
                                        <th className="py-3 px-3 text-end" style={{ borderTop: 'none' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, idx) => (
                                        <tr key={u.id || idx}>
                                            <td className="fw-semibold py-3 px-3" style={{ color: 'var(--cp-text-main)' }}>
                                                <div className="d-flex align-items-center gap-2.5">
                                                    <UserAvatar name={u.name || u.email} role={u.role} size="xs" />
                                                    <div>
                                                        <div style={{ fontSize: '0.88rem' }}>{u.name || u.email.split('@')[0]}</div>
                                                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.74rem' }}>{u.email}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 small" style={{ color: 'var(--cp-text-muted)' }}>{u.institution || '—'}</td>
                                            <td className="py-3 px-3">
                                                <span 
                                                    className={`badge px-3 py-1.5 ${u.role === 'admin' ? 'badge-status-review' : 'badge-status-progress'}`}
                                                    style={{ fontSize: '0.76rem', fontWeight: 600, borderRadius: '0' }}
                                                >
                                                    {u.role || 'client'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-end">
                                                {u.role !== 'admin' && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline-primary"
                                                        className="px-3 py-1"
                                                        style={{ fontSize: '0.78rem', fontWeight: 600, borderRadius: '0' }}
                                                        onClick={() => handlePromoteUser(u.email)}
                                                    >
                                                        Promote to Admin
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: Contact Inquiries */}
            {activeTab === 'contacts' && (
                <div 
                    className="p-4 p-md-5"
                    style={{
                        backgroundColor: 'var(--cp-card-bg, #FFFFFF)',
                        borderRadius: '0',
                        border: '1px solid var(--cp-border-subtle, rgba(0, 0, 0, 0.06))',
                        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
                    }}
                >
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1.5">
                                <span 
                                    className="badge px-3 py-1"
                                    style={{ 
                                        backgroundColor: 'rgba(236, 72, 153, 0.12)', 
                                        color: '#EC4899',
                                        fontSize: '0.74rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        borderRadius: '0'
                                    }}
                                >
                                    Inbound Pipeline
                                </span>
                            </div>
                            <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', letterSpacing: '-0.02em' }}>
                                Enterprise Consultation Requests ({contacts.length})
                            </h4>
                            <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>
                                Demo requests and enterprise inquiries submitted through the website Contact form.
                            </p>
                        </div>
                        <Button 
                            className="btn-sm px-3.5 py-1.5 d-inline-flex align-items-center gap-1.5"
                            variant="outline-secondary" 
                            style={{ fontSize: '0.82rem', fontWeight: 600, borderColor: 'var(--cp-border)', borderRadius: '0' }}
                            onClick={loadData}
                        >
                            <FontAwesomeIcon icon={faSyncAlt} /> Refresh Inquiries
                        </Button>
                    </div>

                    {contacts.length === 0 ? (
                        <div className="text-center py-5">
                            <FontAwesomeIcon icon={faEnvelopeOpenText} style={{ fontSize: '2.5rem', color: 'var(--cp-text-muted)' }} className="mb-2" />
                            <p className="fw-semibold mb-0" style={{ color: 'var(--cp-text-muted)' }}>No contact inquiries logged yet.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 cp-table" style={{ minWidth: '780px' }}>
                                <thead>
                                    <tr>
                                        <th className="py-3 px-3" style={{ borderTop: 'none', width: '220px' }}>Client Contact</th>
                                        <th className="py-3 px-3" style={{ borderTop: 'none', width: '180px' }}>Institution & Region</th>
                                        <th className="py-3 px-3" style={{ borderTop: 'none' }}>Subject & Scope</th>
                                        <th className="py-3 px-3" style={{ borderTop: 'none', width: '110px' }}>Date</th>
                                        <th className="py-3 px-3 text-end" style={{ borderTop: 'none', width: '90px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((c, idx) => (
                                        <tr 
                                            key={c._id || idx} 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setSelectedInquiry(c);
                                                setShowInquiryModal(true);
                                            }}
                                            title="Click to view full inquiry details"
                                        >
                                            <td className="fw-semibold py-3 px-3" style={{ color: 'var(--cp-text-main)' }}>
                                                <div style={{ fontSize: '0.88rem' }} className="text-truncate">{c.name}</div>
                                                <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.74rem' }} className="text-truncate d-block">{c.email}</small>
                                            </td>
                                            <td className="py-3 px-3 small">
                                                <div style={{ color: 'var(--cp-text-main)', fontWeight: 600 }} className="text-truncate">{c.institution || 'General'}</div>
                                                <small style={{ color: 'var(--cp-text-muted)' }} className="text-truncate d-block">{c.region || 'Uganda & Global'}</small>
                                            </td>
                                            <td className="py-3 px-3 small">
                                                <div className="fw-semibold text-truncate" style={{ color: 'var(--cp-text-main)', maxWidth: '280px' }}>{c.subject || 'Consultation Request'}</div>
                                                <small style={{ color: 'var(--cp-text-muted)', maxWidth: '300px' }} className="text-truncate d-block">{c.description || 'No description provided'}</small>
                                            </td>
                                            <td className="py-3 px-3 small" style={{ color: 'var(--cp-text-muted)' }}>
                                                {c.date || 'Recent'}
                                            </td>
                                            <td className="py-3 px-3 text-end" onClick={(e) => e.stopPropagation()}>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline-secondary"
                                                    className="px-3 py-1 d-inline-flex align-items-center gap-1.5"
                                                    style={{ fontSize: '0.78rem', fontWeight: 600, borderColor: 'var(--cp-border)', backgroundColor: 'var(--cp-card-subtle)', borderRadius: '0' }}
                                                    onClick={() => {
                                                        setSelectedInquiry(c);
                                                        setShowInquiryModal(true);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faEye} style={{ color: 'var(--cp-primary)' }} /> View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 4: Firebase Database Management & Sync Tool */}
            {activeTab === 'database' && (
                <div 
                    className="p-4 p-md-5"
                    style={{
                        backgroundColor: 'var(--cp-card-bg, #FFFFFF)',
                        borderRadius: '0',
                        border: '1px solid var(--cp-border-subtle, rgba(0, 0, 0, 0.06))',
                        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
                    }}
                >
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1.5">
                                <span 
                                    className="badge px-3 py-1"
                                    style={{ 
                                        backgroundColor: 'rgba(16, 185, 129, 0.12)', 
                                        color: '#10B981',
                                        fontSize: '0.74rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        borderRadius: '0'
                                    }}
                                >
                                    Cloud Architecture
                                </span>
                            </div>
                            <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', letterSpacing: '-0.02em' }}>
                                Cloud Firestore Database Infrastructure
                            </h4>
                            <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>
                                Real-time database health, document collections, and cloud seeding controls.
                            </p>
                        </div>
                        <div className="d-flex flex-wrap gap-2.5">
                            <Button 
                                size="sm" 
                                variant="outline-secondary"
                                onClick={loadData}
                                className="px-3.5 py-2 d-flex align-items-center gap-2 border-0"
                                style={{ backgroundColor: 'var(--cp-card-subtle)', color: 'var(--cp-text-main)', fontWeight: 600, fontSize: '0.82rem', borderRadius: '0' }}
                            >
                                <FontAwesomeIcon icon={faSyncAlt} /> Refresh Status
                            </Button>
                            <Button 
                                size="sm" 
                                className="px-4 py-2 text-white d-flex align-items-center gap-2 border-0"
                                style={{ backgroundColor: '#121417', fontWeight: 600, fontSize: '0.82rem', borderRadius: '0' }}
                                disabled={isSeeding}
                                onClick={() => handleSeedDatabase(false)}
                            >
                                <FontAwesomeIcon icon={faDatabase} /> Seed Missing Data
                            </Button>
                        </div>
                    </div>

                    {/* Connectivity & Health Status */}
                    <div 
                        className="p-4 mb-4" 
                        style={{ 
                            backgroundColor: 'var(--cp-card-subtle)', 
                            border: '1px solid var(--cp-border)',
                            borderRadius: '0'
                        }}
                    >
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <div 
                                    className="d-flex align-items-center justify-content-center rounded-circle" 
                                    style={{ 
                                        width: '44px', 
                                        height: '44px', 
                                        backgroundColor: 'var(--cp-card-bg)', 
                                        color: 'var(--cp-primary)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <FontAwesomeIcon icon={faServer} style={{ fontSize: '1.2rem' }} />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>
                                        Firebase Project: {connCheck.projectId || 'kosher-code-consulting'}
                                    </h6>
                                    <small style={{ color: 'var(--cp-text-muted)' }}>
                                        Status: {connCheck.firestore ? '● Online & Synchronized' : 'Connecting to Firestore...'}
                                    </small>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <span className="badge px-3 py-2 bg-success bg-opacity-10 text-success d-flex align-items-center gap-1.5 fw-semibold" style={{ fontSize: '0.78rem', borderRadius: '0' }}>
                                    <FontAwesomeIcon icon={faCheckCircle} /> Auth Ready
                                </span>
                                <span className="badge px-3 py-2 bg-success bg-opacity-10 text-success d-flex align-items-center gap-1.5 fw-semibold" style={{ fontSize: '0.78rem', borderRadius: '0' }}>
                                    <FontAwesomeIcon icon={faCheckCircle} /> Firestore Connected
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Collection Stats Cards */}
                    <h6 className="fw-bold mb-3" style={{ color: 'var(--cp-text-main)' }}>
                        Firestore Live Collection Documents
                    </h6>
                    <Row className="g-3 mb-4">
                        <Col xs={6} md={4} lg={2}>
                            <Card 
                                className="h-100 p-3 border-0 text-center" 
                                style={{ 
                                    backgroundColor: 'var(--cp-card-subtle)', 
                                    borderRadius: '0'
                                }}
                            >
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary)' }}>
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>SERVICES</small>
                                <h3 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.services}</h3>
                                <small className="text-muted text-truncate d-block" style={{ fontSize: '0.68rem' }}>collection: services</small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card 
                                className="h-100 p-3 border-0 text-center" 
                                style={{ 
                                    backgroundColor: 'var(--cp-card-subtle)', 
                                    borderRadius: '0'
                                }}
                            >
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}>
                                    <FontAwesomeIcon icon={faTags} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>PRICING</small>
                                <h3 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.pricing}</h3>
                                <small className="text-muted text-truncate d-block" style={{ fontSize: '0.68rem' }}>collection: pricing</small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card 
                                className="h-100 p-3 border-0 text-center" 
                                style={{ 
                                    backgroundColor: 'var(--cp-card-subtle)', 
                                    borderRadius: '0'
                                }}
                            >
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                                    <FontAwesomeIcon icon={faComments} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>REVIEWS</small>
                                <h3 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.reviews}</h3>
                                <small className="text-muted text-truncate d-block" style={{ fontSize: '0.68rem' }}>collection: reviews</small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card 
                                className="h-100 p-3 border-0 text-center" 
                                style={{ 
                                    backgroundColor: 'var(--cp-card-subtle)', 
                                    borderRadius: '0'
                                }}
                            >
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}>
                                    <FontAwesomeIcon icon={faShoppingCart} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>ORDERS</small>
                                <h3 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.orders}</h3>
                                <small className="text-muted text-truncate d-block" style={{ fontSize: '0.68rem' }}>collection: orders</small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card 
                                className="h-100 p-3 border-0 text-center" 
                                style={{ 
                                    backgroundColor: 'var(--cp-card-subtle)', 
                                    borderRadius: '0'
                                }}
                            >
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6' }}>
                                    <FontAwesomeIcon icon={faUsers} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>USERS</small>
                                <h3 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.users}</h3>
                                <small className="text-muted text-truncate d-block" style={{ fontSize: '0.68rem' }}>collection: users</small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card 
                                className="h-100 p-3 border-0 text-center" 
                                style={{ 
                                    backgroundColor: 'var(--cp-card-subtle)', 
                                    borderRadius: '0'
                                }}
                            >
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(236, 72, 153, 0.12)', color: '#EC4899' }}>
                                    <FontAwesomeIcon icon={faEnvelopeOpenText} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>INQUIRIES</small>
                                <h3 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.contacts}</h3>
                                <small className="text-muted text-truncate d-block" style={{ fontSize: '0.68rem' }}>collection: contacts</small>
                            </Card>
                        </Col>
                    </Row>

                    {/* Actions Box */}
                    <div 
                        className="p-4" 
                        style={{ 
                            backgroundColor: 'var(--cp-card-subtle)', 
                            border: '1px solid var(--cp-border)',
                            borderRadius: '0'
                        }}
                    >
                        <h6 className="fw-bold mb-2" style={{ color: 'var(--cp-text-main)' }}>
                            Database Actions & Diagnostic Operations
                        </h6>
                        <p className="small text-muted mb-3.5">
                            The application reads and writes directly to Cloud Firestore. If you want to populate all catalog collections with the latest comprehensive datasets, click below:
                        </p>
                        <div className="d-flex flex-wrap gap-3">
                            <Button 
                                size="sm" 
                                disabled={isSeeding}
                                onClick={() => handleSeedDatabase(false)}
                                className="px-4 py-2 text-white border-0 fw-semibold"
                                style={{ backgroundColor: '#121417', fontSize: '0.84rem', borderRadius: '0' }}
                            >
                                Populate Missing Firestore Documents
                            </Button>
                            <Button 
                                variant="outline-warning" 
                                size="sm" 
                                disabled={isSeeding}
                                className="px-4 py-2 fw-semibold"
                                style={{ fontSize: '0.84rem', borderRadius: '0' }}
                                onClick={() => {
                                    swal({
                                        title: "Overwrite / Re-seed Database?",
                                        text: "This will update all standard catalog services, pricing plans, and reviews in Firestore.",
                                        icon: "warning",
                                        buttons: true,
                                        dangerMode: true,
                                    }).then(confirm => {
                                        if (confirm) handleSeedDatabase(true);
                                    });
                                }}
                            >
                                Overwrite / Re-seed Catalog
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Inquiry Details Modal Dialogue */}
            {selectedInquiry && (
                <Modal
                    show={showInquiryModal}
                    onHide={() => setShowInquiryModal(false)}
                    centered
                    size="lg"
                    dialogClassName="admin-modal"
                    contentClassName="ad-card border-0 shadow-lg"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    <Modal.Header closeButton style={{ borderBottom: '1px solid var(--cp-border)', padding: '20px 26px', borderRadius: '0' }}>
                        <div className="d-flex align-items-center gap-3 overflow-hidden" style={{ minWidth: 0, flex: '1 1 auto' }}>
                            <UserAvatar name={selectedInquiry.name} size="md" ring={true} ringType="glow" />
                            <div className="overflow-hidden" style={{ minWidth: 0, flex: '1 1 auto' }}>
                                <Modal.Title className="fs-5 fw-bold mb-0 text-truncate" style={{ color: 'var(--cp-text-main)' }}>
                                    {selectedInquiry.subject || 'Enterprise Consultation Inquiry'}
                                </Modal.Title>
                                <small className="text-truncate d-block" style={{ color: 'var(--cp-text-muted)', fontSize: '0.8rem' }}>
                                    {selectedInquiry.institution || 'Organization / Independent'} &bull; {selectedInquiry.date || 'Recent Submission'}
                                </small>
                            </div>
                        </div>
                    </Modal.Header>

                    <Modal.Body className="p-4" style={{ color: 'var(--cp-text-main)', maxHeight: '78vh', overflowY: 'auto' }}>
                        <Row className="g-3 mb-4">
                            <Col md={6}>
                                <div className="p-3.5 h-100" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0' }}>
                                    <h6 className="fw-bold mb-2.5 small text-uppercase" style={{ color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>
                                        <FontAwesomeIcon icon={faEnvelope} className="me-1.5" style={{ color: 'var(--cp-primary)' }} /> Contact Identity
                                    </h6>
                                    <div className="mb-2">
                                        <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Client Name</small>
                                        <span className="fw-semibold text-truncate d-block">{selectedInquiry.name}</span>
                                    </div>
                                    <div className="mb-2">
                                        <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Email Address</small>
                                        <a 
                                            href={`mailto:${selectedInquiry.email}`} 
                                            className="fw-semibold text-decoration-none d-block"
                                            style={{ color: 'var(--cp-primary)', wordBreak: 'break-all', overflowWrap: 'anywhere', fontSize: '0.86rem' }}
                                        >
                                            {selectedInquiry.email}
                                        </a>
                                    </div>
                                    {selectedInquiry.phone && (
                                        <div>
                                            <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Phone</small>
                                            <span className="fw-semibold text-truncate d-block">{selectedInquiry.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="p-3.5 h-100" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0' }}>
                                    <h6 className="fw-bold mb-2.5 small text-uppercase" style={{ color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1.5" style={{ color: '#10B981' }} /> Scope & Institution
                                    </h6>
                                    <div className="mb-2">
                                        <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Organization / Institution</small>
                                        <span className="fw-semibold text-truncate d-block">{selectedInquiry.institution || 'Individual Inquiry'}</span>
                                    </div>
                                    <div className="mb-2">
                                        <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Target Region</small>
                                        <span className="fw-semibold text-truncate d-block">{selectedInquiry.region || 'Uganda & Global'}</span>
                                    </div>
                                    <div>
                                        <small className="d-block fw-semibold text-muted" style={{ fontSize: '0.74rem' }}>Inquiry Source</small>
                                        <span className="badge px-3 py-1 bg-success bg-opacity-10 text-success fw-semibold" style={{ fontSize: '0.76rem', borderRadius: '0' }}>
                                            Online Contact Portal
                                        </span>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <div className="p-3.5 mb-4" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', borderRadius: '0' }}>
                            <h6 className="fw-bold mb-2 small text-uppercase" style={{ color: 'var(--cp-text-muted)', letterSpacing: '0.04em' }}>
                                Inquiry Details & Requirements
                            </h6>
                            <p className="mb-0 small" style={{ lineHeight: 1.65, wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'pre-line' }}>
                                {selectedInquiry.description || 'No additional requirements details provided.'}
                            </p>
                        </div>
                    </Modal.Body>

                    <Modal.Footer style={{ borderTop: '1px solid var(--cp-border)', padding: '16px 26px', borderRadius: '0' }}>
                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100 gap-2">
                            <a
                                href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'Consultation Inquiry - Kosher Code')}`}
                                className="btn btn-sm btn-dark px-3.5 py-1.5 d-inline-flex align-items-center gap-2 text-decoration-none text-white"
                                style={{ backgroundColor: '#121417', borderColor: '#121417', fontSize: '0.82rem', fontWeight: 600, borderRadius: '0' }}
                            >
                                <FontAwesomeIcon icon={faReply} /> Reply via Email
                            </a>
                            <button
                                type="button"
                                className="btn btn-sm px-4 py-1.5"
                                style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)', color: 'var(--cp-text-main)', fontSize: '0.82rem', fontWeight: 600, borderRadius: '0' }}
                                onClick={() => setShowInquiryModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default MakeAdmin;
