import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faEdit, faPlus, faSearch, faLayerGroup, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import AddService from '../AddService/AddService';
import { 
    getStoredServices, 
    fetchServicesAsync, 
    deleteStoredService, 
    subscribeToServices 
} from '../../../services/storageService';

const ManageServices = () => {
    const [services, setServices] = useState(() => getStoredServices());
    const [edit, setEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const loadServices = () => {
        fetchServicesAsync().then(cloudServices => {
            if (cloudServices && cloudServices.length > 0) {
                setServices(cloudServices);
            }
        });
    };

    useEffect(() => {
        loadServices();

        // Real-time Firestore sync
        const unsubscribe = subscribeToServices((cloudServices) => {
            if (cloudServices && cloudServices.length > 0) {
                setServices(cloudServices);
            }
        });

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [edit]);

    const handleDelete = (id, name) => {
        swal({
            title: "Delete Solution?",
            text: `Are you sure you want to remove "${name}" from the solution catalog?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                deleteStoredService(id);
                setServices(prev => prev.filter(s => (s._id !== id && s.id !== id)));
                toast.success('Solution deleted successfully!');
            }
        });
    };

    const categories = useMemo(() => {
        const set = new Set();
        services.forEach(s => {
            if (s.category) set.add(s.category);
        });
        return Array.from(set);
    }, [services]);

    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
            const query = searchTerm.toLowerCase().trim();
            const matchesSearch = !query || 
                service.name?.toLowerCase().includes(query) || 
                service.category?.toLowerCase().includes(query) ||
                service.description?.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [services, selectedCategory, searchTerm]);

    return (
        <div className="p-1 p-sm-2">
            {edit ? (
                <AddService edit={edit} setEdit={setEdit} services={services} />
            ) : (
                <div 
                    className="p-4 p-md-5"
                    style={{
                        backgroundColor: 'var(--cp-card-bg, #FFFFFF)',
                        borderRadius: '24px',
                        border: '1px solid var(--cp-border-subtle, rgba(0, 0, 0, 0.06))',
                        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}
                >
                    {/* Header */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1.5">
                                <span 
                                    className="badge rounded-pill px-3 py-1"
                                    style={{ 
                                        backgroundColor: 'var(--cp-primary-subtle)', 
                                        color: 'var(--cp-primary-text)',
                                        fontSize: '0.74rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Catalog Manager
                                </span>
                                <span 
                                    className="badge rounded-pill px-2.5 py-1"
                                    style={{
                                        backgroundColor: 'var(--cp-card-subtle)',
                                        color: 'var(--cp-text-muted)',
                                        fontSize: '0.74rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {services.length} Solutions Active
                                </span>
                            </div>
                            <h4 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)', letterSpacing: '-0.02em' }}>
                                Active Solution Catalog
                            </h4>
                            <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>
                                Manage services available for client booking across Uganda, Africa, and global markets.
                            </p>
                        </div>

                        <Link to="/admin/add-service" className="text-decoration-none">
                            <Button 
                                className="rounded-pill px-4 py-2 text-white d-inline-flex align-items-center gap-2 border-0"
                                style={{ 
                                    backgroundColor: '#121417', 
                                    fontWeight: 600, 
                                    fontSize: '0.86rem' 
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Add New Solution
                            </Button>
                        </Link>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('all')}
                                className="btn btn-sm rounded-pill px-3 py-1.5 border-0"
                                style={{
                                    backgroundColor: selectedCategory === 'all' ? 'var(--cp-primary)' : 'var(--cp-card-subtle)',
                                    color: selectedCategory === 'all' ? '#FFFFFF' : 'var(--cp-text-muted)',
                                    fontWeight: selectedCategory === 'all' ? 700 : 500,
                                    fontSize: '0.82rem'
                                }}
                            >
                                All Solutions ({services.length})
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className="btn btn-sm rounded-pill px-3 py-1.5 border-0"
                                    style={{
                                        backgroundColor: selectedCategory === cat ? 'var(--cp-primary)' : 'var(--cp-card-subtle)',
                                        color: selectedCategory === cat ? '#FFFFFF' : 'var(--cp-text-muted)',
                                        fontWeight: selectedCategory === cat ? 700 : 500,
                                        fontSize: '0.82rem'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="d-flex align-items-center position-relative" style={{ minWidth: '240px' }}>
                            <FontAwesomeIcon 
                                icon={faSearch} 
                                className="position-absolute ms-3"
                                style={{ color: 'var(--cp-text-muted)', fontSize: '0.85rem' }} 
                            />
                            <input 
                                type="text"
                                className="form-control rounded-pill ps-5 pe-3 py-2 border-0"
                                style={{ 
                                    backgroundColor: 'var(--cp-card-subtle)', 
                                    fontSize: '0.84rem',
                                    color: 'var(--cp-text-main)'
                                }}
                                placeholder="Search solutions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0 cp-table" style={{ minWidth: '650px' }}>
                            <thead>
                                <tr>
                                    <th className="py-3 px-3" style={{ borderTop: 'none' }}>Solution Name & Scope</th>
                                    <th className="py-3 px-3" style={{ borderTop: 'none' }}>Category</th>
                                    <th className="py-3 px-3" style={{ borderTop: 'none' }}>Starting Price</th>
                                    <th className="py-3 px-3 text-end" style={{ borderTop: 'none' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5">
                                            <div className="text-muted small">No solutions match your current filter.</div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredServices.map(({ _id, id, name, price, category, description }) => {
                                        const serviceId = _id || id;
                                        return (
                                            <tr key={serviceId}>
                                                <td className="py-3 px-3">
                                                    <div className="fw-semibold" style={{ color: 'var(--cp-text-main)', fontSize: '0.92rem' }}>
                                                        {name}
                                                    </div>
                                                    {description && (
                                                        <small className="text-muted d-block text-truncate" style={{ maxWidth: '380px', fontSize: '0.78rem' }}>
                                                            {description}
                                                        </small>
                                                    )}
                                                </td>
                                                <td className="py-3 px-3">
                                                    <span 
                                                        className="badge rounded-pill px-3 py-1.5"
                                                        style={{
                                                            backgroundColor: 'var(--cp-card-subtle)',
                                                            color: 'var(--cp-text-main)',
                                                            fontSize: '0.76rem',
                                                            fontWeight: 600,
                                                            border: '1px solid var(--cp-border)'
                                                        }}
                                                    >
                                                        {category || 'Enterprise'}
                                                    </span>
                                                </td>
                                                <td className="fw-bold py-3 px-3" style={{ color: 'var(--cp-text-main)', fontSize: '0.94rem' }}>
                                                    ${price}
                                                </td>
                                                <td className="text-end py-3 px-3">
                                                    <div className="d-inline-flex align-items-center gap-2">
                                                        <button 
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5"
                                                            style={{ 
                                                                fontSize: '0.8rem', 
                                                                fontWeight: 600,
                                                                borderColor: 'var(--cp-border)'
                                                            }}
                                                            onClick={() => setEdit(serviceId)}
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} style={{ color: 'var(--cp-primary)' }} /> Edit
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5"
                                                            style={{ fontSize: '0.8rem', fontWeight: 600 }}
                                                            onClick={() => handleDelete(serviceId, name)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageServices;
