import { defaultServices } from '../component/ServicesData';
import { PricingData as defaultPricing } from '../component/PricingData';
import { 
    createFirestoreOrder, 
    fetchFirestoreOrders,
    fetchUserOrdersFromFirestore,
    updateFirestoreOrderStatus, 
    deleteFirestoreOrder,
    subscribeToOrders,
    subscribeToUserOrders,
    saveFirestoreService,
    fetchFirestoreServices,
    deleteFirestoreService,
    subscribeToServices,
    fetchFirestorePricing,
    saveFirestorePricingPlan,
    subscribeToPricing,
    saveUserToFirestore,
    getUserFromFirestore,
    fetchFirestoreUsers,
    subscribeToUsers,
    saveFirestoreReview,
    fetchFirestoreReviews,
    deleteFirestoreReview,
    subscribeToReviews,
    createContactInquiry,
    fetchContactInquiries,
    subscribeToContacts,
    seedFirestoreDatabase,
    getFirestoreStats,
    checkFirebaseConnectivity
} from './firebaseService';

const ORDERS_KEY = 'kosher_code_orders';
const SERVICES_KEY = 'kosher_code_services';
const ADMINS_KEY = 'kosher_code_admins';
const REVIEWS_KEY = 'kosher_code_reviews';
const PRICING_KEY = 'kosher_code_pricing';

// Default initial admins
const initialAdmins = [
    'georgewilliamochole@gmail.com',
    'admin@mail.com',
    'admin@koshercode.com',
    'director@koshercode.ug',
    'tech@koshercode.com'
];

// Initial fallback reviews
const defaultReviews = [
    {
        _id: 'rev-1',
        name: 'David Mukasa',
        address: 'General Manager, Victoria SACCO Union (Kampala, Uganda)',
        service: 'SACCO Cloud ERP & Mobile Banking Integration',
        description: 'Kosher Code transformed our SACCO operations across 12 regional branches. The automated mobile money loan disbursement and member portal reduced turnaround time from 3 days to under 2 minutes.',
        rating: 5,
        date: '15 Aug 2026'
    },
    {
        _id: 'rev-2',
        name: 'Amina Hassan',
        address: 'Head of Digital Banking, Equator Financial Group (Nairobi, Kenya)',
        service: 'Core Banking API & Cross-Border Gateway',
        description: 'Their core banking integration and cross-border payment gateway gave us the speed, security, and multi-currency capabilities required to scale smoothly across 5 African nations.',
        rating: 5,
        date: '02 Aug 2026'
    },
    {
        _id: 'rev-3',
        name: 'Christian Gallagher',
        address: 'COO, Trans-Atlantic Enterprise Logistics (London & Johannesburg)',
        service: 'Multi-Continental Cloud Architecture',
        description: 'Kosher Code engineered a custom multi-continental ERP that synchronized our African supply chains with our European distribution hubs in real-time. Exceptional software engineering.',
        rating: 5,
        date: '28 Jul 2026'
    },
    {
        _id: 'rev-4',
        name: 'Dr. Arthur Sempala',
        address: 'Managing Director, Agri-MSME Network (Uganda & East Africa)',
        service: 'MSME Enterprise ERP Suite & EFRIS Compliance',
        description: 'The enterprise ERP tailored for our MSME network automated our multi-store inventory, URA EFRIS e-invoicing, and warehouse logistics with remarkable ease.',
        rating: 5,
        date: '20 Jul 2026'
    }
];

// ----------------------------------------------------
// 1. ORDERS / BOOKINGS STORAGE & FIRESTORE SYNC
// ----------------------------------------------------

