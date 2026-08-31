import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseBaseConfig';
import { defaultServices } from '../component/ServicesData';
import { PricingData as defaultPricingData } from '../component/PricingData';

// Initialize Firebase App
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();

// Optional settings for offline persistence
try {
    db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Firestore persistence notice: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            console.warn('Firestore persistence not supported by browser');
        }
    });
} catch (e) {
    // Ignore in unsupported environments
}

// ----------------------------------------------------
// 1. FIREBASE AUTHENTICATION API
// ----------------------------------------------------

/**
 * Register new user with Email and Password in Firebase Auth + save profile to Firestore
 */
export const firebaseRegister = async (email, password, displayName, role = 'client', institution = '') => {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (displayName && user.updateProfile) {
            await user.updateProfile({ displayName });
        }

        const userProfile = {
            uid: user.uid,
            email: user.email.toLowerCase(),
            name: displayName || email.split('@')[0],
            role: role || (email.toLowerCase().includes('admin') ? 'admin' : 'client'),
            institution: institution || '',
            img: role === 'admin' || email.toLowerCase().includes('admin')
                ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                : 'https://assets.maccarianagency.com/svg/illustrations/designer.svg',
            isSignedIn: true
        };

        await saveUserToFirestore(userProfile);
        return { success: true, user: userProfile };
    } catch (error) {
        console.warn('Firebase registration error:', error.message);
        return { success: false, error: error.message, code: error.code };
    }
};

/**
 * Sign In with Email and Password in Firebase Auth + fetch/hydrate profile from Firestore
 */
export const firebaseLogin = async (email, password) => {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Hydrate profile from Firestore
        let profile = await getUserFromFirestore(email);
        const isAdmin = profile?.role === 'admin' || email.toLowerCase().includes('admin');

        const userProfile = {
            uid: user.uid,
            email: user.email.toLowerCase(),
            name: profile?.name || user.displayName || email.split('@')[0],
            role: isAdmin ? 'admin' : (profile?.role || 'client'),
            institution: profile?.institution || '',
            phone: profile?.phone || '',
            img: profile?.img || (isAdmin 
                ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' 
                : 'https://assets.maccarianagency.com/svg/illustrations/designer.svg'),
            isSignedIn: true
        };

        await saveUserToFirestore(userProfile);
        return { success: true, user: userProfile };
    } catch (error) {
        console.warn('Firebase login error:', error.message);
        return { success: false, error: error.message, code: error.code };
    }
};

/**
 * Sign in with Google Popup
 */
export const firebaseGoogleSignIn = async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const userCredential = await auth.signInWithPopup(provider);
        const user = userCredential.user;

        let profile = await getUserFromFirestore(user.email);
        const isAdmin = profile?.role === 'admin' || user.email.toLowerCase().includes('admin');

        const userProfile = {
            uid: user.uid,
            email: user.email.toLowerCase(),
            name: user.displayName || user.email.split('@')[0],
            role: isAdmin ? 'admin' : (profile?.role || 'client'),
            institution: profile?.institution || '',
            phone: user.phoneNumber || profile?.phone || '',
            img: user.photoURL || profile?.img || 'https://assets.maccarianagency.com/svg/illustrations/designer.svg',
            isSignedIn: true
        };

        await saveUserToFirestore(userProfile);
        return { success: true, user: userProfile };
    } catch (error) {
        console.warn('Firebase Google sign-in error:', error.message);
        return { success: false, error: error.message, code: error.code };
    }
};

/**
 * Sign out user from Firebase Auth
 */
export const firebaseSignOut = async () => {
    try {
        await auth.signOut();
        sessionStorage.removeItem('kosher_client_session');
        localStorage.removeItem('kosher_current_user');
        localStorage.removeItem('token');
        return true;
    } catch (error) {
        console.warn('Firebase sign out error:', error.message);
        return false;
    }
};

// ----------------------------------------------------
// 2. USER PROFILE OPERATIONS (Cloud Firestore)
// ----------------------------------------------------

