import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Portal Error Boundary caught an error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReset = () => {
        try {
            sessionStorage.clear();
        } catch (e) {}
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0B0F19',
                    color: '#F8FAFC',
                    fontFamily: "'Inter', sans-serif",
                    padding: '2rem'
                }}>
                    <div style={{
                        maxWidth: '560px',
                        width: '100%',
                        backgroundColor: '#111827',
                        border: '1px solid #232F46',
                        borderRadius: '8px',
                        padding: '2.5rem',
                        textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            color: '#EF4444',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            marginBottom: '1.25rem'
                        }}>
                            !
                        </div>
                        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#FFFFFF' }}>Workspace Display Notice</h3>
                        <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                            We encountered a display initialization issue loading this portal view. You can reload the workspace or return to the main site.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={this.handleReload}
                                style={{
                                    backgroundColor: '#7355F7',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '0.75rem 1.5rem',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Reload Workspace
                            </button>
                            <button
                                onClick={this.handleReset}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    color: '#E2E8F0',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '4px',
                                    padding: '0.75rem 1.5rem',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
