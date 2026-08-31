import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const BuildTools = () => {
    const theme = useTheme();

    return (
        <Box sx={{ bgcolor: 'var(--site-bg, #FFFFFF)', py: { xs: 4, md: 6 }, px: 2, transition: 'background-color 0.25s ease' }}>
            <Box marginBottom={4}>
                <Box marginBottom={2}>
                    <Typography
                        variant="h4"
                        align={'center'}
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            color: 'var(--site-text-main, #070120)',
                            fontSize: { xs: '1.65rem', md: '2.1rem' }
                        }}
                    >
                        Enterprise Infrastructure & Multi-Continental Integration
                    </Typography>
                    <Typography
                        variant="h6"
                        component="p"
                        sx={{ 
                            fontWeight: 400,
                            color: 'var(--site-text-muted, #555555)',
                            fontSize: { xs: '0.95rem', md: '1.1rem' },
                            maxWidth: '750px',
                            mx: 'auto'
                        }}
                        align={'center'}
                    >
                        Unified API gateway supporting MTN MoMo, Airtel Money, Core Banking, SWIFT, and multi-region cloud clusters.
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" justifyContent="center">
                <Box
                    sx={{ width: { xs: '100%', md: '65%', lg: '58%' }}}
                    component={SyntaxHighlighter}
                    language={'javascript'}
                    style={vs2015}
                    padding={`${theme.spacing(2.5)} !important`}
                    borderRadius="4px"
                    margin={`${theme.spacing(0)} !important`}
                    bgcolor={'#070120 !important'}
                    border={'1px solid #2608AB'}
                    boxShadow={'0 8px 30px rgba(38, 8, 171, 0.15)'}
                >
                    {`// Kosher Code Multi-Continental Enterprise Gateway
import { KosherGateway } from '@kosher-code/enterprise-sdk';

const transaction = await KosherGateway.Banking.process({
  institution: "Kampala Apex SACCO / Commercial Bank",
  region: "Uganda / Pan-Africa / Global",
  currency: "UGX", // Supports UGX, KES, TZS, USD, EUR, GBP
  channel: "MOBILE_MONEY_MTN_AIRTEL_OR_SWIFT",
  amount: 50000000,
  compliance: {
    dppaUganda: true,
    pciDssLevel1: true,
    gdpr: true
  },
  settlement: "INSTANT_CORE_BANKING_RECONCILIATION"
});`}
                </Box>
            </Box>
        </Box>
    )
}

export default BuildTools
