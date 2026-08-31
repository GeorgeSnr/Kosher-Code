import React from 'react';

export const ServiceIcon = ({ iconType }) => {
    switch (iconType) {
        case 'web-design':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <rect x="12" y="14" width="40" height="34" rx="3" stroke="#7355F7" strokeWidth="2" fill="#FFFFFF" />
                    <line x1="12" y1="23" x2="52" y2="23" stroke="#E5E0FA" strokeWidth="2" />
                    <circle cx="17" cy="18.5" r="1.5" fill="#7355F7" />
                    <circle cx="22" cy="18.5" r="1.5" fill="#9D88FA" />
                    <circle cx="27" cy="18.5" r="1.5" fill="#C4B8FD" />
                    <rect x="16" y="27" width="14" height="16" rx="2" fill="#FAF8FF" stroke="#E5E0FA" strokeWidth="1" />
                    <line x1="34" y1="28" x2="48" y2="28" stroke="#7355F7" strokeWidth="2" strokeLinecap="round" />
                    <line x1="34" y1="34" x2="45" y2="34" stroke="#8E92BC" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="34" y1="40" x2="42" y2="40" stroke="#8E92BC" strokeWidth="1.8" strokeLinecap="round" />
                    <rect x="42" y="40" width="12" height="12" rx="3" fill="#7355F7" />
                    <path d="M45 46L47 48L51 44" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case 'web-dev':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <rect x="12" y="15" width="40" height="34" rx="3" fill="#070120" stroke="#2608AB" strokeWidth="2"/>
                    <path d="M22 28L17 32L22 36" stroke="#9D88FA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M42 28L47 32L42 36" stroke="#9D88FA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M34 26L30 38" stroke="#7355F7" strokeWidth="2.2" strokeLinecap="round"/>
                    <circle cx="16" cy="19" r="1" fill="#7355F7"/>
                    <circle cx="20" cy="19" r="1" fill="#9D88FA"/>
                    <circle cx="24" cy="19" r="1" fill="#C4B8FD"/>
                    <rect x="42" y="40" width="12" height="12" rx="3" fill="#4B24F5" />
                    <path d="M45 46L47 48L51 44" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            );
        case 'branding':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <path d="M32 14C22.0589 14 14 22.0589 14 32C14 41.9411 22.0589 50 32 50C34.7614 50 37 47.7614 37 45C37 43.6739 36.47 42.4783 35.61 41.61C34.75 40.75 34.22 39.5543 34.22 38.22C34.22 35.4586 36.4586 33.22 39.22 33.22H45C47.7614 33.22 50 30.9814 50 28.22C50 20.3686 41.9411 14 32 14Z" fill="#FFFFFF" stroke="#7355F7" strokeWidth="2"/>
                    <circle cx="23" cy="25" r="3" fill="#4B24F5" />
                    <circle cx="33" cy="21" r="3" fill="#7355F7" />
                    <circle cx="42" cy="26" r="3" fill="#9D88FA" />
                    <circle cx="24" cy="36" r="3" fill="#2608AB" />
                </svg>
            );
        case 'seo':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <rect x="14" y="16" width="36" height="34" rx="3" fill="#FFFFFF" stroke="#7355F7" strokeWidth="2"/>
                    <path d="M20 38L27 31L33 37L44 24" stroke="#4B24F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M38 24H44V30" stroke="#4B24F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="20" y="42" width="4" height="4" rx="1" fill="#E5E0FA" />
                    <rect x="27" y="38" width="4" height="8" rx="1" fill="#C4B8FD" />
                    <rect x="34" y="34" width="4" height="12" rx="1" fill="#9D88FA" />
                    <rect x="41" y="28" width="4" height="18" rx="1" fill="#7355F7" />
                </svg>
            );
        case 'marketing':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <path d="M16 28V36H22L34 44V20L22 28H16Z" fill="#FFFFFF" stroke="#7355F7" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M22 36V44C22 45.1046 22.8954 46 24 46H26C27.1046 46 28 45.1046 28 44V40" stroke="#7355F7" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M39 26C41.5 28 43 30.5 43 32C43 33.5 41.5 36 39 38" stroke="#4B24F5" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M44 21C48 24.5 50 28 50 32C50 36 48 39.5 44 43" stroke="#2608AB" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            );
        case 'mobile-apps':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <rect x="20" y="13" width="24" height="38" rx="3" fill="#FFFFFF" stroke="#7355F7" strokeWidth="2"/>
                    <line x1="28" y1="17" x2="36" y2="17" stroke="#E5E0FA" strokeWidth="2" strokeLinecap="round"/>
                    <rect x="24" y="22" width="16" height="20" rx="1" fill="#FAF8FF" stroke="#E5E0FA" strokeWidth="1"/>
                    <circle cx="32" cy="46.5" r="1.5" fill="#7355F7" />
                    <circle cx="32" cy="32" r="3" fill="#4B24F5" />
                </svg>
            );
        case 'msme-erp':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <rect x="14" y="16" width="36" height="32" rx="3" fill="#FFFFFF" stroke="#7355F7" strokeWidth="2"/>
                    <path d="M14 26H50" stroke="#E5E0FA" strokeWidth="2"/>
                    <rect x="19" y="31" width="10" height="12" rx="1" fill="#FAF8FF" stroke="#C4B8FD" strokeWidth="1"/>
                    <rect x="33" y="31" width="12" height="4" rx="1" fill="#4B24F5" />
                    <rect x="33" y="38" width="8" height="4" rx="1" fill="#7355F7" />
                    <circle cx="21" cy="21" r="1.5" fill="#7355F7" />
                    <circle cx="27" cy="21" r="1.5" fill="#4B24F5" />
                </svg>
            );
        case 'sacco-erp':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <rect x="15" y="15" width="34" height="34" rx="3" fill="#FFFFFF" stroke="#7355F7" strokeWidth="2"/>
                    <circle cx="32" cy="32" r="10" stroke="#4B24F5" strokeWidth="1.8" fill="#FAF8FF"/>
                    <path d="M32 26V38M28 29H34C35.1 29 36 29.9 36 31C36 32.1 35.1 33 34 33H30C28.9 33 28 33.9 28 35C28 36.1 28.9 37 30 37H36" stroke="#2608AB" strokeWidth="1.8" strokeLinecap="round"/>
                    <rect x="42" y="16" width="6" height="6" rx="1" fill="#7355F7"/>
                    <rect x="16" y="42" width="6" height="6" rx="1" fill="#7355F7"/>
                </svg>
            );
        case 'banking':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <path d="M32 14L14 23V26H50V23L32 14Z" fill="#2608AB" stroke="#4B24F5" strokeWidth="2"/>
                    <rect x="18" y="27" width="5" height="15" fill="#7355F7" rx="1"/>
                    <rect x="26" y="27" width="5" height="15" fill="#7355F7" rx="1"/>
                    <rect x="34" y="27" width="5" height="15" fill="#7355F7" rx="1"/>
                    <rect x="42" y="27" width="5" height="15" fill="#7355F7" rx="1"/>
                    <rect x="13" y="42" width="38" height="6" rx="1" fill="#2608AB"/>
                    <rect x="42" y="40" width="12" height="12" rx="3" fill="#4B24F5"/>
                    <path d="M48 43V49M46 45H49.5C50 45 50.5 45.5 50.5 46C50.5 46.5 50 47 49.5 47H46.5C46 47 45.5 47.5 45.5 48C45.5 48.5 46 49 46.5 49H50" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
            );
        case 'payments':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <rect x="14" y="18" width="36" height="24" rx="3" fill="#FFFFFF" stroke="#7355F7" strokeWidth="2"/>
                    <path d="M14 26H50" stroke="#7355F7" strokeWidth="2"/>
                    <rect x="19" y="32" width="8" height="5" rx="1" fill="#E5E0FA"/>
                    <path d="M22 47L30 47M30 47L26 43M30 47L26 51" stroke="#4B24F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M42 47L34 47M34 47L38 43M34 47L38 51" stroke="#2608AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case 'custom-software':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <rect x="14" y="16" width="36" height="12" rx="2" fill="#FFFFFF" stroke="#7355F7" strokeWidth="2"/>
                    <circle cx="20" cy="22" r="1.5" fill="#4B24F5"/>
                    <line x1="28" y1="22" x2="44" y2="22" stroke="#8E92BC" strokeWidth="1.8" strokeLinecap="round"/>
                    <rect x="14" y="34" width="36" height="12" rx="2" fill="#FFFFFF" stroke="#7355F7" strokeWidth="2"/>
                    <circle cx="20" cy="40" r="1.5" fill="#2608AB"/>
                    <line x1="28" y1="40" x2="44" y2="40" stroke="#8E92BC" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M32 28V34" stroke="#4B24F5" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            );
        case 'cybersecurity':
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <path d="M32 14L46 19V30C46 40 39.5 47.5 32 50C24.5 47.5 18 40 18 30V19L32 14Z" fill="#FFFFFF" stroke="#7355F7" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M28 32L31 35L37 28" stroke="#4B24F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        default:
            return (
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="4" fill="#F4F0FF" />
                    <circle cx="32" cy="32" r="14" stroke="#7355F7" strokeWidth="2" fill="#FFFFFF"/>
                    <path d="M32 24V32L38 35" stroke="#4B24F5" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            );
    }
};

export default ServiceIcon;
