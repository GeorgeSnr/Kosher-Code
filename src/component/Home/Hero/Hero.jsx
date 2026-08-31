import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typed from 'react-typed';

const Hero = () => {
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    return (
        <Container maxWidth="lg" sx={{ pt: { xs: 2, sm: 2.5, md: 3 }, pb: { xs: 5, md: 6 } }}>
            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Box data-aos={isMd ? 'fade-right' : 'fade-up'}>
                        {/* Top Eyebrow Badge */}
                        <Box
                            display="inline-flex"
                            alignItems="center"
                            gap={1}
                            px={1.5}
                            py={0.6}
                            mb={2.5}
                            sx={{
                                bgcolor: 'var(--site-primary-subtle, #F4F0FF)',
                                border: '1px solid var(--site-border, #E5E0FA)',
                                borderRadius: '4px',
                                color: 'var(--site-primary, #7355F7)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase'
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '2px',
                                    bgcolor: 'var(--site-primary, #7355F7)',
                                    display: 'inline-block'
                                }}
                            />
                            Software & FinTech Engineering • Uganda HQ
                        </Box>

                        {/* Main Title with Readably Paced Typed Animation */}
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.85rem' },
                                color: 'var(--site-text-main, #070120)',
                                lineHeight: 1.22,
                                letterSpacing: '-0.02em',
                                mb: 2
                            }}
                        >
                            Kosher Code <br />
                            Solutions for{' '}
                            <Box
                                component="span"
                                sx={{
                                    color: 'var(--site-primary, #7355F7)',
                                    display: 'inline-block'
                                }}
                            >
                                <Typed
                                    strings={[
                                        'Banking & FinTech',
                                        'SACCOs & Microfinance',
                                        'MSMEs & Enterprise ERPs',
                                        'Web & Mobile Apps',
                                        'UI/UX & Brand Design',
                                        'Uganda, Africa & Global'
                                    ]}
                                    typeSpeed={40}
                                    backSpeed={25}
                                    backDelay={2200}
                                    startDelay={300}
                                    loop={true}
                                    smartBackspace={true}
                                />
                            </Box>
                        </Typography>

                        {/* Subtitle Description */}
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'var(--site-text-muted, #555555)',
                                fontSize: { xs: '0.98rem', md: '1.05rem' },
                                lineHeight: 1.65,
                                maxWidth: '520px',
                                mb: 3.5
                            }}
                        >
                            Architecting bank-grade financial platforms, cloud SACCO management systems, bespoke web and mobile applications, and high-performance ERPs tailored for East Africa and multi-continental growth.
                        </Typography>

                        {/* Call to Action Buttons */}
                        <Box
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                            gap={2}
                            mb={3.5}
                        >
                            <Button
                                component="a"
                                href="#services"
                                variant="contained"
                                size="large"
                                sx={{
                                    borderRadius: '4px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    px: 3.5,
                                    py: 1.25,
                                    bgcolor: 'var(--site-primary, #7355F7)',
                                    color: '#FFFFFF',
                                    '&:hover': { bgcolor: 'var(--site-primary-hover, #4B24F5)' },
                                    boxShadow: '0 4px 14px rgba(115, 85, 247, 0.3)'
                                }}
                            >
                                Explore Solutions &rarr;
                            </Button>
                            <Button
                                component={Link}
                                to="/client/book"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderRadius: '4px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    px: 3.5,
                                    py: 1.25,
                                    borderColor: 'var(--site-primary, #7355F7)',
                                    color: 'var(--site-primary, #7355F7)',
                                    bgcolor: 'var(--site-card-bg, #FFFFFF)',
                                    '&:hover': {
                                        borderColor: 'var(--site-primary-hover, #4B24F5)',
                                        bgcolor: 'var(--site-primary-subtle, #F4F0FF)',
                                        color: 'var(--site-primary-hover, #4B24F5)'
                                    }
                                }}
                            >
                                Book Consultation
                            </Button>
                        </Box>

                        {/* Trust Badges */}
                        <Box
                            display="flex"
                            flexWrap="wrap"
                            alignItems="center"
                            gap={{ xs: 1.5, sm: 2.5 }}
                            pt={2.5}
                            sx={{ borderTop: '1px solid var(--site-border, #E5E0FA)', maxWidth: '520px' }}
                        >
                            <Box display="flex" alignItems="center" gap={0.8}>
                                <Box component="span" sx={{ color: 'var(--site-primary, #7355F7)', fontWeight: 700, fontSize: '0.85rem' }}>&#10004;</Box>
                                <Typography variant="caption" sx={{ color: 'var(--site-text-muted, #666666)', fontWeight: 600, fontSize: '0.8rem' }}>
                                    Bank-Grade Security
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.8}>
                                <Box component="span" sx={{ color: 'var(--site-primary, #7355F7)', fontWeight: 700, fontSize: '0.85rem' }}>&#10004;</Box>
                                <Typography variant="caption" sx={{ color: 'var(--site-text-muted, #666666)', fontWeight: 600, fontSize: '0.8rem' }}>
                                    MoMo & SWIFT Ready
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.8}>
                                <Box component="span" sx={{ color: 'var(--site-primary, #7355F7)', fontWeight: 700, fontSize: '0.85rem' }}>&#10004;</Box>
                                <Typography variant="caption" sx={{ color: 'var(--site-text-muted, #666666)', fontWeight: 600, fontSize: '0.8rem' }}>
                                    24/7 Dedicated SLA
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                {/* Right Column: Hero Visual */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    data-aos="flip-left"
                    data-aos-easing="ease-out-cubic"
                    data-aos-duration="2000"
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: { xs: 1, md: 2 }
                        }}
                    >
                        <Box
                            component={LazyLoadImage}
                            src={'https://assets.maccarianagency.com/screenshots/dashboard.png'}
                            alt="Kosher Code Enterprise Platform"
                            effect="blur"
                            sx={{
                                width: '100%',
                                maxWidth: '580px',
                                height: 'auto',
                                borderRadius: '4px',
                                border: '1px solid var(--site-border, #E5E0FA)',
                                boxShadow: 'var(--site-shadow-md, 0 15px 35px rgba(115, 85, 247, 0.12))'
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Hero;
