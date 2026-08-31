import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMobileAlt, 
    faCreditCard, 
    faCloud, 
    faLaptopCode 
} from '@fortawesome/free-solid-svg-icons';

const data = [
    {
        title: 'Mobile Money Rails',
        subtitle:
            'Native USSD, STK Push & Open API integrations with MTN MoMo, Airtel Money, M-Pesa, and national payment switches.',
        icon: faMobileAlt,
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.28)',
    },
    {
        title: 'Banking & Card Switches',
        subtitle:
            'Seamless integration with SWIFT, Visa, Mastercard, Interswitch, Flutterwave, and Stripe for global settlement.',
        icon: faCreditCard,
        color: '#3B82F6',
        bg: 'rgba(59, 130, 246, 0.12)',
        border: 'rgba(59, 130, 246, 0.28)',
    },
    {
        title: 'Cloud & Geo-Redundancy',
        subtitle:
            'High-availability deployments on AWS, Microsoft Azure, Google Cloud, and private African data sovereign centers.',
        icon: faCloud,
        color: '#7355F7',
        bg: 'rgba(115, 85, 247, 0.12)',
        border: 'rgba(115, 85, 247, 0.28)',
    },
    {
        title: 'Cross-Platform & Offline Apps',
        subtitle:
            'Progressive Web Apps (PWAs), Android, and iOS applications with offline-first synchronization for remote branches.',
        icon: faLaptopCode,
        color: '#F59E0B',
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.28)',
    },
];

const BrowserSupport = () => {
    return (
        <Box 
            component="section"
            sx={{ 
                bgcolor: 'var(--site-bg, #FFFFFF)', 
                color: 'var(--site-text-main, #070120)',
                py: { xs: 6, md: 8 },
                px: { xs: 2.5, md: 4 },
                transition: 'background-color 0.25s ease'
            }}
        >
            <Box maxWidth="1200px" mx="auto">
                <Box mb={{ xs: 4, md: 6 }} textAlign={'center'}>
                    <Typography
                        sx={{
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            color: 'var(--site-primary, #7355F7)',
                            letterSpacing: '0.08em',
                            fontSize: { xs: '0.82rem', md: '0.9rem' },
                            mb: 1.5
                        }}
                    >
                        Multi-Continental Infrastructure
                    </Typography>
                    <Typography 
                        fontWeight={700} 
                        variant={'h4'} 
                        sx={{ 
                            color: 'var(--site-text-main, #070120)',
                            fontSize: { xs: '1.65rem', md: '2.2rem' },
                            lineHeight: 1.25,
                            maxWidth: '780px',
                            mx: 'auto',
                            mb: 2
                        }}
                    >
                        Engineered for African Telcos, Global Banks & Cloud Ecosystems
                    </Typography>
                    <Typography 
                        sx={{ 
                            color: 'var(--site-text-muted, #555555)',
                            fontSize: { xs: '0.92rem', md: '1.02rem' },
                            maxWidth: '680px',
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        Architecting resilient payment rails, core banking integrations, and mission-critical cloud grids.
                    </Typography>
                </Box>
                <Grid container spacing={{ xs: 2.5, md: 3.5 }}>
                    {data.map((item, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Box
                                width={1}
                                height={1}
                                data-aos={'fade-up'}
                                data-aos-delay={i * 100}
                                data-aos-offset={100}
                                data-aos-duration={600}
                                sx={{
                                    p: { xs: 3, md: 3.5 },
                                    borderRadius: '6px',
                                    bgcolor: 'var(--site-card-bg, #FFFFFF)',
                                    border: '1px solid var(--site-border, #E5E0FA)',
                                    boxShadow: 'var(--site-shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.04))',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    height: '100%',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        borderColor: item.color,
                                        boxShadow: 'var(--site-shadow-md, 0 10px 28px rgba(115, 85, 247, 0.12))',
                                        '& .infra-icon-box': {
                                            bgcolor: item.color,
                                            color: '#FFFFFF',
                                            borderColor: item.color,
                                            transform: 'scale(1.08)'
                                        }
                                    }
                                }}
                            >
                                <Box
                                    className="infra-icon-box"
                                    sx={{ 
                                        width: 64,
                                        height: 64,
                                        borderRadius: '8px', 
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: item.bg, 
                                        border: `1px solid ${item.border}`,
                                        color: item.color,
                                        fontSize: '1.65rem',
                                        mb: 2.5,
                                        transition: 'all 0.25s ease',
                                    }}
                                >
                                    <FontAwesomeIcon icon={item.icon} />
                                </Box>
                                <Typography
                                    variant={'h6'}
                                    fontWeight={600}
                                    sx={{ color: 'var(--site-text-main, #070120)', fontSize: '1.05rem', mb: 1.2 }}
                                >
                                    {item.title}
                                </Typography>
                                <Typography sx={{ color: 'var(--site-text-muted, #666666)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                                    {item.subtitle}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default BrowserSupport;