// Initial fallback orders matching enterprise solutions & Dribbble inspiration
export const defaultOrders = [
    {
        _id: 'ord-101',
        name: 'Alex Morgan',
        title: 'Product Designer',
        serviceName: 'Core Banking UI/UX & Design System',
        institution: 'Google',
        companyIcon: 'google',
        location: 'San Francisco',
        region: 'San Francisco, CA',
        status: 'Pending',
        postedDate: 'Jun 10 03:20 GMT',
        date: '2026-06-10',
        price: '4,500',
        pricingType: 'Design Systems',
        email: 'alex.morgan@google.com',
        phone: '+1 (415) 890-2134',
        description: 'Comprehensive design system and responsive banking workflow components for microfinance apps.'
    },
    {
        _id: 'ord-102',
        name: 'Jordan Hayes',
        title: 'Digital Marketer',
        serviceName: 'MSME Growth Engine & SEO Cloud',
        institution: 'Amazon',
        companyIcon: 'amazon',
        location: 'California',
        region: 'California, USA',
        status: 'Active',
        postedDate: 'Jun 08 04:30 GMT',
        date: '2026-06-08',
        price: '3,200',
        pricingType: 'Cloud Tier',
        email: 'jordan.h@amazon.com',
        phone: '+1 (206) 555-0199',
        description: 'Multi-store analytics pipeline and regional marketing automation integration.'
    },
    {
        _id: 'ord-103',
        name: 'David Chen',
        title: 'Python Developer',
        serviceName: 'Cross-Border Gateway & Core Switch',
        institution: 'Paypal',
        companyIcon: 'paypal',
        location: 'Los Angeles',
        region: 'Los Angeles, CA',
        status: 'Expired',
        postedDate: 'Feb 02 05:40 GMT',
        date: '2026-02-02',
        price: '6,800',
        pricingType: 'FinTech Switch',
        email: 'd.chen@paypal.com',
        phone: '+1 (310) 555-0142',
        description: 'High-throughput payment gateway integration with real-time settlement rails.'
    },
    {
        _id: 'ord-104',
        name: 'Elena Rostova',
        title: 'Lead Architect',
        serviceName: 'Enterprise Cloud Infrastructure',
        institution: 'Apple',
        companyIcon: 'apple',
        location: 'Cupertino',
        region: 'Cupertino, CA',
        status: 'Pending',
        postedDate: 'Jun 10 03:20 GMT',
        date: '2026-06-10',
        price: '8,200',
        pricingType: 'Cloud Architecture',
        email: 'elena.r@apple.com',
        phone: '+1 (408) 996-1010',
        description: 'Scalable multi-tenant cloud deployment with automated failover and low-latency API proxying.'
    },
    {
        _id: 'ord-105',
        name: 'Marcus Vance',
        title: 'UX Systems Engineer',
        serviceName: 'Web, Mobile & Cloud Solutions',
        institution: 'Figma',
        companyIcon: 'figma',
        location: 'San Francisco',
        region: 'San Francisco, CA',
        status: 'Pending',
        postedDate: 'Jun 12 04:30 GMT',
        date: '2026-06-12',
        price: '5,100',
        pricingType: 'Design Systems',
        email: 'marcus.vance@figma.com',
        phone: '+1 (415) 321-7890',
        description: 'Integration of automated tokens and Figma component libraries into core enterprise portals.'
    },
    {
        _id: 'ord-106',
        name: 'Stefan Meyer',
        title: 'Fleet Systems Lead',
        serviceName: 'Logistics & MSME ERP Suite',
        institution: 'BMW',
        companyIcon: 'bmw',
        location: 'Munich',
        region: 'Munich & Regional Hubs',
        status: 'Pending',
        postedDate: 'Jun 14 05:40 GMT',
        date: '2026-06-14',
        price: '7,400',
        pricingType: 'Enterprise ERP',
        email: 'stefan.meyer@bmw.de',
        phone: '+49 89 3820',
        description: 'Warehouse tracking integration and cross-border shipment synchronization.'
    },
    {
        _id: 'ord-107',
        name: 'David Mukasa',
        title: 'SACCO Operations Director',
        serviceName: 'SACCO & Microfinance Management ERP',
        institution: 'Kampala Metropolitan SACCO',
        companyIcon: 'bank',
        location: 'Kampala',
        region: 'Uganda & Regional',
        status: 'In Progress',
        postedDate: 'Aug 25 09:15 GMT',
        date: '2026-08-25',
        price: '899',
        pricingType: 'Standard Subscription',
        email: 'mukasa@kampalasacco.ug',
        phone: '+256 701 234 567',
        description: 'Need full automated loan management with MTN MoMo disbursement and UMRA compliance.'
    },
    {
        _id: 'ord-108',
        name: 'Sarah Akello',
        title: 'Head of Digital Banking',
        serviceName: 'Banking & Financial Sector Solutions',
        institution: 'Equatorial FinTech Ltd',
        companyIcon: 'fintech',
        location: 'Nairobi',
        region: 'Pan-African Operations',
        status: 'In Review',
        postedDate: 'Aug 26 11:45 GMT',
        date: '2026-08-26',
        price: '1,499',
        pricingType: 'Enterprise Tier',
        email: 'sarah.akello@equatorialpay.com',
        phone: '+256 772 890 123',
        description: 'Agency banking terminal integration with core banking switch and automated reconciliation.'
    }
];

