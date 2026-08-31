import React, { useState } from 'react';
import './UserAvatar.css';
import defaultUserSvg from '../../../Assets/user.svg';

const GRADIENT_PALETTES = [
    'linear-gradient(135deg, #7355F7 0%, #4B24F5 100%)',
    'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
    'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
    'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)'
];

const getInitials = (nameStr = '') => {
    if (!nameStr) return 'KC';
    // If it's an email
    if (nameStr.includes('@')) {
        const username = nameStr.split('@')[0];
        return username.substring(0, 2).toUpperCase();
    }
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
};

const getGradientForString = (str = '') => {
    if (!str) return GRADIENT_PALETTES[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % GRADIENT_PALETTES.length;
    return GRADIENT_PALETTES[index];
};

const UserAvatar = ({
    src,
    name = '',
    size = 'md',
    role = '',
    ring = true,
    ringType = 'glow',
    showStatus = false,
    statusColor = '#10B981',
    className = '',
    style = {},
    onClick,
    interactive = false
}) => {
    const [hasError, setHasError] = useState(false);

    // Determine pixel or preset dimensions
    const isPreset = typeof size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].includes(size);
    const sizeClass = isPreset ? `kc-avatar-${size}` : '';
    const customSizeStyle = !isPreset ? {
        width: `${typeof size === 'number' ? size : parseInt(size, 10)}px`,
        height: `${typeof size === 'number' ? size : parseInt(size, 10)}px`,
        fontSize: `${(typeof size === 'number' ? size : parseInt(size, 10)) * 0.38}px`
    } : {};

    // Ring styling
    let ringClass = '';
    if (ring) {
        if (ringType === 'glow') ringClass = 'kc-avatar-ring-glow';
        else if (ringType === 'subtle') ringClass = 'kc-avatar-ring-subtle';
        else ringClass = 'kc-avatar-ring';
    }

    const initials = getInitials(name);
    const backgroundGradient = getGradientForString(name || role);

    const imageSource = (!hasError && src) ? src : (src === false ? null : (!hasError && src === undefined ? defaultUserSvg : null));

    return (
        <div 
            className={`kc-avatar-container ${sizeClass} ${ringClass} ${interactive || onClick ? 'interactive' : ''} ${className}`.trim()}
            style={{ ...customSizeStyle, ...style }}
            onClick={onClick}
            title={name || 'User Avatar'}
        >
            <div className="kc-avatar-img-wrap" style={{ background: backgroundGradient }}>
                {imageSource ? (
                    <img 
                        src={imageSource} 
                        alt={name || 'Avatar'} 
                        className="kc-avatar-img"
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <div className="kc-avatar-initials">
                        {initials}
                    </div>
                )}
            </div>

            {showStatus && (
                <span 
                    className="kc-avatar-status" 
                    style={{ backgroundColor: statusColor }}
                    title="Online Active"
                />
            )}
        </div>
    );
};

export default UserAvatar;