/**
 * Saves or updates a user profile in Firestore 'users' collection
 */
export const saveUserToFirestore = async (user) => {
    if (!user || !user.email) return null;
    try {
        const normalizedEmail = user.email.toLowerCase();
        const userDocRef = db.collection('users').doc(normalizedEmail);
        const payload = {
            name: user.name || normalizedEmail.split('@')[0],
            email: normalizedEmail,
            role: user.role || 'client',
            institution: user.institution || '',
            phone: user.phone || '',
            img: user.img || '',
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await userDocRef.set(payload, { merge: true });
        return { ...user, ...payload };
    } catch (error) {
        console.warn('Firestore saveUser warning:', error.message);
        return user;
    }
};

/**
 * Retrieves a user profile from Firestore by email
 */
export const getUserFromFirestore = async (email) => {
    if (!email) return null;
    try {
        const doc = await db.collection('users').doc(email.toLowerCase()).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.warn('Firestore getUser warning:', error.message);
        return null;
    }
};

/**
 * Retrieves all registered users from Firestore 'users' collection (Admin only)
 */
export const fetchFirestoreUsers = async () => {
    try {
        const snapshot = await db.collection('users').get();
        const users = [];
        snapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        console.warn('Firestore fetchUsers warning:', error.message);
        return [];
    }
};

/**
 * Subscribes to real-time updates for all registered users
 */
export const subscribeToUsers = (onUpdate, onError) => {
    try {
        return db.collection('users').onSnapshot((snapshot) => {
            const users = [];
            snapshot.forEach((doc) => {
                users.push({ id: doc.id, ...doc.data() });
            });
            if (onUpdate) onUpdate(users);
        }, (err) => {
            if (onError) onError(err);
        });
    } catch (error) {
        console.warn('Firestore subscribeToUsers error:', error.message);
        return () => {};
    }
};

// ----------------------------------------------------
// 3. INBOUND ORDERS & REQUESTS OPERATIONS (Cloud Firestore)
// ----------------------------------------------------

/**
 * Creates a new client booking / inquiry in Firestore
 */
export const createFirestoreOrder = async (orderData) => {
    try {
        const payload = {
            ...orderData,
            email: orderData.email ? orderData.email.toLowerCase() : '',
            status: orderData.status || 'Pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            date: orderData.date || new Date().toISOString().split('T')[0]
        };
        const docRef = await db.collection('orders').add(payload);
        return { _id: docRef.id, ...payload };
    } catch (error) {
        console.warn('Firestore createOrder warning:', error.message);
        return null;
    }
};

/**
 * Fetches all orders from Firestore (ordered by creation date)
 */
export const fetchFirestoreOrders = async () => {
    try {
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        const orders = [];
        snapshot.forEach((doc) => {
            orders.push({ _id: doc.id, ...doc.data() });
        });
        return orders;
    } catch (error) {
        // Fallback without orderby if index not built yet
        try {
            const snapshot = await db.collection('orders').get();
            const orders = [];
            snapshot.forEach((doc) => {
                orders.push({ _id: doc.id, ...doc.data() });
            });
            return orders;
        } catch (err2) {
            console.warn('Firestore fetchOrders warning:', err2.message);
            return [];
        }
    }
};

/**
 * Fetches orders for a specific user email from Firestore
 */
export const fetchUserOrdersFromFirestore = async (userEmail) => {
    if (!userEmail) return [];
    try {
        const snapshot = await db.collection('orders')
            .where('email', '==', userEmail.toLowerCase())
            .get();
        const orders = [];
        snapshot.forEach((doc) => {
            orders.push({ _id: doc.id, ...doc.data() });
        });
        return orders;
    } catch (error) {
        console.warn('Firestore fetchUserOrders warning:', error.message);
        return [];
    }
};

/**
 * Updates order status in Firestore (e.g. 'Pending' -> 'In Progress' -> 'Done')
 */
export const updateFirestoreOrderStatus = async (orderId, newStatus) => {
    try {
        const docRef = db.collection('orders').doc(orderId);
        await docRef.update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.warn('Firestore updateOrderStatus warning:', error.message);
        return false;
    }
};

/**
 * Deletes an order from Firestore
 */
export const deleteFirestoreOrder = async (orderId) => {
    try {
        await db.collection('orders').doc(orderId).delete();
        return true;
    } catch (error) {
        console.warn('Firestore deleteOrder warning:', error.message);
        return false;
    }
};

/**
 * Subscribes to real-time updates for all orders (live admin listener)
 */
export const subscribeToOrders = (onUpdate, onError) => {
    try {
        return db.collection('orders').onSnapshot((snapshot) => {
            const orders = [];
            snapshot.forEach((doc) => {
                orders.push({ _id: doc.id, ...doc.data() });
            });
            if (onUpdate) onUpdate(orders);
        }, (err) => {
            if (onError) onError(err);
        });
    } catch (error) {
        console.warn('Firestore subscribeToOrders error:', error.message);
        return () => {};
    }
};

/**
 * Subscribes to real-time updates for a single user's orders (live client listener)
 */
export const subscribeToUserOrders = (userEmail, onUpdate, onError) => {
    if (!userEmail) return () => {};
    try {
        return db.collection('orders')
            .where('email', '==', userEmail.toLowerCase())
            .onSnapshot((snapshot) => {
                const orders = [];
                snapshot.forEach((doc) => {
                    orders.push({ _id: doc.id, ...doc.data() });
                });
                if (onUpdate) onUpdate(orders);
            }, (err) => {
                if (onError) onError(err);
            });
    } catch (error) {
        console.warn('Firestore subscribeToUserOrders error:', error.message);
        return () => {};
    }
};

// ----------------------------------------------------
// 4. SOLUTION SERVICES CATALOG (Cloud Firestore)
// ----------------------------------------------------

export const fetchFirestoreServices = async () => {
    try {
        const snapshot = await db.collection('services').get();
        const services = [];
        snapshot.forEach((doc) => {
            services.push({ _id: doc.id, ...doc.data() });
        });
        return services;
    } catch (error) {
        console.warn('Firestore fetchServices warning:', error.message);
        return [];
    }
};

export const subscribeToServices = (onUpdate, onError) => {
    try {
        return db.collection('services').onSnapshot((snapshot) => {
            const services = [];
            snapshot.forEach((doc) => {
                services.push({ _id: doc.id, ...doc.data() });
            });
            if (onUpdate) onUpdate(services);
        }, (err) => {
            if (onError) onError(err);
        });
    } catch (error) {
        console.warn('Firestore subscribeToServices error:', error.message);
        return () => {};
    }
};

export const saveFirestoreService = async (serviceData) => {
    try {
        const payload = {
            ...serviceData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        let docRef;
        if (serviceData._id && !serviceData._id.startsWith('srv-demo-')) {
            docRef = db.collection('services').doc(serviceData._id);
            await docRef.set(payload, { merge: true });
            return { _id: serviceData._id, ...payload };
        } else {
            docRef = await db.collection('services').add(payload);
            return { _id: docRef.id, ...payload };
        }
    } catch (error) {
        console.warn('Firestore saveService warning:', error.message);
        return null;
    }
};

export const deleteFirestoreService = async (serviceId) => {
    try {
        await db.collection('services').doc(serviceId).delete();
        return true;
    } catch (error) {
        console.warn('Firestore deleteService warning:', error.message);
        return false;
    }
};

// ----------------------------------------------------
// 5. PRICING TIERS & PLANS (Cloud Firestore)
// ----------------------------------------------------

export const fetchFirestorePricing = async () => {
    try {
        const snapshot = await db.collection('pricing').orderBy('tabIndex', 'asc').get();
        if (snapshot.empty) return null;
        
        // Group by tabIndex (0 to 5)
        const tabsMap = {};
        snapshot.forEach((doc) => {
            const plan = { _id: doc.id, ...doc.data() };
            const tabIdx = plan.tabIndex !== undefined ? plan.tabIndex : 0;
            if (!tabsMap[tabIdx]) tabsMap[tabIdx] = [];
            tabsMap[tabIdx].push(plan);
        });

        // Convert map to array of arrays
        const result = [];
        const maxTab = Math.max(...Object.keys(tabsMap).map(Number), -1);
        for (let i = 0; i <= maxTab; i++) {
            result.push(tabsMap[i] || []);
        }
        return result.length > 0 ? result : null;
    } catch (error) {
        // Fallback without ordering
        try {
            const snapshot = await db.collection('pricing').get();
            if (snapshot.empty) return null;
            const tabsMap = {};
            snapshot.forEach((doc) => {
                const plan = { _id: doc.id, ...doc.data() };
                const tabIdx = plan.tabIndex !== undefined ? plan.tabIndex : 0;
                if (!tabsMap[tabIdx]) tabsMap[tabIdx] = [];
                tabsMap[tabIdx].push(plan);
            });
            const result = [];
            const maxTab = Math.max(...Object.keys(tabsMap).map(Number), -1);
            for (let i = 0; i <= maxTab; i++) {
                result.push(tabsMap[i] || []);
            }
            return result.length > 0 ? result : null;
        } catch (err2) {
            console.warn('Firestore fetchPricing warning:', err2.message);
            return null;
        }
    }
};

export const subscribeToPricing = (onUpdate, onError) => {
    try {
        return db.collection('pricing').onSnapshot((snapshot) => {
            if (snapshot.empty) {
                if (onUpdate) onUpdate(null);
                return;
            }
            const tabsMap = {};
            snapshot.forEach((doc) => {
                const plan = { _id: doc.id, ...doc.data() };
                const tabIdx = plan.tabIndex !== undefined ? plan.tabIndex : 0;
                if (!tabsMap[tabIdx]) tabsMap[tabIdx] = [];
                tabsMap[tabIdx].push(plan);
            });
            const result = [];
            const maxTab = Math.max(...Object.keys(tabsMap).map(Number), -1);
            for (let i = 0; i <= maxTab; i++) {
                result.push(tabsMap[i] || []);
            }
            if (onUpdate) onUpdate(result);
        }, (err) => {
            if (onError) onError(err);
        });
    } catch (error) {
        console.warn('Firestore subscribeToPricing error:', error.message);
        return () => {};
    }
};

export const saveFirestorePricingPlan = async (planData) => {
    try {
        const payload = {
            ...planData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        let docRef;
        if (planData._id) {
            docRef = db.collection('pricing').doc(planData._id);
            await docRef.set(payload, { merge: true });
            return { _id: planData._id, ...payload };
        } else {
            docRef = await db.collection('pricing').add(payload);
            return { _id: docRef.id, ...payload };
        }
    } catch (error) {
        console.warn('Firestore savePricingPlan warning:', error.message);
        return null;
    }
};

// ----------------------------------------------------
// 6. TESTIMONIALS & REVIEWS (Cloud Firestore)
// ----------------------------------------------------

export const fetchFirestoreReviews = async () => {
    try {
        const snapshot = await db.collection('reviews').get();
        const reviews = [];
        snapshot.forEach((doc) => {
            reviews.push({ _id: doc.id, ...doc.data() });
        });
        return reviews;
    } catch (error) {
        console.warn('Firestore fetchReviews warning:', error.message);
        return [];
    }
};

export const subscribeToReviews = (onUpdate, onError) => {
    try {
        return db.collection('reviews').onSnapshot((snapshot) => {
            const reviews = [];
            snapshot.forEach((doc) => {
                reviews.push({ _id: doc.id, ...doc.data() });
            });
            if (onUpdate) onUpdate(reviews);
        }, (err) => {
            if (onError) onError(err);
        });
    } catch (error) {
        console.warn('Firestore subscribeToReviews error:', error.message);
        return () => {};
    }
};

export const saveFirestoreReview = async (reviewData) => {
    try {
        const payload = {
            ...reviewData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        let docRef;
        if (reviewData._id) {
            docRef = db.collection('reviews').doc(reviewData._id);
            await docRef.set(payload, { merge: true });
            return { _id: reviewData._id, ...payload };
        } else {
            docRef = await db.collection('reviews').add(payload);
            return { _id: docRef.id, ...payload };
        }
    } catch (error) {
        console.warn('Firestore saveReview warning:', error.message);
        return null;
    }
};

export const deleteFirestoreReview = async (reviewId) => {
    try {
        await db.collection('reviews').doc(reviewId).delete();
        return true;
    } catch (error) {
        console.warn('Firestore deleteReview warning:', error.message);
        return false;
    }
};

// ----------------------------------------------------
// 7. CONTACT & CONSULTATION INQUIRIES (Cloud Firestore)
// ----------------------------------------------------

export const createContactInquiry = async (inquiryData) => {
    try {
        const payload = {
            ...inquiryData,
            status: 'New',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            date: new Date().toISOString().split('T')[0]
        };
        const docRef = await db.collection('contacts').add(payload);
        return { _id: docRef.id, ...payload };
    } catch (error) {
        console.warn('Firestore createContactInquiry warning:', error.message);
        return null;
    }
};

export const fetchContactInquiries = async () => {
    try {
        const snapshot = await db.collection('contacts').get();
        const contacts = [];
        snapshot.forEach((doc) => {
            contacts.push({ _id: doc.id, ...doc.data() });
        });
        return contacts;
    } catch (error) {
        console.warn('Firestore fetchContactInquiries warning:', error.message);
        return [];
    }
};

export const subscribeToContacts = (onUpdate, onError) => {
    try {
        return db.collection('contacts').onSnapshot((snapshot) => {
            const contacts = [];
            snapshot.forEach((doc) => {
                contacts.push({ _id: doc.id, ...doc.data() });
            });
            if (onUpdate) onUpdate(contacts);
        }, (err) => {
            if (onError) onError(err);
        });
    } catch (error) {
        console.warn('Firestore subscribeToContacts error:', error.message);
        return () => {};
    }
};

// ----------------------------------------------------
// 8. FIRESTORE DATABASE INITIALIZATION & SEEDING ENGINE
// ----------------------------------------------------

const initialSeedReviews = [
    {
        name: 'David Mukasa',
        address: 'General Manager, Victoria SACCO Union (Kampala, Uganda)',
        service: 'SACCO Cloud ERP & Mobile Banking Integration',
        description: 'Kosher Code transformed our SACCO operations across 12 regional branches. The automated mobile money loan disbursement and member portal reduced turnaround time from 3 days to under 2 minutes.',
        rating: 5,
        date: '15 Aug 2026'
    },
    {
        name: 'Amina Hassan',
        address: 'Head of Digital Banking, Equator Financial Group (Nairobi, Kenya)',
        service: 'Core Banking API & Cross-Border Gateway',
        description: 'Their core banking integration and cross-border payment gateway gave us the speed, security, and multi-currency capabilities required to scale smoothly across 5 African nations.',
        rating: 5,
        date: '02 Aug 2026'
    },
    {
        name: 'Christian Gallagher',
        address: 'COO, Trans-Atlantic Enterprise Logistics (London & Johannesburg)',
        service: 'Multi-Continental Cloud Architecture',
        description: 'Kosher Code engineered a custom multi-continental ERP that synchronized our African supply chains with our European distribution hubs in real-time. Exceptional software engineering.',
        rating: 5,
        date: '28 Jul 2026'
    },
    {
        name: 'Dr. Arthur Sempala',
        address: 'Managing Director, Agri-MSME Network (Uganda & East Africa)',
        service: 'MSME Enterprise ERP Suite & EFRIS Compliance',
        description: 'The enterprise ERP tailored for our MSME network automated our multi-store inventory, URA EFRIS e-invoicing, and warehouse logistics with remarkable ease.',
        rating: 5,
        date: '20 Jul 2026'
    }
];

const initialSeedOrders = [
    {
        name: 'David Mukasa',
        email: 'mukasa@kampalasacco.ug',
        phone: '+256 701 234 567',
        institution: 'Kampala Metropolitan SACCO',
        region: 'Uganda (Kampala & Regional)',
        serviceName: 'SACCO & Microfinance Management ERP',
        price: '899',
        pricingType: 'Standard Subscription',
        status: 'In Progress',
        date: '2026-08-25',
        description: 'Need full automated loan management with MTN MoMo disbursement and UMRA compliance.',
        img: 'https://assets.maccarianagency.com/svg/illustrations/designer.svg'
    },
    {
        name: 'Sarah Akello',
        email: 'sarah.akello@equatorialpay.com',
        phone: '+256 772 890 123',
        institution: 'Equatorial FinTech Ltd',
        region: 'Pan-African Operations',
        serviceName: 'Banking & Financial Sector Solutions',
        price: '1499',
        pricingType: 'Enterprise Tier',
        status: 'In Review',
        date: '2026-08-26',
        description: 'Agency banking terminal integration with core banking switch and automated reconciliation.',
        img: 'https://assets.maccarianagency.com/svg/illustrations/developer.svg'
    },
    {
        name: 'Kigozi Ronald',
        email: 'ronald@victoriatraders.co.ug',
        phone: '+256 750 345 678',
        institution: 'Victoria Wholesale & Retailers',
        region: 'Uganda',
        serviceName: 'MSME & SME Enterprise ERP Suite',
        price: '499',
        pricingType: 'Custom Quotation',
        status: 'Pending',
        date: '2026-08-27',
        description: 'Multi-branch POS with URA EFRIS compliance and automated stock tracking.',
        img: 'https://assets.maccarianagency.com/svg/illustrations/marketing.svg'
    },
    {
        name: 'Grace Namubiru',
        email: 'grace@africacreatives.org',
        phone: '+256 788 112 233',
        institution: 'Pan-African Innovators Hub',
        region: 'East Africa & Global',
        serviceName: 'Web Design & UI/UX Experience',
        price: '48',
        pricingType: 'Starter Website',
        status: 'Done',
        date: '2026-08-20',
        description: 'Complete brand redesign, responsive web portal, and SEO optimization.',
        img: 'https://assets.maccarianagency.com/svg/illustrations/designer.svg'
    }
];

const initialSeedAdmins = [
    { email: 'admin@mail.com', name: 'Super Admin', role: 'admin' },
    { email: 'admin@koshercode.com', name: 'Kosher Admin', role: 'admin' },
    { email: 'director@koshercode.ug', name: 'Director Tech', role: 'admin' },
    { email: 'tech@koshercode.com', name: 'Lead Architect', role: 'admin' }
];

/**
 * Automatically seeds the Cloud Firestore Database with initial datasets if collections are empty
 */
export const seedFirestoreDatabase = async ({ force = false } = {}) => {
    const summary = {
        services: 0,
        pricing: 0,
        reviews: 0,
        orders: 0,
        users: 0,
        errors: []
    };

    try {
        // 1. Seed Services
        const servicesSnap = await db.collection('services').limit(1).get();
        if (servicesSnap.empty || force) {
            for (let i = 0; i < defaultServices.length; i++) {
                const s = defaultServices[i];
                const docId = `srv-${i + 1}`;
                await db.collection('services').doc(docId).set({
                    name: s.name,
                    price: s.price,
                    category: s.category,
                    iconType: s.iconType || '',
                    region: s.region || 'Global & Local',
                    description: s.description,
                    img: s.img,
                    orderIndex: i + 1,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                summary.services++;
            }
        }

        // 2. Seed Pricing
        const pricingSnap = await db.collection('pricing').limit(1).get();
        if (pricingSnap.empty || force) {
            for (let tabIdx = 0; tabIdx < defaultPricingData.length; tabIdx++) {
                const tabGroup = defaultPricingData[tabIdx];
                for (let cardIdx = 0; cardIdx < tabGroup.length; cardIdx++) {
                    const plan = tabGroup[cardIdx];
                    const docId = `plan-tab${tabIdx + 1}-tier${cardIdx + 1}`;
                    await db.collection('pricing').doc(docId).set({
                        tabIndex: tabIdx,
                        tierIndex: cardIdx,
                        title: plan.title,
                        name: plan.name,
                        price: plan.price,
                        description: plan.description,
                        features: plan.features,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                    summary.pricing++;
                }
            }
        }

        // 3. Seed Reviews
        const reviewsSnap = await db.collection('reviews').limit(1).get();
        if (reviewsSnap.empty || force) {
            for (let i = 0; i < initialSeedReviews.length; i++) {
                const r = initialSeedReviews[i];
                const docId = `rev-${i + 1}`;
                await db.collection('reviews').doc(docId).set({
                    ...r,
                    orderIndex: i + 1,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                summary.reviews++;
            }
        }

        // 4. Seed Initial Orders
        const ordersSnap = await db.collection('orders').limit(1).get();
        if (ordersSnap.empty || force) {
            for (let i = 0; i < initialSeedOrders.length; i++) {
                const o = initialSeedOrders[i];
                const docId = `ord-${101 + i}`;
                await db.collection('orders').doc(docId).set({
                    ...o,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                summary.orders++;
            }
        }

        // 5. Seed Initial Admins & Roles
        const usersSnap = await db.collection('users').limit(1).get();
        if (usersSnap.empty || force) {
            for (const admin of initialSeedAdmins) {
                await saveUserToFirestore({
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                    institution: 'Kosher Code Leadership',
                    img: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                });
                summary.users++;
            }
        }

        return { success: true, summary };
    } catch (err) {
        console.warn('Firestore database seeding notice:', err.message);
        summary.errors.push(err.message);
        return { success: false, summary, error: err.message };
    }
};

/**
 * Retrieves aggregate collection count metrics from Firestore
 */
export const getFirestoreStats = async () => {
    const stats = {
        services: 0,
        pricing: 0,
        reviews: 0,
        orders: 0,
        users: 0,
        contacts: 0,
        connected: false
    };

    try {
        const [servicesSnap, pricingSnap, reviewsSnap, ordersSnap, usersSnap, contactsSnap] = await Promise.all([
            db.collection('services').get(),
            db.collection('pricing').get(),
            db.collection('reviews').get(),
            db.collection('orders').get(),
            db.collection('users').get(),
            db.collection('contacts').get()
        ]);

        stats.services = servicesSnap.size;
        stats.pricing = pricingSnap.size;
        stats.reviews = reviewsSnap.size;
        stats.orders = ordersSnap.size;
        stats.users = usersSnap.size;
        stats.contacts = contactsSnap.size;
        stats.connected = true;
    } catch (err) {
        console.warn('Error fetching Firestore stats:', err.message);
    }

    return stats;
};

// ----------------------------------------------------
// 9. FIREBASE CONNECTIVITY DIAGNOSTICS
// ----------------------------------------------------

export const checkFirebaseConnectivity = async () => {
    const results = {
        auth: false,
        firestore: false,
        projectId: firebaseConfig.projectId,
        error: null
    };

    try {
        if (auth) results.auth = true;
        await db.collection('_health_check').limit(1).get();
        results.firestore = true;
    } catch (err) {
        results.error = err.message || err.code;
        console.warn('Firebase connectivity check:', err.message);
    }

    return results;
};

export default firebase;