export const getStoredOrders = () => {
    try {
        const stored = localStorage.getItem(ORDERS_KEY);
        if (!stored) return defaultOrders;
        const parsed = JSON.parse(stored);
        return parsed && parsed.length > 0 ? parsed : defaultOrders;
    } catch (e) {
        return defaultOrders;
    }
};

export const fetchOrdersAsync = async () => {
    try {
        const cloudOrders = await fetchFirestoreOrders();
        if (cloudOrders && cloudOrders.length > 0) {
            localStorage.setItem(ORDERS_KEY, JSON.stringify(cloudOrders));
            return cloudOrders;
        }
        return getStoredOrders();
    } catch (e) {
        return getStoredOrders();
    }
};

export const saveOrder = async (orderData) => {
    const orders = getStoredOrders();
    const tempId = 'ord-' + Date.now();
    const newOrder = {
        _id: tempId,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        ...orderData
    };
    const updated = [newOrder, ...orders];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

    // Cloud Firestore Asynchronous Sync
    try {
        const firestoreResult = await createFirestoreOrder(newOrder);
        if (firestoreResult && firestoreResult._id) {
            const synced = updated.map(o => o._id === tempId ? { ...o, _id: firestoreResult._id } : o);
            localStorage.setItem(ORDERS_KEY, JSON.stringify(synced));
            return firestoreResult;
        }
    } catch (err) {
        console.warn('Firestore order sync:', err.message);
    }

    return newOrder;
};

export const updateOrderStatus = (orderId, newStatus) => {
    const orders = getStoredOrders();
    const updated = orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

    // Cloud Firestore Asynchronous Sync
    updateFirestoreOrderStatus(orderId, newStatus).catch(err => console.warn('Firestore status sync:', err.message));

    return updated;
};

