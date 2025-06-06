
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { keyframes } from '@emotion/react';

import CheckroomIcon from '@mui/icons-material/Checkroom';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import DevicesIcon from '@mui/icons-material/Devices';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const iconMap = {
    Checkroom: <CheckroomIcon sx={{ fontSize: '3rem', color: '#c67eff' }} />,
    RuleFolder: <RuleFolderIcon sx={{ fontSize: '3rem', color: '#c67eff' }} />,
    Devices: <DevicesIcon sx={{ fontSize: '3rem', color: '#c67eff' }} />,
    Default: <HelpOutlineIcon sx={{ fontSize: '3rem', color: '#c67eff' }} />
};

const cardPop = keyframes`
  from {
    opacity: 0.7;
    transform: scale(0.98) translateY(5px) translateZ(0);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0) translateZ(0);
  }
`;

const InfoCardsSection = ({ infoCards }) => {
    if (!infoCards || infoCards.length === 0) return null;

    return (
        <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
            <Typography variant="h2" component="h2" sx={{
                textAlign: 'center', fontWeight: 'bold', color: 'white',
                mb: { xs: 4, md: 6 },
                textShadow: '0 0 20px rgba(198, 126, 255, 0.4)',
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
                background: 'linear-gradient(120deg, #e6ceff 0%, #c67eff 60%, #a96cff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                Корисна Інформація
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {infoCards.map((info, index) => (
                    <Grid item xs={12} sm={6} md={4} key={info.id}>
                        <Card sx={{
                            height: '100%',
                            background: 'rgba(40, 30, 65, 0.92)',
                            borderRadius: '20px',
                            border: '1px solid rgba(138, 43, 226, 0.4)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            animation: `${cardPop} 0.5s ease-out ${index * 0.1}s backwards`,
                            '&:hover': {
                                transform: 'translateY(-10px) scale(1.03) translateZ(0)',
                                boxShadow: '0 18px 45px rgba(138, 43, 226, 0.3), 0 0 25px rgba(138, 43, 226, 0.2)',
                                borderColor: 'rgba(198, 126, 255, 0.6)',
                            },
                            '&::before': {
                                content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '5px',
                                background: 'linear-gradient(90deg, #a96cff, #c67eff, #8a2be2)',
                                opacity: 0.75,
                            }
                        }}>
                            <CardContent sx={{ p: {xs: 2.5, sm:3.5}, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                                    {iconMap[info.iconName] || iconMap.Default }
                                    <Typography variant="h5" component="div" sx={{ fontWeight: '600', color: 'white', ml: 2.5, fontSize:'1.4rem' }}>
                                        {info.title}
                                    </Typography>
                                </Box>
                                <Box
                                    color="rgba(230, 220, 255, 0.88)"
                                    sx={{
                                        fontSize: '0.95rem', lineHeight: 1.8, flexGrow: 1,
                                        '& ul': { paddingLeft: '25px', margin: '0 0 12px 0', listStyleType: "'✧ '"},
                                        '& li': { marginBottom: '10px', paddingLeft: '8px' },
                                        '& p': { margin: '0 0 15px 0' }
                                    }}
                                    dangerouslySetInnerHTML={{ __html: info.content }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default InfoCardsSection;