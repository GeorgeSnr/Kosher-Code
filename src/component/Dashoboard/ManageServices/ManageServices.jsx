import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
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

    return (
        <div className="p-1 p-sm-2">
            {edit ? (
                <AddService edit={edit} setEdit={setEdit} services={services} />
            ) : (
                <div className="cp-card p-4 p-md-5" style={{ borderRadius: '8px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 className="fw-bold mb-1" style={{ color: 'var(--cp-text-main)' }}>Active Solution Catalog ({services.length})</h5>
                            <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>Manage services available for client booking across Uganda, Africa, and global markets.</p>
                        </div>
                        <Link to="/admin/add-service" className="text-decoration-none">
                            <Button 
                                size="sm" 
                                className="d-flex align-items-center gap-2 text-white px-3.5 py-2 border-0"
                                style={{ backgroundColor: 'var(--cp-primary)', borderRadius: '6px', fontWeight: 600 }}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Add New
                            </Button>
                        </Link>
                    </div>

                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0 cp-table">
                            <thead>
                                <tr>
                                    <th className="py-3 px-3">Solution Name</th>
                                    <th className="py-3 px-3">Category</th>
                                    <th className="py-3 px-3">Starting Price</th>
                                    <th className="py-3 px-3 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map(({ _id, id, name, price, category }) => {
                                    const serviceId = _id || id;
                                    return (
                                        <tr key={serviceId}>
                                            <td className="fw-semibold py-3 px-3" style={{ color: 'var(--cp-text-main)' }}>{name}</td>
                                            <td className="py-3 px-3">
                                                <span className="badge px-2.5 py-1 badge-status-review">
                                                    {category || 'Enterprise'}
                                                </span>
                                            </td>
                                            <td className="fw-bold py-3 px-3" style={{ color: 'var(--cp-text-main)' }}>${price}</td>
                                            <td className="text-end py-3 px-3">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    className="me-2"
                                                    style={{ borderRadius: '4px' }}
                                                    onClick={() => setEdit(serviceId)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm" 
                                                    style={{ borderRadius: '4px' }}
                                                    onClick={() => handleDelete(serviceId, name)}
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt} /> Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageServices;