export const deleteStoredOrder = (orderId) => {
    const orders = getStoredOrders();
    const updated = orders.filter(o => o._id !== orderId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

    // Cloud Firestore Asynchronous Sync
    deleteFirestoreOrder(orderId).catch(err => console.warn('Firestore delete sync:', err.message));

    return updated;
};

export const getUserOrders = (userEmail) => {
    if (!userEmail) return [];
    const orders = getStoredOrders();
    const normalized = userEmail.toLowerCase().trim();
    return orders.filter(o => o.email?.toLowerCase().trim() === normalized);
};

export const getUserOrdersAsync = async (userEmail) => {
    if (!userEmail) return [];
    try {
        const cloudOrders = await fetchUserOrdersFromFirestore(userEmail);
        if (Array.isArray(cloudOrders)) {
            return cloudOrders;
        }
    } catch (err) {
        console.warn('Error fetching user orders from Firestore:', err.message);
    }
    return getUserOrders(userEmail);
};

// ----------------------------------------------------
// 2. ADMINISTRATOR PRIVILEGES & USERS
// ----------------------------------------------------

export const getStoredAdmins = () => {
    try {
        const stored = localStorage.getItem(ADMINS_KEY);
        if (!stored) {
            localStorage.setItem(ADMINS_KEY, JSON.stringify(initialAdmins));
            return initialAdmins;
        }
        return JSON.parse(stored);
    } catch (e) {
        return initialAdmins;
    }
};

export const addStoredAdmin = (email) => {
    if (!email) return false;
    const admins = getStoredAdmins();
    const normalized = email.toLowerCase().trim();
    if (!admins.includes(normalized)) {
        const updated = [...admins, normalized];
        localStorage.setItem(ADMINS_KEY, JSON.stringify(updated));

        // Save admin role in Firestore
        saveUserToFirestore({
            email: normalized,
            role: 'admin',
            name: normalized.split('@')[0]
        }).catch(err => console.warn('Firestore admin sync:', err.message));

        return true;
    }
    return false;
};

export const checkIsAdmin = (email) => {
    if (!email) return false;
    const normalized = email.toLowerCase().trim();
    const admins = getStoredAdmins().map(a => (typeof a === 'string' ? a.toLowerCase().trim() : ''));
    return admins.includes(normalized) || 
           normalized === 'georgewilliamochole@gmail.com' ||
           normalized === 'admin@koshercode.com' ||
           normalized === 'director@koshercode.ug' ||
           normalized === 'tech@koshercode.com' ||
           normalized === 'admin@mail.com';
};

const USERS_KEY = 'kosher_registered_users';

export const getRegisteredUsers = () => {
    try {
        const stored = localStorage.getItem(USERS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const findRegisteredUser = (email) => {
    if (!email) return null;
    const normalized = email.toLowerCase().trim();
    const existing = getRegisteredUsers();
    return existing.find(u => u.email.toLowerCase().trim() === normalized) || null;
};

export const registerUserAccount = (userObj) => {
    if (!userObj || !userObj.email) return null;
    const normalized = userObj.email.toLowerCase().trim();
    const existing = getRegisteredUsers();
    const updated = existing.filter(u => u.email.toLowerCase().trim() !== normalized);
    
    // Explicit role preservation: if explicitly registered as client, preserve 'client'
    const isExplicitClient = userObj.role === 'client';
    const isExplicitAdmin = userObj.role === 'admin';
    const isAdmin = isExplicitAdmin ? true : (isExplicitClient ? false : checkIsAdmin(normalized));
    
    const newUser = {
        ...userObj,
        email: normalized,
        role: isAdmin ? 'admin' : 'client',
        password: userObj.password || '',
        createdAt: userObj.createdAt || new Date().toISOString()
    };
    updated.push(newUser);
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    } catch (e) {}
    
    // Do not sync plain password to Firestore
    const { password, ...safeUser } = newUser;
    saveUserToFirestore(safeUser).catch(err => console.warn('Firestore user registration sync:', err.message));
    return newUser;
};

export const verifyUserCredentials = (email, password) => {
    if (!email) return { success: false, reason: 'missing_email', message: 'Please enter your email address.' };
    const normalized = email.toLowerCase().trim();
    const isAdmin = checkIsAdmin(normalized);
    const existing = getRegisteredUsers();
    const matched = existing.find(u => u.email.toLowerCase().trim() === normalized);

    if (!isAdmin && !matched) {
        return { success: false, reason: 'user_not_found', message: 'No account found with this email address.' };
    }

    if (matched && matched.password && password && matched.password !== password) {
        return { success: false, reason: 'wrong_password', message: 'Incorrect password. Please verify your credentials.' };
    }

    const userObj = authenticateUserAccount(email, password);
    if (userObj) {
        return { success: true, user: userObj };
    }
    return { success: false, reason: 'invalid_credentials', message: 'Invalid credentials. Please verify your email and password.' };
};

export const authenticateUserAccount = (email, password) => {
    if (!email) return null;
    const normalized = email.toLowerCase().trim();
    const isAdmin = checkIsAdmin(normalized);
    const existing = getRegisteredUsers();
    const matched = existing.find(u => u.email.toLowerCase().trim() === normalized);
    
    // If not an admin and not in registered users, authentication cannot succeed locally
    if (!isAdmin && !matched) {
        return null;
    }

    // Verify password for registered user if a password was saved
    if (matched && matched.password && password && matched.password !== password) {
        return null;
    }

    // If matched existed without a saved password, record the password now
    if (matched && !matched.password && password) {
        matched.password = password;
        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(existing));
        } catch (e) {}
    }

    const resolvedRole = matched?.role ? matched.role : (isAdmin ? 'admin' : 'client');
    const resolvedName = matched?.name || (normalized === 'georgewilliamochole@gmail.com' 
        ? 'George William Ochole' 
        : normalized.split('@')[0].replace(/[._]/g, ' ').toUpperCase());
    
    const userObj = {
        isSignedIn: true,
        email: normalized,
        name: resolvedName,
        role: resolvedRole,
        institution: matched?.institution || '',
        img: isAdmin 
            ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' 
            : (matched?.img || 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png')
    };
    
    try {
        localStorage.setItem('kosher_current_user', JSON.stringify(userObj));
    } catch (e) {}
    saveUserToFirestore(userObj).catch(() => {});
    return userObj;
};

// ----------------------------------------------------
// 3. SERVICES CATALOG
// ----------------------------------------------------

export const getStoredServices = () => {
    try {
        const stored = localStorage.getItem(SERVICES_KEY);
        if (!stored) {
            return defaultServices;
        }
        const parsed = JSON.parse(stored);
        return parsed && parsed.length > 0 ? parsed : defaultServices;
    } catch (e) {
        return defaultServices;
    }
};

export const fetchServicesAsync = async () => {
    try {
        const cloudServices = await fetchFirestoreServices();
        if (cloudServices && cloudServices.length > 0) {
            localStorage.setItem(SERVICES_KEY, JSON.stringify(cloudServices));
            return cloudServices;
        }
    } catch (err) {
        console.warn('Error fetching services from Firestore:', err.message);
    }
    return getStoredServices();
};

export const saveService = (serviceData) => {
    const services = getStoredServices();
    const newService = {
        _id: 'srv-' + Date.now(),
        ...serviceData
    };
    const updated = [newService, ...services];
    localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));

    // Cloud Firestore Sync
    saveFirestoreService(newService).catch(err => console.warn('Firestore service sync:', err.message));

    return newService;
};

