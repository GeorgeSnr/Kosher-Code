import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Table, Button, Card } from 'react-bootstrap';
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
    faShoppingCart
} from '@fortawesome/free-solid-svg-icons';

const MakeAdmin = () => {
    const [admins, setAdmins] = useState(getStoredAdmins());
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
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
        <div className="p-1 p-sm-2">
            {/* Top Navigation Tabs */}
            <div className="d-flex flex-wrap gap-2.5 gap-sm-3 mb-4">
                <button
                    type="button"
                    className={`btn btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 ${activeTab === 'admins' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ borderRadius: '4px', fontSize: '0.85rem' }}
                    onClick={() => setActiveTab('admins')}
                >
                    <FontAwesomeIcon icon={faUserShield} /> Admin Team ({admins.length})
                </button>
                <button
                    type="button"
                    className={`btn btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ borderRadius: '4px', fontSize: '0.85rem' }}
                    onClick={() => setActiveTab('users')}
                >
                    <FontAwesomeIcon icon={faUsers} /> Firestore Users ({users.length})
                </button>
                <button
                    type="button"
                    className={`btn btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 ${activeTab === 'contacts' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ borderRadius: '4px', fontSize: '0.85rem' }}
                    onClick={() => setActiveTab('contacts')}
                >
                    <FontAwesomeIcon icon={faEnvelopeOpenText} /> Inbound Inquiries ({contacts.length})
                </button>
                <button
                    type="button"
                    className={`btn btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 ${activeTab === 'database' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ borderRadius: '4px', fontSize: '0.85rem' }}
                    onClick={() => setActiveTab('database')}
                >
                    <FontAwesomeIcon icon={faDatabase} /> Firebase Database & Sync
                </button>
            </div>

            {/* TAB 1: Admins Management */}
            {activeTab === 'admins' && (
                <>
                    <div className="cp-card p-4 p-md-5 mb-4" style={{ borderRadius: '8px' }}>
                        <h5 className="fw-bold mb-1.5" style={{ color: 'var(--cp-text-main)' }}>Add Platform Administrator</h5>
                        <p className="small mb-4" style={{ color: 'var(--cp-text-muted)' }}>Grant executive & technical privileges to manage incoming solution orders and configure enterprise settings.</p>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row className="align-items-end g-3">
                                <Col md={8}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold mb-2" style={{ color: 'var(--cp-text-main)', fontSize: '0.9rem' }}>Administrator Email Address *</Form.Label>
                                        <Form.Control
                                            type="email"
                                            className="cp-input"
                                            style={{ padding: '0.85rem 1rem', borderRadius: '6px' }}
                                            {...register("email", { required: true })}
                                            placeholder="e.g. director@koshercode.ug"
                                        />
                                        {errors.email && <span className="text-danger small mt-1 d-block">Valid email is required</span>}
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <button 
                                        type="submit" 
                                        className="btn w-100 text-white" 
                                        style={{ backgroundColor: 'var(--cp-primary)', borderRadius: '6px', fontWeight: 600, padding: '0.85rem 1rem', border: 'none' }}
                                    >
                                        Grant Admin Role
                                    </button>
                                </Col>
                            </Row>
                        </Form>
                    </div>

                    <div className="cp-card p-4 p-md-5" style={{ borderRadius: '8px' }}>
                        <h6 className="fw-bold mb-3.5" style={{ color: 'var(--cp-text-main)' }}>Active Administrators ({admins.length})</h6>
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 cp-table">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-3">Admin Email</th>
                                        <th className="py-3 px-3">Role Level</th>
                                        <th className="py-3 px-3 text-end">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((adm, i) => (
                                        <tr key={i}>
                                            <td className="fw-semibold py-3 px-3" style={{ color: 'var(--cp-text-main)' }}>
                                                <div className="d-flex align-items-center gap-2.5">
                                                    <UserAvatar 
                                                        name={adm}
                                                        role="admin"
                                                        size="xs"
                                                        ring={false}
                                                    />
                                                    <span>{adm}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3"><span className="badge px-2.5 py-1 badge-status-review">Full Superadmin</span></td>
                                            <td className="py-3 px-3 text-end"><span className="badge px-2.5 py-1 badge-status-done">● Active</span></td>
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
                <div className="cp-card p-4 p-md-5" style={{ borderRadius: '8px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>Cloud Firestore Registered Users</h5>
                            <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>Profiles synchronized in real-time across Firebase Authentication and Firestore 'users' collection.</p>
                        </div>
                        <Button size="sm" variant="outline-primary" onClick={loadData}>Refresh</Button>
                    </div>

                    {users.length === 0 ? (
                        <div className="text-center py-4">
                            <FontAwesomeIcon icon={faUsers} style={{ fontSize: '2.5rem', color: 'var(--cp-text-muted)' }} className="mb-2" />
                            <p className="fw-semibold mb-0" style={{ color: 'var(--cp-text-muted)' }}>No external users recorded yet. Create an account in the Portal Login to register.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 cp-table">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-3">User & Name</th>
                                        <th className="py-3 px-3">Institution / Org</th>
                                        <th className="py-3 px-3">Role</th>
                                        <th className="py-3 px-3 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, idx) => (
                                        <tr key={u.id || idx}>
                                            <td className="fw-semibold py-3 px-3" style={{ color: 'var(--cp-text-main)' }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <UserAvatar name={u.name || u.email} role={u.role} size="xs" />
                                                    <div>
                                                        <div>{u.name || u.email.split('@')[0]}</div>
                                                        <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>{u.email}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 small">{u.institution || '—'}</td>
                                            <td className="py-3 px-3">
                                                <span className={`badge px-2.5 py-1 ${u.role === 'admin' ? 'badge-status-review' : 'badge-status-progress'}`}>
                                                    {u.role || 'client'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-end">
                                                {u.role !== 'admin' && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline-primary"
                                                        style={{ fontSize: '0.75rem' }}
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
                <div className="cp-card p-4 p-md-5" style={{ borderRadius: '8px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>Inbound Enterprise Consultation Requests</h5>
                            <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>Demo requests and enterprise inquiries submitted through the website Contact form.</p>
                        </div>
                        <Button size="sm" variant="outline-primary" onClick={loadData}>Refresh</Button>
                    </div>

                    {contacts.length === 0 ? (
                        <div className="text-center py-4">
                            <FontAwesomeIcon icon={faEnvelopeOpenText} style={{ fontSize: '2.5rem', color: 'var(--cp-text-muted)' }} className="mb-2" />
                            <p className="fw-semibold mb-0" style={{ color: 'var(--cp-text-muted)' }}>No contact inquiries logged yet.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 cp-table">
                                <thead>
                                    <tr>
                                        <th className="py-3 px-3">Contact</th>
                                        <th className="py-3 px-3">Institution & Region</th>
                                        <th className="py-3 px-3">Subject & Scope</th>
                                        <th className="py-3 px-3 text-end">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((c, idx) => (
                                        <tr key={c._id || idx}>
                                            <td className="fw-semibold py-3 px-3" style={{ color: 'var(--cp-text-main)' }}>
                                                <div>{c.name}</div>
                                                <small style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem' }}>{c.email}</small>
                                            </td>
                                            <td className="py-3 px-3 small">
                                                <div>{c.institution || 'General'}</div>
                                                <small style={{ color: 'var(--cp-text-muted)' }}>{c.region}</small>
                                            </td>
                                            <td className="py-3 px-3 small">
                                                <div className="fw-semibold">{c.subject}</div>
                                                <small style={{ color: 'var(--cp-text-muted)' }}>{c.description?.substring(0, 60)}...</small>
                                            </td>
                                            <td className="py-3 px-3 text-end small" style={{ color: 'var(--cp-text-muted)' }}>
                                                {c.date || 'Recent'}
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
                <div className="cp-card p-4 p-md-5" style={{ borderRadius: '8px' }}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>Cloud Firestore Database Management</h5>
                            <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>Real-time database health, document collections, and cloud seeding controls.</p>
                        </div>
                        <div className="d-flex flex-wrap gap-2.5 gap-sm-3">
                            <Button 
                                size="sm" 
                                variant="outline-primary"
                                onClick={loadData}
                                className="d-flex align-items-center gap-1.5 px-3 py-1.5"
                            >
                                <FontAwesomeIcon icon={faSyncAlt} /> Refresh Status
                            </Button>
                            <Button 
                                size="sm" 
                                className="text-white d-flex align-items-center gap-1.5 px-3 py-1.5"
                                style={{ backgroundColor: 'var(--cp-primary)', border: 'none' }}
                                disabled={isSeeding}
                                onClick={() => handleSeedDatabase(false)}
                            >
                                <FontAwesomeIcon icon={faDatabase} /> Seed Missing Data
                            </Button>
                        </div>
                    </div>

                    {/* Connectivity & Health Status */}
                    <div className="p-3.5 rounded mb-4" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2.5 rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary)' }}>
                                    <FontAwesomeIcon icon={faServer} style={{ fontSize: '1.2rem' }} />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>Firebase Project: {connCheck.projectId || 'kosher-code-consulting'}</h6>
                                    <small style={{ color: 'var(--cp-text-muted)' }}>Status: {connCheck.firestore ? '● Online & Synchronized' : 'Connecting to Firestore...'}</small>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <span className="badge px-3 py-2 bg-success bg-opacity-10 text-success d-flex align-items-center gap-1">
                                    <FontAwesomeIcon icon={faCheckCircle} /> Auth Ready
                                </span>
                                <span className="badge px-3 py-2 bg-success bg-opacity-10 text-success d-flex align-items-center gap-1">
                                    <FontAwesomeIcon icon={faCheckCircle} /> Firestore Connected
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Collection Stats Cards */}
                    <h6 className="fw-bold mb-3" style={{ color: 'var(--cp-text-main)' }}>Firestore Live Collection Documents</h6>
                    <Row className="g-3 mb-4">
                        <Col xs={6} md={4} lg={2}>
                            <Card className="h-100 p-3 border text-center" style={{ backgroundColor: 'var(--cp-card-bg)', borderColor: 'var(--cp-border)' }}>
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto" style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'var(--cp-primary-subtle)', color: 'var(--cp-primary)' }}>
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem' }}>SERVICES</small>
                                <h4 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.services}</h4>
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>collection: services</small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card className="h-100 p-3 border text-center" style={{ backgroundColor: 'var(--cp-card-bg)', borderColor: 'var(--cp-border)' }}>
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto" style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}>
                                    <FontAwesomeIcon icon={faTags} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem' }}>PRICING</small>
                                <h4 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.pricing}</h4>
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>collection: pricing</small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card className="h-100 p-3 border text-center" style={{ backgroundColor: 'var(--cp-card-bg)', borderColor: 'var(--cp-border)' }}>
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto" style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                                    <FontAwesomeIcon icon={faComments} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem' }}>REVIEWS</small>
                                <h4 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.reviews}</h4>
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>collection: reviews</small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card className="h-100 p-3 border text-center" style={{ backgroundColor: 'var(--cp-card-bg)', borderColor: 'var(--cp-border)' }}>
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto" style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}>
                                    <FontAwesomeIcon icon={faShoppingCart} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem' }}>ORDERS</small>
                                <h4 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.orders}</h4>
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>collection: orders</small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card className="h-100 p-3 border text-center" style={{ backgroundColor: 'var(--cp-card-bg)', borderColor: 'var(--cp-border)' }}>
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto" style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6' }}>
                                    <FontAwesomeIcon icon={faUsers} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem' }}>USERS</small>
                                <h4 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.users}</h4>
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>collection: users</small>
                            </Card>
                        </Col>
                        <Col xs={6} md={4} lg={2}>
                            <Card className="h-100 p-3 border text-center" style={{ backgroundColor: 'var(--cp-card-bg)', borderColor: 'var(--cp-border)' }}>
                                <div className="d-inline-flex align-items-center justify-content-center mb-2 mx-auto" style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'rgba(236, 72, 153, 0.12)', color: '#EC4899' }}>
                                    <FontAwesomeIcon icon={faEnvelopeOpenText} />
                                </div>
                                <small className="text-muted fw-bold d-block" style={{ fontSize: '0.72rem' }}>INQUIRIES</small>
                                <h4 className="fw-bold mb-0" style={{ color: 'var(--cp-text-main)' }}>{dbStats.contacts}</h4>
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>collection: contacts</small>
                            </Card>
                        </Col>
                    </Row>

                    {/* Actions Box */}
                    <div className="p-3.5 rounded" style={{ backgroundColor: 'var(--cp-card-subtle)', border: '1px solid var(--cp-border)' }}>
                        <h6 className="fw-bold mb-2" style={{ color: 'var(--cp-text-main)' }}>Database Actions & Diagnostics</h6>
                        <p className="small text-muted mb-3">
                            The application reads and writes directly to Cloud Firestore. If you want to populate all catalog collections with the latest comprehensive datasets, click below:
                        </p>
                        <div className="d-flex flex-wrap gap-3">
                            <Button 
                                variant="primary" 
                                size="sm" 
                                disabled={isSeeding}
                                onClick={() => handleSeedDatabase(false)}
                                className="px-3.5 py-2 fw-semibold"
                                style={{ borderRadius: '4px' }}
                            >
                                Populate Missing Firestore Documents
                            </Button>
                            <Button 
                                variant="outline-warning" 
                                size="sm" 
                                disabled={isSeeding}
                                className="px-3.5 py-2 fw-semibold"
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
                                style={{ borderRadius: '4px' }}
                            >
                                Overwrite / Re-seed Catalog
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MakeAdmin;
