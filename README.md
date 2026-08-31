# Kosher Code Consulting - Enterprise Software & FinTech Platform

> Full-Service Technology & Software Engineering Powerhouse headquartered in Kampala, Uganda, serving African and Global enterprises.

![Kosher Code Platform](https://assets.maccarianagency.com/svg/illustrations/designer.svg)

---

## 🚀 Overview

**Kosher Code Consulting** is a full-featured enterprise software portal providing end-to-end digital solutions for every stage of growth — ranging from foundational web/mobile design and digital marketing to core banking engines, SACCO/Microfinance ERPs, and multi-continental cloud architectures.

The application is powered by **React 17**, **Firebase Authentication**, **Cloud Firestore (NoSQL Database)**, and modern responsive UI components.

---

## ✨ Key Features

### 🏢 Public Enterprise Website
- **Hero & Capabilities Suite**: Comprehensive capability overview tailored for startups, SMEs, SACCOs, and commercial banks.
- **Dynamic Solutions Catalog**: Filterable catalog of services across 5 distinct sectors fetched in real-time from Cloud Firestore.
- **Interactive Multi-Tier Pricing**: 6-category pricing matrix with dynamic plans and feature tiers.
- **Verified Client Testimonials**: Carousel slider of verified executive reviews synchronized with Firestore.
- **Multi-Continental Infrastructure Showcase**: Highlights payment rail integrations (MTN MoMo, Airtel Money, M-Pesa, SWIFT, Visa, Stripe).
- **Enterprise Consultation Inquiries**: Integrated contact inquiry intake with automated Firestore logging.

### 🛡️ Client Engagement Portal
- **Executive KPI Dashboard**: Real-time proposal metrics (Total, Pending Review, In Engineering, Deployed).
- **Solution Configurator & Booking**: Custom scope parameters, sector selection, pricing models, and direct SLA commitment.
- **Active Engagements Tracker**: Live status updates (`Pending` ➔ `In Review` ➔ `In Progress` ➔ `Done`).
- **Verified Testimonial Submissions**: Interactive 5-star rating and feedback publisher.
- **Direct Engineering Support Channel**: Dedicated priority SLA contact desk.

### 👑 Administrator Command Center
- **Executive Operations Hub**: Real-time proposal pipeline review and status transition engine.
- **Service Catalog Management**: Add, edit, and delete solutions in the active catalog with instant Firestore synchronization.
- **Admin Access Control**: Manage administrator privileges and promote registered users to platform admins.
- **User Directory**: Live directory of users registered through Firebase Authentication and Firestore.
- **Inbound Consultation Queue**: Review and process incoming enterprise consultation and demo requests.
- **Firebase Database Management Panel**: Live Firestore health monitor, collection document counts, and one-click database seeding engine.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 17, React Router DOM v6
- **Styling & Components**: Bootstrap 5, React-Bootstrap, Material-UI (MUI), Custom CSS Design Tokens
- **Backend & Cloud Database**: Google Firebase (Compat v9/v8 SDK)
  - **Firebase Authentication**: Email/Password and Google OAuth Popup
  - **Cloud Firestore**: Real-time NoSQL document database with offline persistence
- **Icons & Visuals**: FontAwesome 5 (Solid, Brands, Regular), Custom SVG Illustrations
- **State Management**: React Context API (`useAppContext`) + Cloud Firestore Real-time Listeners
- **Alerts & Toasts**: React Hot Toast, SweetAlert (swal)
- **Sliders & Animations**: Swiper.js, React-Reveal (Fade), React-CountUp

---

## 🗄️ Cloud Firestore Data Architecture

The application connects to Firebase Cloud Firestore with the following collections:

| Collection | Description | Primary Fields |
|---|---|---|
| `services` | Active solutions and catalog services | `name`, `category`, `price`, `description`, `iconType`, `region`, `img`, `orderIndex` |
| `pricing` | Multi-tier pricing packages | `tabIndex`, `tierIndex`, `title`, `name`, `price`, `description`, `features` |
| `reviews` | Verified executive client testimonials | `name`, `address`, `service`, `description`, `rating`, `date` |
| `orders` | Solution bookings and commercial requests | `name`, `email`, `phone`, `institution`, `region`, `serviceName`, `price`, `pricingType`, `status`, `timeline`, `date` |
| `users` | Registered client and admin user profiles | `name`, `email`, `role` (`client` \| `admin`), `institution`, `phone`, `img`, `lastLogin` |
| `contacts` | Inbound demo requests and consultation inquiries | `name`, `email`, `institution`, `region`, `subject`, `description`, `status`, `date` |

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js**: v16.x, v18.x, v20.x, or v22.x
- **npm** or **yarn** or **pnpm**
- **Firebase Project**: [Firebase Console](https://console.firebase.google.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/kosher-code-consulting.git
cd kosher-code-consulting
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Configure Environment Variables
Copy the `.env.example` file to create your local `.env`:
```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase Web App credentials:
```env
SKIP_PREFLIGHT_CHECK=true
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. Start the Development Server
```bash
npm start
```
The application will launch at [http://localhost:3000](http://localhost:3000).

---

## 🚀 Building for Production

To create an optimized production build:
```bash
npm run build
```

> **Note for Node.js 17+**: If building on newer Node versions with OpenSSL 3.0, run:
> ```bash
> NODE_OPTIONS="--openssl-legacy-provider" npm run build
> ```

---

## 🔒 Firebase Security Rules

For testing and development, deploy the following Firestore Security Rules in the [Firebase Console](https://console.firebase.google.com/):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 📁 Project Directory Structure

```
kosher-code-consulting/
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore specifications
├── package.json                 # Project dependencies & scripts
├── README.md                    # Project documentation
├── public/                      # Static assets and index.html
└── src/
    ├── App.js                   # Root router & auto-seeding entry
    ├── App.css                  # Core CSS variables & styles
    ├── firebaseBaseConfig.js    # Firebase configuration loader
    ├── context/                 # Application context & reducer
    ├── services/
    │   ├── firebaseService.js   # Cloud Firestore API & real-time listeners
    │   └── storageService.js    # High-level state & storage bridge
    ├── component/
    │   ├── Home/                # Landing page sections (Hero, Services, Pricing, Reviews, Contact)
    │   ├── ClientPortal/        # Client Hub dashboard & engagement management
    │   ├── AdminPortal/         # Admin command center & inquiry pipelines
    │   ├── Dashoboard/          # Shared management (OrderList, ManageServices, AddService, MakeAdmin)
    │   ├── Login/               # Authentication & login modal components
    │   └── Shared/              # Shared UI components (Navbar, UserAvatar, Spinner)
    └── Assets/                  # Illustrations and graphic assets
```

---

## 👥 Default Demo Credentials

You can log in directly or register a new profile in the portal:

| Portal | Email | Role |
|---|---|---|
| **Admin Command Center** | `admin@koshercode.com` | `admin` |
| **Director Tech** | `director@koshercode.ug` | `admin` |
| **Client Portal** | `mukasa@kampalasacco.ug` | `client` |

---

## 📄 License

This project is proprietary software developed by **Kosher Code Consulting**.
All rights reserved.