export const deleteStoredService = (serviceId) => {
    const services = getStoredServices();
    const updated = services.filter(s => (s._id !== serviceId && s.id !== serviceId));
    localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));

    // Cloud Firestore Sync
    deleteFirestoreService(serviceId).catch(err => console.warn('Firestore delete service sync:', err.message));

    return updated;
};

// ----------------------------------------------------
// 4. PRICING TIERS
// ----------------------------------------------------

export const getStoredPricing = () => {
    try {
        const stored = localStorage.getItem(PRICING_KEY);
        if (!stored) return defaultPricing;
        const parsed = JSON.parse(stored);
        return parsed && parsed.length > 0 ? parsed : defaultPricing;
    } catch (e) {
        return defaultPricing;
    }
};

export const fetchPricingAsync = async () => {
    try {
        const cloudPricing = await fetchFirestorePricing();
        if (cloudPricing && cloudPricing.length > 0) {
            localStorage.setItem(PRICING_KEY, JSON.stringify(cloudPricing));
            return cloudPricing;
        }
    } catch (err) {
        console.warn('Error fetching pricing from Firestore:', err.message);
    }
    return getStoredPricing();
};

export const savePricingPlan = (planData) => {
    return saveFirestorePricingPlan(planData);
};

// ----------------------------------------------------
// 5. REVIEWS & TESTIMONIALS
// ----------------------------------------------------

export const getStoredReviews = () => {
    try {
        const stored = localStorage.getItem(REVIEWS_KEY);
        if (!stored) return defaultReviews;
        const parsed = JSON.parse(stored);
        return parsed && parsed.length > 0 ? parsed : defaultReviews;
    } catch (e) {
        return defaultReviews;
    }
};

export const fetchReviewsAsync = async () => {
    try {
        const cloudReviews = await fetchFirestoreReviews();
        if (cloudReviews && cloudReviews.length > 0) {
            localStorage.setItem(REVIEWS_KEY, JSON.stringify(cloudReviews));
            return cloudReviews;
        }
    } catch (err) {
        console.warn('Error fetching reviews from Firestore:', err.message);
    }
    return getStoredReviews();
};

export const saveReview = (reviewData) => {
    const reviews = getStoredReviews();
    const newReview = {
        _id: 'rev-' + Date.now(),
        ...reviewData
    };
    const updated = [newReview, ...reviews];
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));

    // Cloud Firestore Sync
    saveFirestoreReview(newReview).catch(err => console.warn('Firestore review sync:', err.message));

    return newReview;
};

export const deleteStoredReview = (reviewId) => {
    const reviews = getStoredReviews();
    const updated = reviews.filter(r => (r._id !== reviewId && r.id !== reviewId));
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));

    // Cloud Firestore Sync
    deleteFirestoreReview(reviewId).catch(err => console.warn('Firestore delete review sync:', err.message));

    return updated;
};

// ----------------------------------------------------
// 6. CONTACT & CONSULTATION INQUIRIES
// ----------------------------------------------------

export const saveContactMessage = (contactData) => {
    createContactInquiry(contactData).catch(err => console.warn('Firestore contact sync:', err.message));
    return true;
};

export { 
    saveUserToFirestore, 
    getUserFromFirestore, 
    fetchFirestoreUsers,
    subscribeToUsers,
    subscribeToOrders,
    subscribeToUserOrders,
    subscribeToServices,
    subscribeToPricing,
    subscribeToReviews,
    subscribeToContacts,
    createContactInquiry,
    fetchContactInquiries,
    seedFirestoreDatabase,
    getFirestoreStats,
    checkFirebaseConnectivity
};
